
import { supabase } from '@/integrations/supabase/client';

export interface StockItem {
  id: string;
  nom: string;
  quantite: number;
  prix_unitaire: number;
  seuil_alerte: number;
}

export const getStock = async (): Promise<StockItem[]> => {
  try {
    const { data, error } = await supabase
      .from('stock')
      .select('*')
      .order('nom');

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur récupération stock:', error);
    return [];
  }
};

export const addArrivage = async (item: { nom: string; quantite: number; prix_unitaire: number }) => {
  try {
    const { error } = await supabase
      .from('stock')
      .insert([{
        nom: item.nom,
        quantite: item.quantite,
        prix_unitaire: item.prix_unitaire,
        seuil_alerte: 10, // Valeur par défaut
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
      .from('stock')
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
