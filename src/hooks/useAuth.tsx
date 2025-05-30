
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  isCreator: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configuration de l'écoute des changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Vérification de la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Vérification créateur - connexion spéciale
      if (password === 'meki') {
        // Créer un utilisateur créateur temporaire dans Supabase Auth
        const creatorEmail = `creator-${username}@afrikassa.local`;
        
        try {
          // Essayer de se connecter en tant que créateur
          const { data, error } = await supabase.auth.signInWithPassword({
            email: creatorEmail,
            password: 'creator-meki-2024',
          });

          if (error && error.message.includes('Invalid login credentials')) {
            // Créer le compte créateur s'il n'existe pas
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: creatorEmail,
              password: 'creator-meki-2024',
              options: {
                data: {
                  username: username,
                  nom: 'Créateur AfriKassa',
                  role: 'creator'
                }
              }
            });

            if (signUpError) {
              console.error('Erreur création créateur:', signUpError);
              toast({
                title: "Erreur",
                description: "Impossible de créer le compte créateur",
                variant: "destructive"
              });
              return false;
            }
          } else if (error) {
            console.error('Erreur connexion créateur:', error);
            toast({
              title: "Erreur",
              description: "Impossible de se connecter en tant que créateur",
              variant: "destructive"
            });
            return false;
          }

          toast({
            title: "Connexion créateur réussie",
            description: "Bienvenue dans le panneau créateur !",
          });
          return true;
        } catch (err) {
          console.error('Erreur créateur:', err);
          toast({
            title: "Erreur",
            description: "Problème de connexion créateur",
            variant: "destructive"
          });
          return false;
        }
      }

      // Pour les clients : d'abord récupérer les infos depuis la table users
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError || !userRecord) {
        toast({
          title: "Échec de la connexion",
          description: "Nom d'utilisateur introuvable",
          variant: "destructive"
        });
        return false;
      }

      // Vérifier le statut du compte
      if (userRecord.statut !== 'actif') {
        toast({
          title: "Accès suspendu",
          description: "Votre compte a été désactivé. Contactez l'administrateur.",
          variant: "destructive"
        });
        return false;
      }

      // Vérifier l'expiration
      if (userRecord.date_expiration) {
        const dateExpiration = new Date(userRecord.date_expiration);
        const maintenant = new Date();
        
        if (maintenant > dateExpiration) {
          toast({
            title: "Abonnement expiré",
            description: "Votre abonnement a expiré. Contactez l'administrateur pour le renouveler.",
            variant: "destructive"
          });
          return false;
        }
      }

      // Vérifier si l'email est configuré
      if (!userRecord.email) {
        toast({
          title: "Erreur de configuration",
          description: "Aucun email associé à ce compte. Contactez l'administrateur.",
          variant: "destructive"
        });
        return false;
      }

      // Essayer de se connecter avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: userRecord.email,
        password: password,
      });

      if (authError) {
        console.error('Erreur de connexion Supabase:', authError);
        
        // Si le compte n'existe pas dans Auth mais existe dans notre DB
        if (authError.message.includes('Invalid login credentials')) {
          toast({
            title: "Compte non activé",
            description: "Votre compte n'a pas encore été confirmé. Vérifiez votre email ou contactez l'administrateur.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Échec de la connexion",
            description: "Mot de passe incorrect ou compte non confirmé",
            variant: "destructive"
          });
        }
        return false;
      }

      if (authData.user) {
        // Mise à jour des métadonnées utilisateur si nécessaire
        if (!authData.user.user_metadata?.username) {
          await supabase.auth.updateUser({
            data: {
              username: userRecord.username,
              nom: userRecord.nom,
              role: userRecord.role || 'client'
            }
          });
        }

        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${userRecord.nom} !`,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive"
      });
    }
  };

  // Vérifier si c'est le créateur (basé sur les métadonnées ou le rôle)
  const isCreator = user?.user_metadata?.role === 'creator' || false;
  
  // Vérifier si c'est un admin
  const isAdmin = user?.user_metadata?.role === 'admin' || false;

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isCreator,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
