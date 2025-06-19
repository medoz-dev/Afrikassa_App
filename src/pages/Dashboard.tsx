
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockTable from '@/components/stock/StockTable';
import ArrivageTable from '@/components/stock/ArrivageTable';
import CalculGeneral from '@/components/caisse/CalculGeneral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package2, ArrowDownUp, Calculator, Brain, CheckCircle, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AICalculation from '@/components/ai/AICalculation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { 
    stockTotal, 
    arrivageTotal, 
    venteTheorique 
  } = useAppContext();

  // Redirection si pas connecté
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Calculer les informations d'abonnement
  const getSubscriptionInfo = () => {
    if (isAdmin) {
      return {
        status: 'admin',
        message: 'Accès Administrateur - Illimité',
        icon: Crown,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      };
    }

    // Accès gratuit complet pour tous
    return {
      status: 'active',
      message: 'Accès Gratuit Complet - Toutes les fonctionnalités disponibles',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    };
  };

  const subscriptionInfo = getSubscriptionInfo();
  const StatusIcon = subscriptionInfo.icon;

  if (!user) {
    return null; // Loading ou redirection
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isAdmin ? 'Tableau de Bord - Administrateur' : 'Tableau de Bord'}
        </h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25 group"
            >
              <div className="absolute inset-0 w-3 bg-white opacity-30 transform -skew-x-[20deg] group-hover:animate-pulse"></div>
              <Brain className="mr-2 h-5 w-5 animate-pulse" />
              Calcul Intelligent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="text-xl text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Analyse Automatique par Intelligence Artificielle
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Téléchargez un fichier contenant vos calculs de boissons et laissez l'IA faire le travail pour vous.
              </DialogDescription>
            </DialogHeader>
            <AICalculation />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statut d'abonnement */}
      <Alert className={`${subscriptionInfo.bgColor} ${subscriptionInfo.borderColor}`}>
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-4 w-4 ${subscriptionInfo.color}`} />
          <div className="flex-1">
            <AlertDescription className={subscriptionInfo.color}>
              <strong>Statut:</strong> {subscriptionInfo.message}
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Restant</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockTotal.toLocaleString()} FCFA</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arrivage Total</CardTitle>
            <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{arrivageTotal.toLocaleString()} FCFA</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vente Théorique</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{venteTheorique.toLocaleString()} FCFA</div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets - maintenant sans protection d'abonnement */}
      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stock">Stock Restant</TabsTrigger>
          <TabsTrigger value="arrivage">Arrivage</TabsTrigger>
          <TabsTrigger value="calculs">Calculs Généraux</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stock">
          <StockTable />
        </TabsContent>
        
        <TabsContent value="arrivage">
          <ArrivageTable />
        </TabsContent>
        
        <TabsContent value="calculs">
          <CalculGeneral />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
