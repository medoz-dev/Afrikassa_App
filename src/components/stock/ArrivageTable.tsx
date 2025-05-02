
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ArrivageTable: React.FC = () => {
  const {
    boissons,
    arrivageItems,
    updateArrivageItem,
    arrivageTotal,
    arrivageDate,
    setArrivageDate,
    saveArrivageData
  } = useAppContext();

  const handleQuantityChange = (boissonId: number, value: string) => {
    const quantity = parseFloat(value) || 0;
    updateArrivageItem(boissonId, quantity);
  };

  const handleTrousTypeChange = (boissonId: number, value: string) => {
    const trousType = parseInt(value);
    const arrivageItem = arrivageItems.find(item => item.boissonId === boissonId);
    if (arrivageItem) {
      updateArrivageItem(boissonId, arrivageItem.quantite, trousType);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calcul de l'Arrivage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="info-box mb-4">
            <p>Veuillez entrer le nombre de casiers, sachets, cartons ou emballages arrivés pour chaque type de boisson.</p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="arrivalDate" className="block text-sm font-medium mb-1">Date d'arrivage:</label>
            <Input
              type="date"
              id="arrivalDate"
              value={arrivageDate}
              onChange={(e) => setArrivageDate(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-2 text-left">Boisson</th>
                  <th className="p-2 text-left">Unités par Casier/Sachet</th>
                  <th className="p-2 text-left">Nombre de Casiers/Sachets</th>
                  <th className="p-2 text-left">Valeur</th>
                </tr>
              </thead>
              <tbody>
                {boissons.map((boisson) => {
                  const arrivageItem = arrivageItems.find(item => item.boissonId === boisson.id);
                  return (
                    <tr key={boisson.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-2">{boisson.nom}</td>
                      <td className="p-2">
                        {Array.isArray(boisson.trous) ? 
                          `${boisson.trous[0]} ou ${boisson.trous[1]} unités` : 
                          boisson.type === 'unite' ? 'Unité' : `${boisson.trous} unités`}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={arrivageItem?.quantite || 0}
                            onChange={(e) => handleQuantityChange(boisson.id, e.target.value)}
                            className="w-24"
                          />
                          
                          {Array.isArray(boisson.trous) && (
                            <Select 
                              value={arrivageItem?.typeTrous?.toString() || boisson.trous[0].toString()} 
                              onValueChange={(value) => handleTrousTypeChange(boisson.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={boisson.trous[0].toString()}>
                                  {boisson.trous[0]} trous
                                </SelectItem>
                                <SelectItem value={boisson.trous[1].toString()}>
                                  {boisson.trous[1]} trous
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </td>
                      <td className="p-2 font-medium">{arrivageItem?.valeur.toLocaleString()} FCFA</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="p-2 font-bold">Total</td>
                  <td className="p-2 font-bold">{arrivageTotal.toLocaleString()} FCFA</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="mt-6">
            <Button onClick={saveArrivageData} className="bg-green-600 hover:bg-green-700">
              Enregistrer l'Arrivage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArrivageTable;
