
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lock, Crown, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  feature?: string;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ 
  children, 
  feature = "cette fonctionnalité" 
}) => {
  const { user, hasActiveSubscription, isAdmin } = useAuth();

  // Admin a accès à tout
  if (isAdmin) {
    return <>{children}</>;
  }

  // Utilisateur avec abonnement actif a accès
  if (hasActiveSubscription) {
    return <>{children}</>;
  }

  // Afficher le blocage pour les utilisateurs gratuits
  const handleWhatsAppContact = () => {
    const message = `Bonjour, je souhaite souscrire à un abonnement AfriKassa.%0A%0ANom: ${user?.nom || 'Non renseigné'}%0AEmail: ${user?.email || 'Non renseigné'}%0A%0AMerci de m'aider à activer mon abonnement.`;
    window.open(`https://wa.me/22961170017?text=${message}`, '_blank');
  };

  return (
    <div className="relative">
      {/* Overlay de blocage */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
        <div className="text-center p-8 max-w-md">
          <div className="mb-4">
            <Lock className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <Crown className="h-8 w-8 text-yellow-500 mx-auto" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Abonnement Requis
          </h3>
          
          <p className="text-gray-600 mb-6">
            Pour utiliser {feature}, vous devez activer un abonnement AfriKassa.
          </p>

          <div className="space-y-3">
            <Link to="/pricing">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                <Crown className="mr-2 h-4 w-4" />
                Voir les Abonnements
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleWhatsAppContact}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Contacter le Support
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Support WhatsApp: +229 61 17 00 17
          </p>
        </div>
      </div>

      {/* Contenu flou en arrière-plan */}
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default SubscriptionGuard;
