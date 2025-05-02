
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Info, Trash } from 'lucide-react';

interface ResultData {
  date: string;
  stockAncien: number;
  arrivageTotal: number;
  stockGeneral: number;
  stockRestant: number;
  vente: number;
  sommeEncaissee: number;
  reste: number;
  depenses: {
    id: number;
    motif: string;
    montant: number;
    date: string;
  }[];
  resteFinal: number;
  especeGerant: number;
  resultatFinal: number;
}

const HistoriquePointsEditor: React.FC = () => {
  const [historique, setHistorique] = useState<ResultData[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<ResultData | null>(null);

  useEffect(() => {
    // Charger l'historique depuis localStorage
    loadHistoriqueFromLocalStorage();
  }, []);

  const loadHistoriqueFromLocalStorage = () => {
    try {
      // Récupérer tous les résultats sauvegardés
      const resultsData = localStorage.getItem('resultsData');
      const allSavedResults: ResultData[] = [];
      
      // Récupérer l'historique complet (pourrait être stocké différemment)
      const historicalData = localStorage.getItem('historicalResults');
      
      if (historicalData) {
        setHistorique(JSON.parse(historicalData));
      } else if (resultsData) {
        // Si pas d'historique complet mais un résultat existe
        allSavedResults.push(JSON.parse(resultsData));
        setHistorique(allSavedResults);
      } else {
        setHistorique([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des points.",
        variant: "destructive"
      });
    }
  };

  const saveHistoriqueToLocalStorage = () => {
    try {
      localStorage.setItem('historicalResults', JSON.stringify(historique));
      toast({
        title: "Succès",
        description: "Historique des points mis à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'historique:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de l'historique.",
        variant: "destructive"
      });
    }
  };

  const deletePoint = (date: string) => {
    setHistorique(prev => prev.filter(point => point.date !== date));
    toast({
      title: "Point supprimé",
      description: "Le point a été retiré de l'historique.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Button onClick={saveHistoriqueToLocalStorage} className="w-full">
          Enregistrer les modifications
        </Button>
      </div>

      {historique.length === 0 ? (
        <Card className="p-6 text-center">
          <p>Aucun historique disponible.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Vente</TableHead>
                <TableHead>Résultat</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historique.map((point) => (
                <TableRow key={point.date}>
                  <TableCell>{new Date(point.date).toLocaleDateString()}</TableCell>
                  <TableCell>{point.vente} FCFA</TableCell>
                  <TableCell className={point.resultatFinal >= 0 ? "text-green-600" : "text-red-600"}>
                    {point.resultatFinal} FCFA
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedPoint(point)}>
                            <Info size={16} className="mr-2" />
                            Détails
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Détails du Point - {new Date(point.date).toLocaleDateString()}</DialogTitle>
                            <DialogDescription>
                              Informations complètes sur ce point de caisse.
                            </DialogDescription>
                          </DialogHeader>
                          {selectedPoint && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-2">
                                <div>Stock Ancien:</div>
                                <div>{selectedPoint.stockAncien} FCFA</div>
                                <div>Arrivage:</div>
                                <div>{selectedPoint.arrivageTotal} FCFA</div>
                                <div>Stock Général:</div>
                                <div>{selectedPoint.stockGeneral} FCFA</div>
                                <div>Stock Restant:</div>
                                <div>{selectedPoint.stockRestant} FCFA</div>
                                <div>Vente:</div>
                                <div>{selectedPoint.vente} FCFA</div>
                                <div>Somme Encaissée:</div>
                                <div>{selectedPoint.sommeEncaissee} FCFA</div>
                                <div>Reste Initial:</div>
                                <div>{selectedPoint.reste} FCFA</div>
                                <div>Reste Final:</div>
                                <div>{selectedPoint.resteFinal} FCFA</div>
                                <div>Espèce Gérant:</div>
                                <div>{selectedPoint.especeGerant} FCFA</div>
                                <div>Résultat Final:</div>
                                <div className={selectedPoint.resultatFinal >= 0 ? "text-green-600" : "text-red-600"}>
                                  {selectedPoint.resultatFinal} FCFA
                                </div>
                              </div>
                              
                              {selectedPoint.depenses.length > 0 && (
                                <div>
                                  <h4 className="font-bold mt-4">Dépenses:</h4>
                                  <ul className="list-disc pl-5 mt-2">
                                    {selectedPoint.depenses.map((depense) => (
                                      <li key={depense.id}>
                                        {depense.motif}: {depense.montant} FCFA
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedPoint(null)}>
                              Fermer
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="destructive" size="sm" onClick={() => deletePoint(point.date)}>
                        <Trash size={16} className="mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default HistoriquePointsEditor;
