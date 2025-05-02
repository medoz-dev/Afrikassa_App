
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardCard from '@/components/ui/dashboard-card';
import { TrendingUp, CreditCard, DollarSign, Coins } from 'lucide-react';

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

      <Card>
        <CardHeader>
          <CardTitle>Historique des Ventes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Cette fonctionnalité sera disponible dans une prochaine mise à jour.</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Dans une future version, vous pourrez consulter ici l'historique détaillé des ventes, filtrer par dates, et effectuer des analyses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ventes;
