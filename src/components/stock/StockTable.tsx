
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StockTable: React.FC = () => {
  const { 
    boissons, 
    stockItems, 
    updateStockItem, 
    stockTotal, 
    stockDate, 
    setStockDate,
    saveStockData
  } = useAppContext();

  const handleQuantityChange = (boissonId: number, value: string) => {
    const quantity = parseFloat(value) || 0;
    updateStockItem(boissonId, quantity);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calcul du Stock Restant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="info-box mb-4">
            <p>Veuillez entrer le nombre de boissons restantes en stock pour chaque type. Le système calculera automatiquement la valeur totale du stock.</p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="stockDate" className="block text-sm font-medium mb-1">Date d'inventaire:</label>
            <Input
              type="date"
              id="stockDate"
              value={stockDate}
              onChange={(e) => setStockDate(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-2 text-left">Boisson</th>
                  <th className="p-2 text-left">Prix Unitaire</th>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Valeur</th>
                </tr>
              </thead>
              <tbody>
                {boissons.map((boisson) => {
                  const stockItem = stockItems.find(item => item.boissonId === boisson.id);
                  return (
                    <tr key={boisson.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-2">{boisson.nom}</td>
                      <td className="p-2">
                        {boisson.special && boisson.specialPrice && boisson.specialUnit ? 
                          `${boisson.specialPrice} FCFA/${boisson.specialUnit} unités` : 
                          `${boisson.prix} FCFA`}
                      </td>
                      <td className="p-2 w-32">
                        <Input
                          type="number"
                          min="0"
                          value={stockItem?.quantite || 0}
                          onChange={(e) => handleQuantityChange(boisson.id, e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="p-2 font-medium">{stockItem?.valeur.toLocaleString()} FCFA</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="p-2 font-bold">Total</td>
                  <td className="p-2 font-bold">{stockTotal.toLocaleString()} FCFA</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="mt-6">
            <Button onClick={saveStockData} className="bg-green-600 hover:bg-green-700">
              Enregistrer le Stock Restant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockTable;
