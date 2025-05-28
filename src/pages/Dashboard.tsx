
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardCard from '@/components/ui/dashboard-card';
import { TrendingUp, Package, ShoppingCart, Wallet, Users, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { venteTheorique, sommeEncaissee, reste } = useAppContext();

  const stats = [
    {
      title: "Vente Théorique",
      value: venteTheorique,
      icon: <TrendingUp size={20} />,
      trend: 'up' as const
    },
    {
      title: "Somme Encaissée", 
      value: sommeEncaissee,
      icon: <Wallet size={20} />,
      trend: sommeEncaissee >= venteTheorique ? 'up' as const : 'down' as const
    },
    {
      title: "Reste",
      value: reste,
      icon: <BarChart3 size={20} />,
      trend: reste <= 0 ? 'up' as const : 'down' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-gray-600">Aperçu de votre activité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Résumé du Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Gérez votre inventaire et suivez les niveaux de stock en temps réel.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Activité des Ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Suivez vos performances de vente et analysez les tendances.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
