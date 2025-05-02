
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockTable from '@/components/stock/StockTable';
import ArrivageTable from '@/components/stock/ArrivageTable';

const Stock: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion des Stocks</h1>
      
      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stock">Stock Restant</TabsTrigger>
          <TabsTrigger value="arrivage">Arrivage</TabsTrigger>
        </TabsList>
        <TabsContent value="stock">
          <StockTable />
        </TabsContent>
        <TabsContent value="arrivage">
          <ArrivageTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Stock;
