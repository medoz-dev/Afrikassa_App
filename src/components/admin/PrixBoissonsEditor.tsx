
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Check, Pencil } from 'lucide-react';

interface BoissonEditableProps {
  id: number;
  nom: string;
  prix: number;
  trous: number | number[];
  type: string;
  special?: boolean;
  specialPrice?: number;
  specialUnit?: number;
}

const PrixBoissonsEditor: React.FC = () => {
  const { boissons } = useAppContext();
  const [editableBoissons, setEditableBoissons] = useState<BoissonEditableProps[]>([]);
  const [isEditing, setIsEditing] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    // Récupérer les boissons du localStorage ou du contexte
    const storedBoissons = localStorage.getItem('boissonsData');
    if (storedBoissons) {
      setEditableBoissons(JSON.parse(storedBoissons));
    } else {
      setEditableBoissons([...boissons]);
    }
  }, [boissons]);

  const handlePrixChange = (id: number, newPrix: string) => {
    setEditableBoissons(prev => 
      prev.map(boisson => {
        if (boisson.id === id) {
          return { ...boisson, prix: parseFloat(newPrix) || 0 };
        }
        return boisson;
      })
    );
  };

  const handleSpecialPrixChange = (id: number, newPrix: string) => {
    setEditableBoissons(prev => 
      prev.map(boisson => {
        if (boisson.id === id) {
          return { ...boisson, specialPrice: parseFloat(newPrix) || 0 };
        }
        return boisson;
      })
    );
  };

  const toggleEdit = (id: number) => {
    setIsEditing(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const saveChanges = () => {
    try {
      localStorage.setItem('boissonsData', JSON.stringify(editableBoissons));
      toast({
        title: "Succès",
        description: "Les prix des boissons ont été mis à jour avec succès.",
      });
      // Réinitialiser l'état d'édition
      setIsEditing({});
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des prix:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des prix.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Button onClick={saveChanges} className="w-full">
          <Check className="mr-2" size={16} />
          Enregistrer tous les changements
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prix Unitaire (FCFA)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editableBoissons.map((boisson) => (
              <TableRow key={boisson.id}>
                <TableCell>{boisson.nom}</TableCell>
                <TableCell>
                  {isEditing[boisson.id] ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span>Prix: </span>
                        <Input
                          type="number"
                          value={boisson.prix}
                          onChange={(e) => handlePrixChange(boisson.id, e.target.value)}
                          className="max-w-[120px]"
                        />
                      </div>
                      {boisson.special && (
                        <div className="flex items-center gap-2">
                          <span>Prix spécial: </span>
                          <Input
                            type="number"
                            value={boisson.specialPrice || 0}
                            onChange={(e) => handleSpecialPrixChange(boisson.id, e.target.value)}
                            className="max-w-[120px]"
                          />
                          <span>/{boisson.specialUnit} unités</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {boisson.prix} FCFA
                      {boisson.special && boisson.specialPrice && boisson.specialUnit && (
                        <div className="text-sm text-gray-500">
                          {boisson.specialPrice} FCFA / {boisson.specialUnit} unités
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit(boisson.id)}
                  >
                    <Pencil size={16} className="mr-2" />
                    {isEditing[boisson.id] ? "Terminer" : "Modifier"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PrixBoissonsEditor;
