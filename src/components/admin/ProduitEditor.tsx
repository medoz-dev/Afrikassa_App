import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { trackAdminChange } from '@/utils/adminHistoryUtils';

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

const ProduitEditor: React.FC = () => {
  const { boissons, updateBoissons } = useAppContext();
  const [editableBoissons, setEditableBoissons] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<{ [key: number]: boolean }>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newBoisson, setNewBoisson] = useState({
    nom: '',
    prix: 0,
    trous: 12,
    type: 'casier',
    special: false,
    specialPrice: 0,
    specialUnit: 0
  });

  useEffect(() => {
    console.log("Boissons chargées dans ProduitEditor:", boissons);
    setEditableBoissons([...boissons]);
  }, [boissons]);

  const handleChange = (id: number, field: string, value: any) => {
    setEditableBoissons(prev => 
      prev.map(boisson => {
        if (boisson.id === id) {
          return { ...boisson, [field]: value };
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

  const deleteBoisson = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette boisson?")) {
      const boissonToDelete = editableBoissons.find(boisson => boisson.id === id);
      const updatedBoissons = editableBoissons.filter(boisson => boisson.id !== id);
      setEditableBoissons(updatedBoissons);
      
      // Sauvegarder immédiatement après la suppression
      setTimeout(() => {
        localStorage.setItem('boissonsData', JSON.stringify(updatedBoissons));
        updateBoissons(updatedBoissons);
        
        // Enregistrer la modification dans l'historique avec les détails du produit supprimé
        trackAdminChange(
          'Produits', 
          'Suppression', 
          `Suppression du produit: ${boissonToDelete?.nom}`,
          boissonToDelete,  // before data (le produit supprimé)
          null  // after data (null pour une suppression)
        );
        
        toast({
          title: "Boisson supprimée",
          description: "La boisson a été supprimée avec succès.",
        });
      }, 100);
    }
  };

  const handleNewBoissonChange = (field: string, value: any) => {
    setNewBoisson(prev => ({ ...prev, [field]: value }));
  };

  const addNewBoisson = () => {
    if (!newBoisson.nom) {
      toast({
        title: "Erreur",
        description: "Le nom de la boisson est requis.",
        variant: "destructive"
      });
      return;
    }

    const nextId = Math.max(...editableBoissons.map(b => b.id), 0) + 1;
    const boissonToAdd = {
      ...newBoisson,
      id: nextId,
      prix: Number(newBoisson.prix),
      trous: Number(newBoisson.trous),
      specialPrice: newBoisson.special ? Number(newBoisson.specialPrice) : undefined,
      specialUnit: newBoisson.special ? Number(newBoisson.specialUnit) : undefined
    };

    const updatedBoissons = [...editableBoissons, boissonToAdd];
    setEditableBoissons(updatedBoissons);
    
    // Sauvegarder immédiatement après l'ajout
    setTimeout(() => {
      localStorage.setItem('boissonsData', JSON.stringify(updatedBoissons));
      updateBoissons(updatedBoissons);
      
      // Enregistrer la modification dans l'historique avec les détails du produit ajouté
      trackAdminChange(
        'Produits', 
        'Ajout', 
        `Ajout du produit: ${boissonToAdd.nom}`,
        null,  // before data (null pour un ajout)
        boissonToAdd  // after data (le nouveau produit avec tous ses détails)
      );
    }, 100);
    
    // Réinitialiser le formulaire
    setNewBoisson({
      nom: '',
      prix: 0,
      trous: 12,
      type: 'casier',
      special: false,
      specialPrice: 0,
      specialUnit: 0
    });
    
    setShowAddDialog(false);
    
    toast({
      title: "Succès",
      description: `La boisson ${boissonToAdd.nom} a été ajoutée avec succès.`,
    });
  };

  const saveChanges = () => {
    try {
      // Identifier les produits modifiés
      const modifiedBoissons = editableBoissons.filter((boisson, index) => {
        const originalIndex = boissons.findIndex(b => b.id === boisson.id);
        if (originalIndex === -1) return false;
        
        const originalBoisson = boissons[originalIndex];
        if (!originalBoisson) return false;
        
        // Vérifier les différences dans les propriétés
        return (
          boisson.nom !== originalBoisson.nom ||
          boisson.prix !== originalBoisson.prix ||
          boisson.type !== originalBoisson.type ||
          boisson.trous !== originalBoisson.trous ||
          boisson.special !== originalBoisson.special ||
          boisson.specialPrice !== originalBoisson.specialPrice ||
          boisson.specialUnit !== originalBoisson.specialUnit
        );
      });
      
      console.log("Sauvegarde des produits:", editableBoissons);
      localStorage.setItem('boissonsData', JSON.stringify(editableBoissons));
      updateBoissons(editableBoissons);
      
      // Enregistrer la modification dans l'historique si des changements ont été effectués
      if (modifiedBoissons.length > 0) {
        // Créer des objets avant/après pour l'historique
        const beforeData: Record<string, any> = {};
        const afterData: Record<string, any> = {};
        
        modifiedBoissons.forEach(boisson => {
          const originalIndex = boissons.findIndex(b => b.id === boisson.id);
          if (originalIndex !== -1) {
            const original = boissons[originalIndex];
            beforeData[boisson.nom] = { ...original };
            afterData[boisson.nom] = { ...boisson };
          }
        });
        
        const details = `Modification des produits: ${modifiedBoissons.map(b => b.nom).join(', ')}`;
        trackAdminChange('Produits', 'Modification', details, beforeData, afterData);
      }
      
      toast({
        title: "Succès",
        description: "Les produits ont été mis à jour avec succès.",
      });
      // Réinitialiser l'état d'édition
      setIsEditing({});
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des produits:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des produits.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={saveChanges} className="bg-green-600 hover:bg-green-700">
          <Check className="mr-2" size={16} />
          Enregistrer tous les changements
        </Button>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={16} />
              Ajouter une Boisson
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle boisson</DialogTitle>
              <DialogDescription>
                Veuillez remplir les détails de la nouvelle boisson.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <label className="text-right text-sm">Nom:</label>
                <Input 
                  className="col-span-3"
                  value={newBoisson.nom} 
                  onChange={e => handleNewBoissonChange('nom', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <label className="text-right text-sm">Prix unitaire:</label>
                <Input 
                  className="col-span-3"
                  type="number" 
                  value={newBoisson.prix} 
                  onChange={e => handleNewBoissonChange('prix', parseFloat(e.target.value))}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <label className="text-right text-sm">Type:</label>
                <Select 
                  value={newBoisson.type} 
                  onValueChange={value => handleNewBoissonChange('type', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casier">Casier</SelectItem>
                    <SelectItem value="carton">Carton</SelectItem>
                    <SelectItem value="sachet">Sachet</SelectItem>
                    <SelectItem value="unite">Unité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <label className="text-right text-sm">Trous/Unités:</label>
                <Input 
                  className="col-span-3"
                  type="number" 
                  value={newBoisson.trous} 
                  onChange={e => handleNewBoissonChange('trous', parseInt(e.target.value))}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <label className="text-right text-sm">Prix spécial:</label>
                <div className="col-span-3 flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={newBoisson.special} 
                    onChange={e => handleNewBoissonChange('special', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Activer le prix spécial</span>
                </div>
              </div>
              
              {newBoisson.special && (
                <>
                  <div className="grid grid-cols-4 items-center gap-2">
                    <label className="text-right text-sm">Prix pour n unités:</label>
                    <Input 
                      className="col-span-3"
                      type="number" 
                      value={newBoisson.specialPrice} 
                      onChange={e => handleNewBoissonChange('specialPrice', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-2">
                    <label className="text-right text-sm">Nombre d'unités:</label>
                    <Input 
                      className="col-span-3"
                      type="number" 
                      value={newBoisson.specialUnit} 
                      onChange={e => handleNewBoissonChange('specialUnit', parseInt(e.target.value))}
                    />
                  </div>
                </>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Annuler
              </Button>
              <Button onClick={addNewBoisson}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Unités</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editableBoissons.map((boisson) => (
              <TableRow key={boisson.id}>
                <TableCell>{boisson.id}</TableCell>
                <TableCell>
                  {isEditing[boisson.id] ? (
                    <Input 
                      value={boisson.nom} 
                      onChange={e => handleChange(boisson.id, 'nom', e.target.value)}
                    />
                  ) : (
                    boisson.nom
                  )}
                </TableCell>
                <TableCell>
                  {isEditing[boisson.id] ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span>Prix: </span>
                        <Input
                          type="number"
                          value={boisson.prix}
                          onChange={e => handleChange(boisson.id, 'prix', parseFloat(e.target.value))}
                          className="max-w-[120px]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Prix spécial: </span>
                        <input 
                          type="checkbox" 
                          checked={!!boisson.special} 
                          onChange={e => handleChange(boisson.id, 'special', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      {boisson.special && (
                        <>
                          <div className="flex items-center gap-2">
                            <span>Prix pour n unités: </span>
                            <Input
                              type="number"
                              value={boisson.specialPrice || 0}
                              onChange={e => handleChange(boisson.id, 'specialPrice', parseFloat(e.target.value))}
                              className="max-w-[120px]"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Nombre d'unités: </span>
                            <Input
                              type="number"
                              value={boisson.specialUnit || 0}
                              onChange={e => handleChange(boisson.id, 'specialUnit', parseInt(e.target.value))}
                              className="max-w-[120px]"
                            />
                          </div>
                        </>
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
                  {isEditing[boisson.id] ? (
                    <Select 
                      value={boisson.type} 
                      onValueChange={value => handleChange(boisson.id, 'type', value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casier">Casier</SelectItem>
                        <SelectItem value="carton">Carton</SelectItem>
                        <SelectItem value="sachet">Sachet</SelectItem>
                        <SelectItem value="unite">Unité</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    boisson.type
                  )}
                </TableCell>
                <TableCell>
                  {isEditing[boisson.id] ? (
                    <Input
                      type="number"
                      value={Array.isArray(boisson.trous) ? boisson.trous[0] : boisson.trous}
                      onChange={e => handleChange(boisson.id, 'trous', parseInt(e.target.value))}
                      className="max-w-[120px]"
                    />
                  ) : (
                    Array.isArray(boisson.trous) 
                      ? `${boisson.trous.join(' ou ')} unités`
                      : `${boisson.trous} unités`
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleEdit(boisson.id)}
                    >
                      <Pencil size={16} className="mr-2" />
                      {isEditing[boisson.id] ? "Terminer" : "Modifier"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBoisson(boisson.id)}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProduitEditor;
