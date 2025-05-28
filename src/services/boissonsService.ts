
import { supabase } from '@/integrations/supabase/client';

export interface ClientBoisson {
  id: string;
  client_id: string;
  boisson_id: number;
  nom: string;
  prix: number;
  trous: number | number[];
  type: string;
  special?: boolean;
  special_price?: number;
  special_unit?: number;
}

export const getClientBoissons = async (clientId: string): Promise<ClientBoisson[]> => {
  try {
    const { data, error } = await supabase
      .from('client_boissons')
      .select('*')
      .eq('client_id', clientId)
      .order('boisson_id');

    if (error) {
      throw error;
    }

    // Transformer les données pour correspondre à l'interface
    const transformedData = (data || []).map(item => ({
      ...item,
      trous: typeof item.trous === 'string' ? JSON.parse(item.trous) : item.trous
    })) as ClientBoisson[];

    return transformedData;
  } catch (error) {
    console.error('Erreur récupération boissons:', error);
    return [];
  }
};

export const saveClientBoissons = async (clientId: string, boissons: any[]) => {
  try {
    // Supprimer les anciennes boissons du client
    await supabase
      .from('client_boissons')
      .delete()
      .eq('client_id', clientId);

    // Insérer les nouvelles boissons
    const boissonsData = boissons.map(boisson => ({
      client_id: clientId,
      boisson_id: boisson.id,
      nom: boisson.nom,
      prix: boisson.prix,
      trous: JSON.stringify(boisson.trous), // Convertir en JSON pour stockage
      type: boisson.type,
      special: boisson.special || false,
      special_price: boisson.specialPrice,
      special_unit: boisson.specialUnit
    }));

    const { error } = await supabase
      .from('client_boissons')
      .insert(boissonsData);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erreur sauvegarde boissons:', error);
    throw error;
  }
};

export const updateClientBoisson = async (clientId: string, boissonId: number, updates: Partial<ClientBoisson>) => {
  try {
    // Préparer les données de mise à jour
    const updateData: any = { ...updates };
    if (updateData.trous) {
      updateData.trous = JSON.stringify(updateData.trous);
    }

    const { error } = await supabase
      .from('client_boissons')
      .update(updateData)
      .eq('client_id', clientId)
      .eq('boisson_id', boissonId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erreur mise à jour boisson:', error);
    throw error;
  }
};
