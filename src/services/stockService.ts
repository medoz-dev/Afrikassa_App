
import { supabase } from '@/integrations/supabase/client';

export interface ClientStock {
  id: string;
  client_id: string;
  boisson_id: number;
  quantite: number;
  valeur: number;
  date_stock: string;
}

export const getClientStock = async (clientId: string, dateStock?: string): Promise<ClientStock[]> => {
  try {
    let query = supabase
      .from('client_stock')
      .select('*')
      .eq('client_id', clientId);

    if (dateStock) {
      query = query.eq('date_stock', dateStock);
    }

    const { data, error } = await query.order('boisson_id');

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur récupération stock:', error);
    return [];
  }
};

export const saveClientStock = async (clientId: string, stockItems: any[], dateStock: string) => {
  try {
    // Supprimer les données de stock existantes pour cette date
    await supabase
      .from('client_stock')
      .delete()
      .eq('client_id', clientId)
      .eq('date_stock', dateStock);

    // Insérer les nouvelles données
    const stockData = stockItems.map(item => ({
      client_id: clientId,
      boisson_id: item.boissonId,
      quantite: item.quantite,
      valeur: item.valeur,
      date_stock: dateStock
    }));

    const { error } = await supabase
      .from('client_stock')
      .insert(stockData);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erreur sauvegarde stock:', error);
    throw error;
  }
};
