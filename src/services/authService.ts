
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  username: string;
  nom: string;
  email: string;
  role: string;
  date_expiration: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  sessionToken?: string;
}

class AuthService {
  private sessionToken: string | null = null;

  constructor() {
    // Récupérer le token de session depuis le localStorage au démarrage
    this.sessionToken = localStorage.getItem('session_token');
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      // Obtenir des informations sur l'appareil
      const userAgent = navigator.userAgent;
      const ipAddress = await this.getClientIP();

      // Appeler la fonction Supabase pour créer une session
      const { data, error } = await supabase.rpc('create_user_session', {
        p_username: username,
        p_password: password,
        p_ip_address: ipAddress,
        p_user_agent: userAgent
      });

      if (error) {
        console.error('Erreur lors de la connexion:', error);
        return { success: false, message: 'Erreur de connexion' };
      }

      const result = data[0];
      if (result.success) {
        // Stocker le token de session
        this.sessionToken = result.session_token;
        localStorage.setItem('session_token', result.session_token);
        
        const userData = result.user_data as User;
        return {
          success: true,
          message: result.message,
          user: userData,
          sessionToken: result.session_token
        };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { success: false, message: 'Erreur de connexion' };
    }
  }

  async validateSession(): Promise<{ valid: boolean; user?: User }> {
    if (!this.sessionToken) {
      return { valid: false };
    }

    try {
      const { data, error } = await supabase.rpc('validate_session', {
        p_session_token: this.sessionToken
      });

      if (error) {
        console.error('Erreur lors de la validation de session:', error);
        this.logout();
        return { valid: false };
      }

      const result = data[0];
      if (result.valid) {
        return { valid: true, user: result.user_data as User };
      } else {
        this.logout();
        return { valid: false };
      }
    } catch (error) {
      console.error('Erreur lors de la validation de session:', error);
      this.logout();
      return { valid: false };
    }
  }

  async logout(): Promise<boolean> {
    try {
      if (this.sessionToken) {
        await supabase.rpc('logout_session', {
          p_session_token: this.sessionToken
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer les données locales
      this.sessionToken = null;
      localStorage.removeItem('session_token');
      localStorage.removeItem('current_user');
    }
    return true;
  }

  async checkCreatorAccess(password: string): Promise<boolean> {
    // Garder l'accès créateur en local pour le moment
    return password === 'meki';
  }

  private async getClientIP(): Promise<string | null> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Impossible d\'obtenir l\'IP client:', error);
      return null;
    }
  }

  getSessionToken(): string | null {
    return this.sessionToken;
  }
}

export const authService = new AuthService();
