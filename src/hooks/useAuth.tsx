import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

interface UserData {
  id: string;
  email: string;
  username?: string;
  nom?: string;
  role: string;
  subscription_status: string;
  subscription_type: string;
  subscription_expires_at?: string;
  hasActiveSubscription: boolean;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, userData: { nom: string; username?: string }) => Promise<boolean>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  hasActiveSubscription: boolean;
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
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour transformer les données utilisateur Supabase
  const transformUser = async (supabaseUser: User): Promise<UserData | null> => {
    try {
      // Récupérer les données utilisateur depuis notre table personnalisée
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // L'utilisateur n'existe pas dans notre table personnalisée, le créer
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            nom: supabaseUser.user_metadata?.nom || supabaseUser.user_metadata?.full_name || 'Utilisateur',
            username: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'user',
            role: 'client',
            subscription_status: 'free',
            password_hash: 'oauth_user' // Valeur par défaut pour les utilisateurs OAuth
          })
          .select()
          .single();

        if (insertError) {
          console.error('Erreur lors de la création du profil utilisateur:', insertError);
          return null;
        }
        return transformUserData(newUser);
      }

      if (!userData) return null;

      return transformUserData(userData);
    } catch (error) {
      console.error('Erreur lors de la transformation de l\'utilisateur:', error);
      return null;
    }
  };

  // Fonction pour transformer les données utilisateur en UserData
  const transformUserData = (userData: any): UserData => {
    // Vérifier si l'abonnement est actif
    const hasActiveSubscription = userData.subscription_status === 'active' && 
      (userData.subscription_expires_at === null || new Date(userData.subscription_expires_at) > new Date());

    return {
      id: userData.id,
      email: userData.email || '',
      username: userData.username,
      nom: userData.nom,
      role: userData.role,
      subscription_status: userData.subscription_status || 'free',
      subscription_type: userData.subscription_type || 'none',
      subscription_expires_at: userData.subscription_expires_at,
      hasActiveSubscription
    };
  };

  // Vérification de la session au démarrage
  useEffect(() => {
    const getSession = async () => {
      try {
        // Vérifier d'abord si il y a une session Google locale
        const localUser = localStorage.getItem('afrikassa_user');
        const authMethod = localStorage.getItem('afrikassa_auth_method');
        
        if (localUser && authMethod === 'google') {
          const userData = JSON.parse(localUser);
          setUser(userData);
          setLoading(false);
          return;
        }

        // Sinon, vérifier la session Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData = await transformUser(session.user);
          setUser(userData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Écouter les changements d'authentification Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = await transformUser(session.user);
        setUser(userData);
      } else {
        // Vérifier si c'est une déconnexion et nettoyer le localStorage
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('afrikassa_user');
          localStorage.removeItem('afrikassa_auth_method');
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Connexion avec Google (maintenant via le composant GoogleSignInButton)
  const signInWithGoogle = async () => {
    toast({
      title: "Utilisez le bouton Google",
      description: "Veuillez utiliser le bouton Google Sign-In pour vous connecter",
    });
  };

  // Connexion avec email/mot de passe
  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Vérification admin spéciale
      if (password === 'meki2005') {
        // Connexion admin locale - créer une session admin fictive
        const adminUser: UserData = {
          id: 'admin-local',
          email: email,
          nom: 'Administrateur AfriKassa',
          role: 'admin',
          subscription_status: 'active',
          subscription_type: 'unlimited',
          hasActiveSubscription: true
        };

        setUser(adminUser);
        toast({
          title: "Connexion administrateur réussie",
          description: "Bienvenue dans le panneau administrateur !",
        });
        return true;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Échec de la connexion",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      if (data.user) {
        const userData = await transformUser(data.user);
        setUser(userData);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
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

  // Inscription
  const signUp = async (email: string, password: string, userData: { nom: string; username?: string }): Promise<boolean> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nom: userData.nom,
            username: userData.username || email.split('@')[0]
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        toast({
          title: "Échec de l'inscription",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte.",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      // Déconnexion Supabase
      await supabase.auth.signOut();
      
      // Nettoyer le localStorage pour Google
      localStorage.removeItem('afrikassa_user');
      localStorage.removeItem('afrikassa_auth_method');
      
      setUser(null);
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

  const isAdmin = user?.role === 'admin';
  const hasActiveSubscription = user?.hasActiveSubscription || false;

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUp,
    signOut,
    isAdmin,
    hasActiveSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
