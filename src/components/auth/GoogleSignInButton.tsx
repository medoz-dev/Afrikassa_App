
import React, { useEffect, useRef } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Éviter la double initialisation
    if (isInitialized.current) return;
    
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
      console.log('Google credential response:', response);
      if (response.credential) {
        onSuccess(response.credential);
      } else if (onError) {
        onError(response);
      }
    };

    const initializeGoogleButton = () => {
      if (!containerRef.current) return;

      // Nettoyer le contenu existant du conteneur
      containerRef.current.innerHTML = '';

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
      containerRef.current.appendChild(onloadDiv);
      containerRef.current.appendChild(signinDiv);

      isInitialized.current = true;
      console.log('Google Sign-In button initialized');
    };

    // Initialiser immédiatement si le script est déjà chargé
    if (window.google) {
      initializeGoogleButton();
    } else {
      // Sinon, attendre que le script se charge
      const checkGoogleLoaded = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogleLoaded);
          initializeGoogleButton();
        }
      }, 100);

      // Timeout de sécurité
      setTimeout(() => {
        clearInterval(checkGoogleLoaded);
        if (!isInitialized.current) {
          console.warn('Google Sign-In script failed to load');
        }
      }, 10000);
    }

    return () => {
      // Nettoyer uniquement si c'est nécessaire
      if (window.handleCredentialResponse) {
        delete window.handleCredentialResponse;
      }
      isInitialized.current = false;
    };
  }, [onSuccess, onError, text, size, theme, CLIENT_ID, LOGIN_URI]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full flex justify-center min-h-[48px]"></div>
    </div>
  );
};

export default GoogleSignInButton;
