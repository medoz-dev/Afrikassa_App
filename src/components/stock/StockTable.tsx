
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getStock, StockItem } from '@/services/stockService';
import { useAppContext } from '@/context/AppContext';

const StockTable: React.FC = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { boissons } = useAppContext();

  useEffect(() => {
    const loadStock = async () => {
      try {
        const data = await getStock();
        setStock(data);
      } catch (error) {
        console.error('Erreur chargement stock:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStock();
  }, []);

  // Fonction pour obtenir le nom de la boisson à partir de l'ID
  const getBoissonName = (boissonId: number) => {
    const boisson = boissons.find(b => b.id === boissonId);
    return boisson ? boisson.nom : `Boisson ${boissonId}`;
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>État du Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Valeur</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stock.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{getBoissonName(item.boisson_id)}</TableCell>
                <TableCell>{item.quantite}</TableCell>
                <TableCell>{item.valeur} FCFA</TableCell>
                <TableCell>{new Date(item.date_stock).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {stock.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Aucun stock disponible
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockTable;
