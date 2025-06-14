
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
    handleCredentialResponse: (response: any) => void;
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
  const LOGIN_URI = "https://preview--afri-kassa-boissons25-61.lovable.app";

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
    window.handleCredentialResponse = (response: any) => {
      if (response.credential) {
        onSuccess(response.credential);
      } else if (onError) {
        onError(response);
      }
    };

    // Nettoyer les éléments existants
    const existingOnload = document.getElementById('g_id_onload');
    const existingSignin = document.querySelector('.g_id_signin');
    if (existingOnload) existingOnload.remove();
    if (existingSignin) existingSignin.remove();

    // Créer l'élément g_id_onload
    const onloadDiv = document.createElement('div');
    onloadDiv.id = 'g_id_onload';
    onloadDiv.setAttribute('data-client_id', CLIENT_ID);
    onloadDiv.setAttribute('data-login_uri', LOGIN_URI);
    onloadDiv.setAttribute('data-auto_prompt', 'false');
    onloadDiv.setAttribute('data-callback', 'handleCredentialResponse');
    
    // Créer l'élément g_id_signin
    const signinDiv = document.createElement('div');
    signinDiv.className = 'g_id_signin';
    signinDiv.setAttribute('data-type', 'standard');
    signinDiv.setAttribute('data-size', size);
    signinDiv.setAttribute('data-theme', theme);
    signinDiv.setAttribute('data-text', text);
    signinDiv.setAttribute('data-shape', 'rectangular');
    signinDiv.setAttribute('data-logo_alignment', 'left');

    // Ajouter les éléments au conteneur
    const container = document.getElementById('google-signin-container');
    if (container) {
      container.appendChild(onloadDiv);
      container.appendChild(signinDiv);
    }

    return () => {
      // Nettoyer la fonction globale et les éléments
      if (window.handleCredentialResponse) {
        delete window.handleCredentialResponse;
      }
      if (onloadDiv.parentNode) onloadDiv.remove();
      if (signinDiv.parentNode) signinDiv.remove();
    };
  }, [onSuccess, onError, text, size, theme]);

  return (
    <div className="w-full">
      <div id="google-signin-container" className="w-full flex justify-center"></div>
    </div>
  );
};

export default GoogleSignInButton;
