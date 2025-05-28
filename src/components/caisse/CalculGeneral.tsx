
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

const CalculGeneral: React.FC = () => {
  const {
    stockAncien,
    updateStockAncien,
    arrivageTotal,
    stockGeneral,
    stockTotal,
    venteTheorique,
    sommeEncaissee,
    updateSommeEncaissee,
    reste,
    depenses,
    ajouterDepense,
    supprimerDepense,
    totalDepenses,
    resteFinal,
    especeGerant,
    updateEspeceGerant,
    resultatFinal,
    calculerResultatFinal,
    saveResults
  } = useAppContext();

  const [calculationDate, setCalculationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [nouveauStockAncien, setNouveauStockAncien] = useState<string>(stockAncien.toString());
  const [nouvelleSommeEncaissee, setNouvelleSommeEncaissee] = useState<string>('0');
  const [motifDepense, setMotifDepense] = useState<string>('');
  const [montantDepense, setMontantDepense] = useState<string>('');
  const [nouvelleEspeceGerant, setNouvelleEspeceGerant] = useState<string>('0');
  const [showFinalResult, setShowFinalResult] = useState<boolean>(false);

  const handleUpdateOldStock = () => {
    const montant = parseFloat(nouveauStockAncien) || 0;
    updateStockAncien(montant);
  };

  const handleCalculateReste = () => {
    const montant = parseFloat(nouvelleSommeEncaissee) || 0;
    updateSommeEncaissee(montant);
  };

  const handleAddExpense = () => {
    if (motifDepense && parseFloat(montantDepense) > 0) {
      ajouterDepense(motifDepense, parseFloat(montantDepense));
      setMotifDepense('');
      setMontantDepense('');
    }
  };

  const handleCalculateFinal = () => {
    const montant = parseFloat(nouvelleEspeceGerant) || 0;
    updateEspeceGerant(montant);
    calculerResultatFinal();
    setShowFinalResult(true);
  };

  const handlePrintResults = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculs Généraux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="info-box">
            <p>Système de calcul des ventes, encaissements, dépenses et résultats finaux.</p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="calculationDate" className="block text-sm font-medium mb-1">Date du calcul:</label>
            <Input
              type="date"
              id="calculationDate"
              value={calculationDate}
              onChange={(e) => setCalculationDate(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Résumé des données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input
              type="number"
              value={nouveauStockAncien}
              onChange={(e) => setNouveauStockAncien(e.target.value)}
              placeholder="Entrez la valeur du stock ancien..."
              className="flex-1"
            />
            <Button onClick={handleUpdateOldStock}>Mettre à jour</Button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="summary-item">
              <span>Stock Ancien:</span>
              <span>{stockAncien.toLocaleString()} FCFA</span>
            </div>
            <div className="summary-item">
              <span>Arrivage Total:</span>
              <span>{arrivageTotal.toLocaleString()} FCFA</span>
            </div>
            <div className="summary-item">
              <span>Stock Général:</span>
              <span>{stockGeneral.toLocaleString()} FCFA</span>
            </div>
            <div className="summary-item">
              <span>Stock Restant Actuel:</span>
              <span>{stockTotal.toLocaleString()} FCFA</span>
            </div>
            <div className="summary-item">
              <span>Vente Théorique:</span>
              <span>{venteTheorique.toLocaleString()} FCFA</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Encaissement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="encaissement" className="block text-sm font-medium mb-1">Somme encaissée:</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                id="encaissement"
                type="number"
                value={nouvelleSommeEncaissee}
                onChange={(e) => setNouvelleSommeEncaissee(e.target.value)}
                placeholder="Entrez la somme encaissée..."
                className="flex-1"
              />
              <Button onClick={handleCalculateReste}>Calculer le Reste</Button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="summary-item">
              <span>Vente Théorique:</span>
              <span>{venteTheorique.toLocaleString()} FCFA</span>
            </div>
            <div className="summary-item">
              <span>Somme Encaissée:</span>
              <span>{sommeEncaissee.toLocaleString()} FCFA</span>
            </div>
            <div className="summary-item">
              <span>Reste:</span>
              <span>{reste.toLocaleString()} FCFA</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="expenseMotif" className="block text-sm font-medium mb-1">Motif:</label>
              <Input
                id="expenseMotif"
                type="text"
                value={motifDepense}
                onChange={(e) => setMotifDepense(e.target.value)}
                placeholder="Entrez le motif de la dépense..."
              />
            </div>
            <div>
              <label htmlFor="expenseAmount" className="block text-sm font-medium mb-1">Montant:</label>
              <Input
                id="expenseAmount"
                type="number"
                value={montantDepense}
                onChange={(e) => setMontantDepense(e.target.value)}
                placeholder="Entrez le montant de la dépense..."
              />
            </div>
          </div>
          
          <Button onClick={handleAddExpense} className="w-full sm:w-auto mb-4">
            Ajouter la Dépense
          </Button>
          
          {depenses.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Liste des dépenses</h3>
              <div className="space-y-2 mb-4">
                {depenses.map((depense) => (
                  <div key={depense.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span>{depense.motif}: {depense.montant.toLocaleString()} FCFA</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => supprimerDepense(depense.id)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-between font-medium p-2">
                  <span>Total des Dépenses:</span>
                  <span>{totalDepenses.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <div className="summary-item">
              <span>Reste après vente:</span>
              <span>{reste.toLocaleString()} FCFA</span>
            </div>
            <div className="summary-item">
              <span>Total des Dépenses:</span>
              <span>{totalDepenses.toLocaleString()} FCFA</span>
            </div>
            <div className="summary-item font-medium">
              <span>Reste Final:</span>
              <span>{resteFinal.toLocaleString()} FCFA</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Espèces du Gérant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="especeGerant" className="block text-sm font-medium mb-1">
              Espèce disponible chez le gérant:
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                id="especeGerant"
                type="number"
                value={nouvelleEspeceGerant}
                onChange={(e) => setNouvelleEspeceGerant(e.target.value)}
                placeholder="Entrez le montant..."
                className="flex-1"
              />
              <Button onClick={handleCalculateFinal}>
                Calculer le Résultat Final
              </Button>
            </div>
          </div>
          
          {showFinalResult && (
            <div className="bg-white border p-4 rounded-md text-center mt-4">
              <h3 className="text-xl font-semibold mb-4">Résultat Final</h3>
              <div>
                {resultatFinal === 0 ? (
                  <p>Le point est <strong>BON</strong>. Le gérant a remis le montant exact.</p>
                ) : resultatFinal > 0 ? (
                  <p>Le gérant a un <strong>SURPLUS</strong> de:</p>
                ) : (
                  <p>Le gérant a un <strong>MANQUANT</strong> de:</p>
                )}
              </div>
              <div className={`text-3xl font-bold mt-2 ${
                resultatFinal === 0 ? 'text-primary' : 
                resultatFinal > 0 ? 'text-green-600' : 
                'text-red-600'
              }`}>
                {resultatFinal === 0 ? '0 FCFA' : 
                 resultatFinal > 0 ? `+${resultatFinal.toLocaleString()} FCFA` : 
                 `${resultatFinal.toLocaleString()} FCFA`}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sauvegarde du Point</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={saveResults} className="bg-green-600 hover:bg-green-700">
              Enregistrer les Résultats
            </Button>
            <Button onClick={handlePrintResults} variant="outline">
              Imprimer le Rapport
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculGeneral;
