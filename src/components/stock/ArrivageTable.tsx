
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { addArrivage } from '@/services/stockService';
import { toast } from '@/components/ui/use-toast';

interface ArrivageItem {
  nom: string;
  quantite: number;
  prix_unitaire: number;
}

const ArrivageTable: React.FC = () => {
  const [newItem, setNewItem] = useState<ArrivageItem>({
    nom: '',
    quantite: 0,
    prix_unitaire: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.nom.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du produit est requis",
        variant: "destructive"
      });
      return;
    }

    try {
      await addArrivage(newItem);
      toast({
        title: "Succès",
        description: "Arrivage ajouté avec succès"
      });
      setNewItem({ nom: '', quantite: 0, prix_unitaire: 0 });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de l'arrivage",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvel Arrivage</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom du produit</label>
              <Input
                type="text"
                value={newItem.nom}
                onChange={(e) => setNewItem({ ...newItem, nom: e.target.value })}
                placeholder="Nom du produit"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantité</label>
              <Input
                type="number"
                value={newItem.quantite}
                onChange={(e) => setNewItem({ ...newItem, quantite: Number(e.target.value) })}
                placeholder="Quantité"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prix unitaire</label>
              <Input
                type="number"
                value={newItem.prix_unitaire}
                onChange={(e) => setNewItem({ ...newItem, prix_unitaire: Number(e.target.value) })}
                placeholder="Prix unitaire"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter l'arrivage
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ArrivageTable;
