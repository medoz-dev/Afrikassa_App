
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Key, User, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Client {
  id: string;
  nom: string;
  email: string;
  username: string;
  password: string;
  dateCreation: string;
  statut: 'actif' | 'inactif';
}

const CreatorPanel: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [nouveauClient, setNouveauClient] = useState({
    nom: '',
    email: '',
    username: '',
    password: ''
  });

  // Charger les clients depuis Supabase
  const chargerClients = async () => {
    try {
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
        password: '********', // Ne pas exposer le mot de passe hashé
        dateCreation: new Date(user.date_creation).toLocaleDateString('fr-FR'),
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
    }
  };

  useEffect(() => {
    chargerClients();
  }, []);

  // Générer un mot de passe aléatoire
  const genererMotDePasse = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let motDePasse = '';
    for (let i = 0; i < 8; i++) {
      motDePasse += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setNouveauClient({ ...nouveauClient, password: motDePasse });
  };

  // Ajouter un nouveau client (méthode simplifiée sans abonnement)
  const ajouterClient = async () => {
    if (!nouveauClient.nom || !nouveauClient.email || !nouveauClient.username || !nouveauClient.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    try {
      // Vérifier si l'username existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', nouveauClient.username)
        .single();

      if (existingUser) {
        toast({
          title: "Erreur",
          description: "Ce nom d'utilisateur existe déjà",
          variant: "destructive"
        });
        return;
      }

      // Créer l'utilisateur directement via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: nouveauClient.email,
        password: nouveauClient.password,
        options: {
          data: {
            username: nouveauClient.username,
            nom: nouveauClient.nom,
            role: 'client'
          }
        }
      });

      if (authError) {
        console.error('Erreur Auth:', authError);
        toast({
          title: "Erreur",
          description: `Erreur lors de la création du compte: ${authError.message}`,
          variant: "destructive"
        });
        return;
      }

      if (authData.user) {
        // Insérer dans notre table users avec l'ID du compte Auth
        const { error: dbError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            nom: nouveauClient.nom,
            email: nouveauClient.email,
            username: nouveauClient.username,
            password_hash: 'managed_by_auth',
            role: 'client',
            statut: 'actif'
          });

        if (dbError) {
          console.error('Erreur DB:', dbError);
          toast({
            title: "Avertissement",
            description: "Compte créé mais données non synchronisées. Le client peut se connecter.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Client ajouté",
            description: `Client ${nouveauClient.nom} ajouté avec succès`,
          });
        }
      }

      setNouveauClient({ nom: '', email: '', username: '', password: '' });
      await chargerClients();

    } catch (error) {
      console.error('Erreur lors de l\'ajout du client:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du client",
        variant: "destructive"
      });
    }
  };

  // Supprimer un client
  const supprimerClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await chargerClients();
      
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Panneau Créateur</h1>
          <p className="text-gray-600">Gestion des comptes clients - Système d'abonnement désactivé</p>
        </div>
      </div>

      {/* Formulaire d'ajout de client */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter un nouveau client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom complet</Label>
              <Input
                id="nom"
                placeholder="Nom du client"
                value={nouveauClient.nom}
                onChange={(e) => setNouveauClient({ ...nouveauClient, nom: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemple.com"
                value={nouveauClient.email}
                onChange={(e) => setNouveauClient({ ...nouveauClient, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                placeholder="nom_utilisateur"
                value={nouveauClient.username}
                onChange={(e) => setNouveauClient({ ...nouveauClient, username: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  placeholder="Mot de passe"
                  value={nouveauClient.password}
                  onChange={(e) => setNouveauClient({ ...nouveauClient, password: e.target.value })}
                />
                <Button type="button" variant="outline" onClick={genererMotDePasse}>
                  <Key className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Button onClick={ajouterClient} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter le client
          </Button>
        </CardContent>
      </Card>

      {/* Liste des clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Liste des clients ({clients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun client enregistré</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Date création</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.nom}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.username}</TableCell>
                      <TableCell>{client.dateCreation}</TableCell>
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
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => supprimerClient(client.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorPanel;
