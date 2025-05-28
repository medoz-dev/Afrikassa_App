
import { supabase } from '@/integrations/supabase/client';

export interface StockItem {
  id: string;
  boisson_id: number;
  quantite: number;
  valeur: number;
  date_stock: string;
  client_id: string;
}

export interface ArrivageItem {
  id: string;
  boisson_id: number;
  quantite: number;
  valeur: number;
  type_trous: number;
  date_arrivage: string;
  client_id: string;
}

export const getStock = async (): Promise<StockItem[]> => {
  try {
    const { data, error } = await supabase
      .from('client_stock')
      .select('*')
      .order('date_stock', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur récupération stock:', error);
    return [];
  }
};

export const addArrivage = async (item: { boisson_id: number; quantite: number; valeur: number; type_trous: number }) => {
  try {
    // Récupérer l'ID du client actuel depuis le localStorage
    const currentUser = localStorage.getItem('current_user');
    let clientId = 'default';
    
    if (currentUser) {
      const user = JSON.parse(currentUser);
      clientId = user.id || 'default';
    }

    const { error } = await supabase
      .from('client_arrivage')
      .insert([{
        boisson_id: item.boisson_id,
        quantite: item.quantite,
        valeur: item.valeur,
        type_trous: item.type_trous,
        client_id: clientId,
        date_arrivage: new Date().toISOString().split('T')[0]
      }]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erreur ajout arrivage:', error);
    throw error;
  }
};

export const updateStock = async (id: string, updates: Partial<StockItem>) => {
  try {
    const { error } = await supabase
      .from('client_stock')
      .update(updates)
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erreur mise à jour stock:', error);
    throw error;
  }
};
