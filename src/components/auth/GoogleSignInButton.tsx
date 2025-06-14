
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
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Fonction globale pour gérer la réponse Google
    window.handleCredentialResponse = (response: any) => {
      console.log('Google credential response:', response);
      if (response.credential) {
        onSuccess(response.credential);
      } else if (onError) {
        onError(response);
      }
    };

    const loadGoogleScript = () => {
      return new Promise((resolve, reject) => {
        // Vérifier si le script existe déjà
        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        
        if (existingScript) {
          if (window.google) {
            resolve(true);
          } else {
            existingScript.addEventListener('load', () => resolve(true));
            existingScript.addEventListener('error', () => reject(false));
          }
          return;
        }

        // Créer un nouveau script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log('Google GSI script loaded successfully');
          scriptLoadedRef.current = true;
          resolve(true);
        };
        
        script.onerror = () => {
          console.error('Failed to load Google GSI script');
          reject(false);
        };
        
        document.head.appendChild(script);
      });
    };

    const initializeGoogleButton = () => {
      if (!containerRef.current) return;

      console.log('Initializing Google Sign-In button');
      
      // Nettoyer le contenu existant
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

      console.log('Google Sign-In button elements created');
    };

    // Charger le script et initialiser le bouton
    loadGoogleScript()
      .then(() => {
        // Attendre un peu que Google soit complètement initialisé
        setTimeout(() => {
          initializeGoogleButton();
        }, 100);
      })
      .catch((error) => {
        console.error('Error loading Google script:', error);
        if (onError) {
          onError({ message: 'Failed to load Google Sign-In' });
        }
      });

    return () => {
      // Nettoyer la fonction globale
      if (window.handleCredentialResponse) {
        delete window.handleCredentialResponse;
      }
    };
  }, [onSuccess, onError, text, size, theme]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full flex justify-center min-h-[48px]">
        {/* Le bouton Google sera injecté ici */}
      </div>
    </div>
  );
};

export default GoogleSignInButton;
