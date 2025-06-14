
-- Ajouter une colonne pour gérer les abonnements de manière plus flexible
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS subscription_type TEXT DEFAULT 'none';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- Mettre à jour les utilisateurs existants pour qu'ils aient le statut gratuit par défaut
UPDATE public.users SET subscription_status = 'free' WHERE subscription_status IS NULL;

-- Créer une table pour gérer les plans d'abonnement
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_days INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insérer quelques plans d'abonnement par défaut
INSERT INTO public.subscription_plans (name, price, duration_days, features) VALUES
('Plan Mensuel', 5000, 30, '["Calculs illimités", "Gestion des stocks", "Rapports", "Support prioritaire"]'),
('Plan Trimestriel', 12000, 90, '["Calculs illimités", "Gestion des stocks", "Rapports", "Support prioritaire", "Analyses avancées"]'),
('Plan Annuel', 40000, 365, '["Calculs illimités", "Gestion des stocks", "Rapports", "Support prioritaire", "Analyses avancées", "Formations exclusives"]')
ON CONFLICT DO NOTHING;

-- Créer une table pour l'historique des paiements
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Politiques pour subscription_plans (lecture publique)
CREATE POLICY "Anyone can view subscription plans" 
ON public.subscription_plans FOR SELECT 
USING (true);

-- Politiques pour payments (utilisateurs peuvent voir leurs propres paiements)
CREATE POLICY "Users can view their own payments" 
ON public.payments FOR SELECT 
USING (user_id = auth.uid() OR public.get_current_user_role() = 'admin');

CREATE POLICY "Users can create their own payments" 
ON public.payments FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Fonction pour vérifier si un utilisateur a un abonnement actif
CREATE OR REPLACE FUNCTION public.has_active_subscription(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = p_user_id 
    AND subscription_status = 'active'
    AND (subscription_expires_at IS NULL OR subscription_expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonction pour vérifier si c'est l'admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Vérifier si c'est une session admin locale
  IF current_setting('request.jwt.claims', true)::jsonb->>'role' = 'admin' THEN
    RETURN true;
  END IF;
  
  -- Vérifier si l'utilisateur a le rôle admin dans la base
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
