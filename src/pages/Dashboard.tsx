
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockTable from '@/components/stock/StockTable';
import ArrivageTable from '@/components/stock/ArrivageTable';
import CalculGeneral from '@/components/caisse/CalculGeneral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package2, ArrowDownUp, Calculator, Brain, AlertTriangle, CheckCircle, MessageCircle, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AICalculation from '@/components/ai/AICalculation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SubscriptionGuard from '@/components/subscription/SubscriptionGuard';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, hasActiveSubscription } = useAuth();
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

  const handleContactSupport = () => {
    const message = `Bonjour, je souhaite souscrire à un abonnement AfriKassa.%0A%0ANom: ${user?.nom || 'Non renseigné'}%0AEmail: ${user?.email || 'Non renseigné'}%0A%0AMerci de m'aider à activer mon abonnement.`;
    window.open(`https://wa.me/22961170017?text=${message}`, '_blank');
  };

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

    if (hasActiveSubscription) {
      return {
        status: 'active',
        message: 'Abonnement Actif - Accès complet',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    }

    return {
      status: 'free',
      message: 'Compte Gratuit - Abonnement requis pour les outils',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
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
        
        <SubscriptionGuard feature="l'analyse par IA">
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
        </SubscriptionGuard>
      </div>

      {/* Statut d'abonnement */}
      <Alert className={`${subscriptionInfo.bgColor} ${subscriptionInfo.borderColor}`}>
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-4 w-4 ${subscriptionInfo.color}`} />
          <div className="flex-1">
            <AlertDescription className={subscriptionInfo.color}>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Statut:</strong> {subscriptionInfo.message}
                </div>
                {!hasActiveSubscription && !isAdmin && (
                  <div className="flex gap-2">
                    <Link to="/pricing">
                      <Button 
                        size="sm" 
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <Crown className="h-4 w-4 mr-1" />
                        S'abonner
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleContactSupport}
                      className="border-orange-600 text-orange-600 hover:bg-orange-50"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Support
                    </Button>
                  </div>
                )}
              </div>
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

      {/* Onglets avec protection d'abonnement */}
      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stock">Stock Restant</TabsTrigger>
          <TabsTrigger value="arrivage">Arrivage</TabsTrigger>
          <TabsTrigger value="calculs">Calculs Généraux</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stock">
          <SubscriptionGuard feature="la gestion du stock">
            <StockTable />
          </SubscriptionGuard>
        </TabsContent>
        
        <TabsContent value="arrivage">
          <SubscriptionGuard feature="la gestion des arrivages">
            <ArrivageTable />
          </SubscriptionGuard>
        </TabsContent>
        
        <TabsContent value="calculs">
          <SubscriptionGuard feature="les calculs généraux">
            <CalculGeneral />
          </SubscriptionGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
