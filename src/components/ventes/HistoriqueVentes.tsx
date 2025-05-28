
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Vente {
  id: string;
  produit: string;
  quantite: number;
  prix_unitaire: number;
  total: number;
  date: string;
}

const HistoriqueVentes: React.FC = () => {
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newVente, setNewVente] = useState({
    produit: '',
    quantite: 0,
    prix_unitaire: 0,
  });

  const handleAddVente = () => {
    if (!newVente.produit.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du produit est requis",
        variant: "destructive"
      });
      return;
    }

    const vente: Vente = {
      id: Date.now().toString(),
      produit: newVente.produit,
      quantite: newVente.quantite,
      prix_unitaire: newVente.prix_unitaire,
      total: newVente.quantite * newVente.prix_unitaire,
      date: new Date().toLocaleDateString('fr-FR'),
    };

    setVentes([...ventes, vente]);
    setNewVente({ produit: '', quantite: 0, prix_unitaire: 0 });
    setShowForm(false);
    
    toast({
      title: "Succès",
      description: "Vente ajoutée avec succès"
    });
  };

  const handleDeleteVente = (id: string) => {
    setVentes(ventes.filter(v => v.id !== id));
    toast({
      title: "Supprimé",
      description: "Vente supprimée avec succès"
    });
  };

  const totalVentes = ventes.reduce((sum, vente) => sum + vente.total, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Historique des Ventes
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Vente
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Nom du produit"
                value={newVente.produit}
                onChange={(e) => setNewVente({ ...newVente, produit: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Quantité"
                value={newVente.quantite}
                onChange={(e) => setNewVente({ ...newVente, quantite: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Prix unitaire"
                value={newVente.prix_unitaire}
                onChange={(e) => setNewVente({ ...newVente, prix_unitaire: Number(e.target.value) })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddVente}>Ajouter</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="text-lg font-semibold">
            Total des Ventes: {totalVentes.toLocaleString()} FCFA
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Prix Unitaire</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ventes.map((vente) => (
              <TableRow key={vente.id}>
                <TableCell>{vente.date}</TableCell>
                <TableCell>{vente.produit}</TableCell>
                <TableCell>{vente.quantite}</TableCell>
                <TableCell>{vente.prix_unitaire} FCFA</TableCell>
                <TableCell>{vente.total} FCFA</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteVente(vente.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HistoriqueVentes;
