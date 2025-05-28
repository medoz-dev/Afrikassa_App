
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';
import { Calculator, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CalculGeneral: React.FC = () => {
  const { venteTheorique, sommeEncaissee, reste, setVenteTheorique, setSommeEncaissee, setReste } = useAppContext();
  const [localVenteTheorique, setLocalVenteTheorique] = useState(venteTheorique);
  const [localSommeEncaissee, setLocalSommeEncaissee] = useState(sommeEncaissee);

  useEffect(() => {
    const calculatedReste = localVenteTheorique - localSommeEncaissee;
    setReste(calculatedReste);
  }, [localVenteTheorique, localSommeEncaissee, setReste]);

  const handleSave = () => {
    setVenteTheorique(localVenteTheorique);
    setSommeEncaissee(localSommeEncaissee);
    
    toast({
      title: "Sauvegardé",
      description: "Les données de caisse ont été mises à jour"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calcul Général de Caisse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Vente Théorique (FCFA)
              </label>
              <Input
                type="number"
                value={localVenteTheorique}
                onChange={(e) => setLocalVenteTheorique(Number(e.target.value))}
                placeholder="Montant de la vente théorique"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Somme Encaissée (FCFA)
              </label>
              <Input
                type="number"
                value={localSommeEncaissee}
                onChange={(e) => setLocalSommeEncaissee(Number(e.target.value))}
                placeholder="Montant encaissé"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="text-lg font-semibold">
              Reste: {reste.toLocaleString()} FCFA
            </div>
            <div className={`text-sm ${reste >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {reste >= 0 ? 'Surplus' : 'Déficit'}
            </div>
          </div>
          
          <Button onClick={handleSave} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculGeneral;
