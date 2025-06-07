
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  username: string;
  nom: string;
  email: string;
  role: string;
  abonnement_actif: boolean;
  jours_restants: number;
  date_expiration?: string;
}

interface AuthContextType {
  user: UserData | null;
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
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier s'il y a une session locale au démarrage
    const localSession = localStorage.getItem('afrikassa_session');
    if (localSession) {
      try {
        const sessionData = JSON.parse(localSession);
        setUser(sessionData.user);
      } catch (error) {
        console.error('Erreur lors de la lecture de la session locale:', error);
        localStorage.removeItem('afrikassa_session');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Vérification créateur - connexion spéciale
      if (password === 'meki') {
        console.log('Connexion créateur détectée');
        
        const creatorUser: UserData = {
          id: 'creator-local',
          username: username,
          nom: 'Créateur AfriKassa',
          email: `creator-${username}@afrikassa.local`,
          role: 'creator',
          abonnement_actif: true,
          jours_restants: -1 // Illimité pour le créateur
        };

        setUser(creatorUser);

        // Stocker la session localement
        localStorage.setItem('afrikassa_session', JSON.stringify({
          user: creatorUser,
          timestamp: Date.now()
        }));

        toast({
          title: "Connexion créateur réussie",
          description: "Bienvenue dans le panneau créateur !",
        });
        return true;
      }

      // Pour les clients : vérifier directement dans la base de données
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

      // Vérifier le mot de passe avec la fonction Supabase
      const { data: passwordCheck, error: passwordError } = await supabase
        .rpc('verify_password', {
          password: password,
          hash: userRecord.password_hash
        });

      if (passwordError || !passwordCheck) {
        toast({
          title: "Échec de la connexion",
          description: "Mot de passe incorrect",
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

      // Vérifier l'abonnement
      if (!userRecord.abonnement_actif) {
        toast({
          title: "Abonnement inactif",
          description: "Votre abonnement a expiré. Contactez l'administrateur pour le renouveler.",
          variant: "destructive"
        });
        return false;
      }

      // Vérifier l'expiration si définie
      if (userRecord.date_expiration) {
        const dateExpiration = new Date(userRecord.date_expiration);
        const maintenant = new Date();
        
        if (maintenant > dateExpiration) {
          // Désactiver automatiquement l'abonnement
          await supabase
            .from('users')
            .update({ abonnement_actif: false, jours_restants: 0 })
            .eq('id', userRecord.id);

          toast({
            title: "Abonnement expiré",
            description: "Votre abonnement a expiré. Contactez l'administrateur pour le renouveler.",
            variant: "destructive"
          });
          return false;
        }
      }

      // Créer l'objet utilisateur
      const userData: UserData = {
        id: userRecord.id,
        username: userRecord.username,
        nom: userRecord.nom,
        email: userRecord.email || '',
        role: userRecord.role,
        abonnement_actif: userRecord.abonnement_actif,
        jours_restants: userRecord.jours_restants || 0,
        date_expiration: userRecord.date_expiration
      };

      setUser(userData);

      // Stocker la session localement
      localStorage.setItem('afrikassa_session', JSON.stringify({
        user: userData,
        timestamp: Date.now()
      }));

      // Mettre à jour les informations de connexion
      await supabase
        .from('users')
        .update({
          is_online: true,
          last_login: new Date().toISOString(),
          login_count: (userRecord.login_count || 0) + 1
        })
        .eq('id', userRecord.id);

      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${userRecord.nom} !`,
      });
      return true;

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
      // Mettre à jour le statut en ligne si ce n'est pas le créateur
      if (user && user.role !== 'creator') {
        await supabase
          .from('users')
          .update({ is_online: false })
          .eq('id', user.id);
      }

      // Nettoyer la session locale
      localStorage.removeItem('afrikassa_session');
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

  // Vérifier si c'est le créateur
  const isCreator = user?.role === 'creator';
  
  // Vérifier si c'est un admin
  const isAdmin = user?.role === 'admin';

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    isCreator,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
