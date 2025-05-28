
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getStock } from '@/services/stockService';

interface StockItem {
  id: string;
  nom: string;
  quantite: number;
  prix_unitaire: number;
  seuil_alerte: number;
}

const StockTable: React.FC = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

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
              <TableHead>Prix Unitaire</TableHead>
              <TableHead>Seuil d'Alerte</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stock.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nom}</TableCell>
                <TableCell>{item.quantite}</TableCell>
                <TableCell>{item.prix_unitaire} FCFA</TableCell>
                <TableCell>{item.seuil_alerte}</TableCell>
                <TableCell>
                  {item.quantite <= item.seuil_alerte ? (
                    <span className="text-red-500">Stock faible</span>
                  ) : (
                    <span className="text-green-500">OK</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StockTable;
