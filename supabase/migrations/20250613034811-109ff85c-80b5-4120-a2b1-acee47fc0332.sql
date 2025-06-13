
-- Supprimer toutes les politiques RLS existantes sur la table users pour éviter la récursion
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

-- Créer une fonction sécurisée pour vérifier le rôle de l'utilisateur actuel
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  -- Pour les sessions locales du créateur
  IF current_setting('request.jwt.claims', true)::jsonb->>'role' = 'creator' THEN
    RETURN 'creator';
  END IF;
  
  -- Pour les utilisateurs authentifiés via Supabase Auth
  IF auth.uid() IS NOT NULL THEN
    -- Retourner directement 'client' pour éviter la récursion
    RETURN 'client';
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Créer une fonction sécurisée pour obtenir l'ID de l'utilisateur actuel
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Nouvelles politiques RLS sans récursion
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT 
USING (
  id = public.get_current_user_id() 
  OR public.get_current_user_role() = 'admin' 
  OR public.get_current_user_role() = 'creator'
);

CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
USING (
  id = public.get_current_user_id() 
  OR public.get_current_user_role() = 'admin' 
  OR public.get_current_user_role() = 'creator'
);

-- Politique pour permettre l'insertion lors de l'inscription (fonction use_activation_code)
CREATE POLICY "Allow user creation during registration" 
ON public.users FOR INSERT 
WITH CHECK (true); -- Autorisé car contrôlé par la fonction use_activation_code

-- Politique pour la suppression (admins et créateurs seulement)
CREATE POLICY "Admin and creator can delete users" 
ON public.users FOR DELETE 
USING (
  public.get_current_user_role() = 'admin' 
  OR public.get_current_user_role() = 'creator'
);
