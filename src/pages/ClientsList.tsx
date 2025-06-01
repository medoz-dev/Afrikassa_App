
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  nom: string;
  email: string;
  username: string;
  dateCreation: string;
  dateExpiration?: string;
  statut: 'actif' | 'inactif';
}

const ClientsList: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les clients depuis Supabase
  const chargerClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const clientsFormates = data.map(user => ({
        id: user.id,
        nom: user.nom,
        email: user.email || '',
        username: user.username,
        dateCreation: new Date(user.date_creation).toLocaleDateString('fr-FR'),
        dateExpiration: user.date_expiration,
        statut: user.statut as 'actif' | 'inactif'
      }));

      setClients(clientsFormates);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerClients();
  }, []);

  // Calculer les jours restants
  const calculerJoursRestants = (dateExpiration: string) => {
    const maintenant = new Date();
    const expiration = new Date(dateExpiration);
    const joursRestants = Math.ceil((expiration.getTime() - maintenant.getTime()) / (1000 * 60 * 60 * 24));
    return joursRestants;
  };

  // Supprimer un client
  const supprimerClient = async (id: string, nom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le client ${nom} ?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await chargerClients();
      
      toast({
        title: "Client supprimé",
        description: `Le client ${nom} a été supprimé avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du client",
        variant: "destructive"
      });
    }
  };

  // Changer le statut d'un client
  const changerStatut = async (id: string, nouveauStatut: 'actif' | 'inactif') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ statut: nouveauStatut })
        .eq('id', id);

      if (error) throw error;

      await chargerClients();
      
      toast({
        title: "Statut modifié",
        description: `Le statut du client a été changé à ${nouveauStatut}`,
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du changement de statut",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement des clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/creator-panel')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Liste des Clients</h1>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Total: {clients.length} client{clients.length > 1 ? 's' : ''}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les clients créés</CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun client créé pour le moment</p>
              <Button 
                onClick={() => navigate('/creator-panel')} 
                className="mt-4"
              >
                Créer le premier client
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Date création</TableHead>
                    <TableHead>Abonnement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => {
                    const joursRestants = client.dateExpiration ? calculerJoursRestants(client.dateExpiration) : null;
                    const isExpired = joursRestants !== null && joursRestants <= 0;
                    const isExpiringSoon = joursRestants !== null && joursRestants > 0 && joursRestants <= 7;
                    
                    return (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.nom}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.username}</TableCell>
                        <TableCell>{client.dateCreation}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className={`text-sm ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-orange-600' : 'text-green-600'}`}>
                              {joursRestants !== null ? (
                                isExpired ? '❌ Expiré' : 
                                isExpiringSoon ? `⚠️ ${joursRestants} jour${joursRestants > 1 ? 's' : ''}` :
                                `✅ ${joursRestants} jours`
                              ) : 'Non défini'}
                            </div>
                            {client.dateExpiration && (
                              <div className="text-xs text-gray-500">
                                Jusqu'au {new Date(client.dateExpiration).toLocaleDateString('fr-FR')}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={client.statut === 'actif' ? 'default' : 'secondary'}
                            size="sm"
                            onClick={() => changerStatut(client.id, client.statut === 'actif' ? 'inactif' : 'actif')}
                          >
                            {client.statut}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/client-details/${client.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => supprimerClient(client.id, client.nom)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsList;
