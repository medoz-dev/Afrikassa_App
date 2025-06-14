
import React, { useEffect } from 'react';

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
  onError?: (error: any) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  size?: 'large' | 'medium' | 'small';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
}

declare global {
  interface Window {
    google: any;
    handleGoogleSignIn: (response: any) => void;
  }
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  text = 'signin_with',
  size = 'large',
  theme = 'outline'
}) => {
  const CLIENT_ID = "379612386624-3b1cf75no85m105cnd64smrbme1ulv9n.apps.googleusercontent.com";

  useEffect(() => {
    // Charger le script Google GSI s'il n'est pas déjà chargé
    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Fonction globale pour gérer la réponse Google
    window.handleGoogleSignIn = (response: any) => {
      if (response.credential) {
        onSuccess(response.credential);
      } else if (onError) {
        onError(response);
      }
    };

    // Initialiser Google Sign-In une fois le script chargé
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: window.handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Rendre le bouton
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            type: 'standard',
            size: size,
            theme: theme,
            text: text,
            shape: 'rectangular',
            logo_alignment: 'left'
          }
        );
      } else {
        // Réessayer après un délai si Google n'est pas encore chargé
        setTimeout(initializeGoogleSignIn, 100);
      }
    };

    // Délai pour s'assurer que le script est chargé
    setTimeout(initializeGoogleSignIn, 500);

    return () => {
      // Nettoyer la fonction globale
      if (window.handleGoogleSignIn) {
        delete window.handleGoogleSignIn;
      }
    };
  }, [onSuccess, onError, text, size, theme]);

  return (
    <div className="w-full">
      <div id="google-signin-button" className="w-full flex justify-center"></div>
    </div>
  );
};

export default GoogleSignInButton;
