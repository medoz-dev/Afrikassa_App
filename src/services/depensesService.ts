
import { supabase } from '@/integrations/supabase/client';

export interface ClientDepense {
  id: string;
  client_id: string;
  motif: string;
  montant: number;
  date_depense: string;
}

export const getClientDepenses = async (clientId: string): Promise<ClientDepense[]> => {
  try {
    const { data, error } = await supabase
      .from('client_depenses')
      .select('*')
      .eq('client_id', clientId)
      .order('date_depense', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur récupération dépenses:', error);
    return [];
  }
};

export const addClientDepense = async (clientId: string, motif: string, montant: number) => {
  try {
    const { error } = await supabase
      .from('client_depenses')
      .insert([{
        client_id: clientId,
        motif,
        montant,
        date_depense: new Date().toISOString().split('T')[0]
      }]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erreur ajout dépense:', error);
    throw error;
  }
};

export const deleteClientDepense = async (depenseId: string) => {
  try {
    const { error } = await supabase
      .from('client_depenses')
      .delete()
      .eq('id', depenseId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erreur suppression dépense:', error);
    throw error;
  }
};
