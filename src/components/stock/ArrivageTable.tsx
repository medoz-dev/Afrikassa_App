
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { addArrivage } from '@/services/stockService';
import { toast } from '@/components/ui/use-toast';
import { useAppContext } from '@/context/AppContext';

interface ArrivageFormItem {
  boisson_id: number;
  quantite: number;
  valeur: number;
  type_trous: number;
}

const ArrivageTable: React.FC = () => {
  const { boissons } = useAppContext();
  const [newItem, setNewItem] = useState<ArrivageFormItem>({
    boisson_id: 0,
    quantite: 0,
    valeur: 0,
    type_trous: 12,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.boisson_id) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un produit",
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
      setNewItem({ boisson_id: 0, quantite: 0, valeur: 0, type_trous: 12 });
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Produit</label>
              <Select 
                value={newItem.boisson_id.toString()} 
                onValueChange={(value) => setNewItem({ ...newItem, boisson_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  {boissons.map((boisson) => (
                    <SelectItem key={boisson.id} value={boisson.id.toString()}>
                      {boisson.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <label className="block text-sm font-medium mb-1">Valeur totale</label>
              <Input
                type="number"
                value={newItem.valeur}
                onChange={(e) => setNewItem({ ...newItem, valeur: Number(e.target.value) })}
                placeholder="Valeur en FCFA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type de trous</label>
              <Input
                type="number"
                value={newItem.type_trous}
                onChange={(e) => setNewItem({ ...newItem, type_trous: Number(e.target.value) })}
                placeholder="Nombre de trous"
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
