
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Key, User, Database } from 'lucide-react';

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

  // Charger les clients depuis le localStorage
  useEffect(() => {
    const clientsStockes = localStorage.getItem('clients_list');
    if (clientsStockes) {
      setClients(JSON.parse(clientsStockes));
    }
  }, []);

  // Sauvegarder les clients dans le localStorage
  const sauvegarderClients = (nouveauxClients: Client[]) => {
    localStorage.setItem('clients_list', JSON.stringify(nouveauxClients));
    setClients(nouveauxClients);
  };

  // Générer un mot de passe aléatoire
  const genererMotDePasse = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let motDePasse = '';
    for (let i = 0; i < 8; i++) {
      motDePasse += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setNouveauClient({ ...nouveauClient, password: motDePasse });
  };

  // Ajouter un nouveau client
  const ajouterClient = () => {
    if (!nouveauClient.nom || !nouveauClient.email || !nouveauClient.username || !nouveauClient.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    // Vérifier si l'username existe déjà
    const usernameExiste = clients.some(client => client.username === nouveauClient.username);
    if (usernameExiste) {
      toast({
        title: "Erreur",
        description: "Ce nom d'utilisateur existe déjà",
        variant: "destructive"
      });
      return;
    }

    const client: Client = {
      id: Date.now().toString(),
      ...nouveauClient,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      statut: 'actif'
    };

    const nouveauxClients = [...clients, client];
    sauvegarderClients(nouveauxClients);

    setNouveauClient({ nom: '', email: '', username: '', password: '' });

    toast({
      title: "Client ajouté",
      description: `Client ${client.nom} ajouté avec succès`,
    });
  };

  // Supprimer un client
  const supprimerClient = (id: string) => {
    const nouveauxClients = clients.filter(client => client.id !== id);
    sauvegarderClients(nouveauxClients);
    
    toast({
      title: "Client supprimé",
      description: "Le client a été supprimé avec succès",
    });
  };

  // Changer le statut d'un client
  const changerStatut = (id: string) => {
    const nouveauxClients = clients.map(client => 
      client.id === id 
        ? { ...client, statut: client.statut === 'actif' ? 'inactif' : 'actif' as 'actif' | 'inactif' }
        : client
    );
    sauvegarderClients(nouveauxClients);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Panneau Créateur</h1>
          <p className="text-gray-600">Gestion des comptes clients</p>
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
                    <TableHead>Nom d'utilisateur</TableHead>
                    <TableHead>Mot de passe</TableHead>
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
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {client.password}
                        </code>
                      </TableCell>
                      <TableCell>{client.dateCreation}</TableCell>
                      <TableCell>
                        <Button
                          variant={client.statut === 'actif' ? 'default' : 'secondary'}
                          size="sm"
                          onClick={() => changerStatut(client.id)}
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
