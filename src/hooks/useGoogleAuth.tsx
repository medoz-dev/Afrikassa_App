
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export const useGoogleAuth = () => {
  const { user } = useAuth();

  const handleGoogleSignIn = async (credential: string) => {
    try {
      // Décoder le JWT pour extraire les informations utilisateur
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const userData = {
        id: `google_${payload.sub}`,
        email: payload.email,
        nom: payload.name || 'Utilisateur Google',
        username: payload.email?.split('@')[0] || 'user',
        role: 'client',
        subscription_status: 'free',
        subscription_type: 'none',
        hasActiveSubscription: false
      };

      // Stocker les données utilisateur dans localStorage pour simulation
      localStorage.setItem('afrikassa_user', JSON.stringify(userData));
      localStorage.setItem('afrikassa_auth_method', 'google');
      
      // Forcer le rechargement de la page pour déclencher la mise à jour de l'auth
      window.location.reload();

      toast({
        title: "Connexion Google réussie",
        description: `Bienvenue ${userData.nom} !`,
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
      toast({
        title: "Erreur de connexion Google",
        description: "Une erreur est survenue lors de la connexion avec Google",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleGoogleError = (error: any) => {
    console.error('Erreur Google Sign-In:', error);
    toast({
      title: "Erreur Google",
      description: "Impossible de se connecter avec Google",
      variant: "destructive"
    });
  };

  return {
    handleGoogleSignIn,
    handleGoogleError
  };
};
