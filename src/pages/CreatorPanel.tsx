
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Key, User, Database, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Client {
  id: string;
  nom: string;
  email: string;
  username: string;
  password: string;
  dateCreation: string;
  dateExpiration: string;
  dureeAbonnement: number; // en jours
  statut: 'actif' | 'inactif' | 'expire';
}

const CreatorPanel: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [nouveauClient, setNouveauClient] = useState({
    nom: '',
    email: '',
    username: '',
    password: '',
    dureeAbonnement: 30
  });

  // Charger les clients depuis le localStorage
  useEffect(() => {
    const clientsStockes = localStorage.getItem('clients_list');
    if (clientsStockes) {
      const clientsParsed = JSON.parse(clientsStockes);
      // Vérifier et mettre à jour le statut d'expiration
      const clientsMisAJour = clientsParsed.map((client: Client) => {
        if (client.dateExpiration) {
          const dateExp = new Date(client.dateExpiration);
          const aujourd = new Date();
          if (dateExp < aujourd && client.statut === 'actif') {
            return { ...client, statut: 'expire' as 'expire' };
          }
        }
        return client;
      });
      setClients(clientsMisAJour);
      
      // Sauvegarder si des changements ont été apportés
      if (JSON.stringify(clientsParsed) !== JSON.stringify(clientsMisAJour)) {
        localStorage.setItem('clients_list', JSON.stringify(clientsMisAJour));
      }
    }
  }, []);

  // Vérifier périodiquement l'expiration des abonnements
  useEffect(() => {
    const interval = setInterval(() => {
      const clientsStockes = localStorage.getItem('clients_list');
      if (clientsStockes) {
        const clientsParsed = JSON.parse(clientsStockes);
        let changement = false;
        
        const clientsMisAJour = clientsParsed.map((client: Client) => {
          if (client.dateExpiration && client.statut === 'actif') {
            const dateExp = new Date(client.dateExpiration);
            const aujourd = new Date();
            if (dateExp < aujourd) {
              changement = true;
              return { ...client, statut: 'expire' as 'expire' };
            }
          }
          return client;
        });
        
        if (changement) {
          setClients(clientsMisAJour);
          localStorage.setItem('clients_list', JSON.stringify(clientsMisAJour));
        }
      }
    }, 60000); // Vérifier chaque minute

    return () => clearInterval(interval);
  }, []);

  // Sauvegarder les clients dans le localStorage
  const sauvegarderClients = (nouveauxClients: Client[]) => {
    localStorage.setItem('clients_list', JSON.stringify(nouveauxClients));
    setClients(nouveauxClients);
  };

  // Calculer la date d'expiration
  const calculerDateExpiration = (dureeJours: number) => {
    const dateExpiration = new Date();
    dateExpiration.setDate(dateExpiration.getDate() + dureeJours);
    return dateExpiration.toISOString().split('T')[0];
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
      dateExpiration: calculerDateExpiration(nouveauClient.dureeAbonnement),
      statut: 'actif'
    };

    const nouveauxClients = [...clients, client];
    sauvegarderClients(nouveauxClients);

    setNouveauClient({ nom: '', email: '', username: '', password: '', dureeAbonnement: 30 });

    toast({
      title: "Client ajouté",
      description: `Client ${client.nom} ajouté avec succès. Expiration : ${new Date(client.dateExpiration).toLocaleDateString('fr-FR')}`,
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
    const nouveauxClients = clients.map(client => {
      if (client.id === id) {
        let nouveauStatut: 'actif' | 'inactif' | 'expire';
        if (client.statut === 'actif') {
          nouveauStatut = 'inactif';
        } else if (client.statut === 'inactif') {
          nouveauStatut = 'actif';
        } else {
          nouveauStatut = 'actif'; // Réactiver un client expiré
        }
        return { ...client, statut: nouveauStatut };
      }
      return client;
    });
    sauvegarderClients(nouveauxClients);
  };

  // Prolonger l'abonnement
  const prolongerAbonnement = (id: string, joursSupplementaires: number) => {
    const nouveauxClients = clients.map(client => {
      if (client.id === id) {
        const nouvelleDate = new Date(client.dateExpiration);
        nouvelleDate.setDate(nouvelleDate.getDate() + joursSupplementaires);
        return { 
          ...client, 
          dateExpiration: nouvelleDate.toISOString().split('T')[0],
          statut: 'actif' as 'actif'
        };
      }
      return client;
    });
    sauvegarderClients(nouveauxClients);
    
    toast({
      title: "Abonnement prolongé",
      description: `Abonnement prolongé de ${joursSupplementaires} jours`,
    });
  };

  // Obtenir la couleur du badge selon le statut
  const obtenirCouleurStatut = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-500';
      case 'inactif': return 'bg-gray-500';
      case 'expire': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Panneau Créateur</h1>
          <p className="text-gray-600">Gestion des comptes clients et abonnements</p>
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
            
            <div className="space-y-2">
              <Label htmlFor="duree">Durée d'abonnement</Label>
              <Select 
                value={nouveauClient.dureeAbonnement.toString()} 
                onValueChange={(value) => setNouveauClient({ ...nouveauClient, dureeAbonnement: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 jours (Essai)</SelectItem>
                  <SelectItem value="30">30 jours (1 mois)</SelectItem>
                  <SelectItem value="90">90 jours (3 mois)</SelectItem>
                  <SelectItem value="180">180 jours (6 mois)</SelectItem>
                  <SelectItem value="365">365 jours (1 an)</SelectItem>
                </SelectContent>
              </Select>
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
                    <TableHead>Password</TableHead>
                    <TableHead>Création</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => {
                    const joursRestants = Math.ceil((new Date(client.dateExpiration).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
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
                          <div className="space-y-1">
                            <div>{new Date(client.dateExpiration).toLocaleDateString('fr-FR')}</div>
                            <div className={`text-xs ${joursRestants <= 0 ? 'text-red-600' : joursRestants <= 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {joursRestants <= 0 ? 'Expiré' : `${joursRestants} jour(s) restant(s)`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${obtenirCouleurStatut(client.statut)} text-white`}
                            onClick={() => changerStatut(client.id)}
                          >
                            {client.statut}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => prolongerAbonnement(client.id, 30)}
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => supprimerClient(client.id)}
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

export default CreatorPanel;
