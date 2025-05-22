
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardCard from '@/components/ui/dashboard-card';
import { TrendingUp, CreditCard, Coins } from 'lucide-react';
import HistoriqueVentes from '@/components/ventes/HistoriqueVentes';

const Ventes: React.FC = () => {
  const { 
    venteTheorique,
    sommeEncaissee,
    reste,
  } = useAppContext();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Récapitulatif des Ventes</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard 
          title="Vente Théorique" 
          value={venteTheorique} 
          icon={<TrendingUp size={20} />} 
        />
        <DashboardCard 
          title="Somme Encaissée" 
          value={sommeEncaissee} 
          icon={<CreditCard size={20} />} 
          trend={sommeEncaissee >= venteTheorique ? 'up' : 'down'} 
        />
        <DashboardCard 
          title="Reste" 
          value={reste} 
          icon={<Coins size={20} />} 
          trend={reste <= 0 ? 'up' : 'down'} 
        />
      </div>

      <HistoriqueVentes />
    </div>
  );
};

export default Ventes;
