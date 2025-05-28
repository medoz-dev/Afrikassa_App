
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  username: string;
  nom: string;
  email?: string;
  role: 'admin' | 'client';
  statut: 'actif' | 'inactif';
  date_expiration?: string;
}

// Configuration de l'ID utilisateur pour RLS via Edge Function
const setCurrentUserId = async (userId: string) => {
  try {
    const response = await fetch('/functions/v1/set-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify({
        setting_name: 'app.current_user_id',
        setting_value: userId,
        is_local: false
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to set user context');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur configuration utilisateur:', error);
    // Fallback: utiliser une méthode alternative si disponible
    return null;
  }
};

export const login = async (username: string, password: string): Promise<User | null> => {
  try {
    // Récupérer l'utilisateur par nom d'utilisateur
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (error || !users || users.length === 0) {
      console.error('Utilisateur non trouvé:', error);
      return null;
    }

    const user = users[0];

    // Vérifier le mot de passe
    const { data: isValid, error: passwordError } = await supabase
      .rpc('verify_password', {
        password: password,
        hash: user.password_hash
      });

    if (passwordError || !isValid) {
      console.error('Mot de passe incorrect:', passwordError);
      return null;
    }

    // Vérifier le statut et l'expiration
    if (user.statut !== 'actif') {
      throw new Error('Compte inactif');
    }

    if (user.date_expiration && new Date(user.date_expiration) < new Date()) {
      throw new Error('Abonnement expiré');
    }

    // Configurer l'ID utilisateur pour RLS
    await setCurrentUserId(user.id);

    return {
      id: user.id,
      username: user.username,
      nom: user.nom,
      email: user.email,
      role: user.role as 'admin' | 'client',
      statut: user.statut as 'actif' | 'inactif',
      date_expiration: user.date_expiration
    };
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};

export const logout = async () => {
  // Effacer la configuration RLS
  await setCurrentUserId('');
};

export const createClient = async (clientData: {
  username: string;
  nom: string;
  email?: string;
  password: string;
  date_expiration?: string;
}) => {
  try {
    // Hasher le mot de passe d'abord
    const { data: hashedPassword, error: hashError } = await supabase
      .rpc('hash_password', { password: clientData.password });

    if (hashError || !hashedPassword) {
      throw new Error('Erreur lors du hashage du mot de passe');
    }

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: clientData.username,
          nom: clientData.nom,
          email: clientData.email,
          password_hash: hashedPassword,
          role: 'client',
          statut: 'actif',
          date_expiration: clientData.date_expiration
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur création client:', error);
    throw error;
  }
};
