
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SubscriptionStatus from '@/components/subscription/SubscriptionStatus';
import { 
  Package, 
  ShoppingCart, 
  CreditCard, 
  BarChart3, 
  Settings,
  Clock
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const menuItems = [
    {
      title: "Gestion du Stock",
      description: "Gérer votre inventaire de boissons",
      icon: Package,
      link: "/stock",
      color: "bg-blue-500"
    },
    {
      title: "Suivi des Ventes",
      description: "Enregistrer et suivre vos ventes",
      icon: ShoppingCart,
      link: "/ventes",
      color: "bg-green-500"
    },
    {
      title: "Calculs de Caisse",
      description: "Effectuer vos calculs journaliers",
      icon: CreditCard,
      link: "/caisse",
      color: "bg-purple-500"
    },
    {
      title: "Rapports",
      description: "Consulter vos rapports et statistiques",
      icon: BarChart3,
      link: "/rapports",
      color: "bg-orange-500"
    },
    {
      title: "Administration",
      description: "Paramètres et configuration",
      icon: Settings,
      link: "/admin",
      color: "bg-gray-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-2">Bienvenue dans votre système de gestion AfriKassa</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Statut d'abonnement */}
      <SubscriptionStatus />

      {/* Menu principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Link key={index} to={item.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${item.color} text-white group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Informations utiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aide & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Besoin d'aide ? Contactez notre équipe de support pour toute assistance.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://wa.me/22961170017', '_blank')}
            >
              Contacter le Support
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conseils d'utilisation</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Commencez par configurer votre stock</li>
              <li>• Enregistrez vos ventes quotidiennes</li>
              <li>• Consultez régulièrement vos rapports</li>
              <li>• Sauvegardez vos données importantes</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
