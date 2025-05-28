
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockTable from '@/components/stock/StockTable';
import ArrivageTable from '@/components/stock/ArrivageTable';
import CalculGeneral from '@/components/caisse/CalculGeneral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package2, ArrowDownUp, Calculator, Brain, AlertTriangle, CheckCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AICalculation from '@/components/ai/AICalculation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authService, User } from '@/services/authService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { 
    stockTotal, 
    arrivageTotal, 
    venteTheorique 
  } = useAppContext();

  // Vérifier la session utilisateur à chaque chargement
  useEffect(() => {
    const validateUserSession = async () => {
      const sessionResult = await authService.validateSession();
      
      if (!sessionResult.valid || !sessionResult.user) {
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      setCurrentUser(sessionResult.user);
      // Maintenir la compatibilité avec l'ancien système
      localStorage.setItem('current_user', JSON.stringify(sessionResult.user));
    };

    validateUserSession();
  }, [navigate]);

  // Calculer les jours restants d'abonnement
  const getSubscriptionStatus = () => {
    if (!currentUser?.date_expiration) return null;

    const dateExpiration = new Date(currentUser.date_expiration);
    const maintenant = new Date();
    const joursRestants = Math.ceil((dateExpiration.getTime() - maintenant.getTime()) / (1000 * 60 * 60 * 24));

    return {
      dateExpiration: dateExpiration.toLocaleDateString('fr-FR'),
      joursRestants,
      isExpiringSoon: joursRestants <= 7 && joursRestants > 0,
      isExpired: joursRestants <= 0
    };
  };

  const subscriptionStatus = getSubscriptionStatus();

  const handleReactivateSubscription = () => {
    if (!currentUser) return;

    const message = `Bonjour, je souhaite réactiver mon abonnement AfriKassa.%0A%0ANom: ${currentUser.nom}%0AUtilisateur: ${currentUser.username}%0A%0AMerci de m'aider à renouveler mon accès.`;
    window.open(`https://wa.me/22961170017?text=${message}`, '_blank');
  };

  const handleLogout = async () => {
    await authService.logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
    navigate('/login');
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tableau de Bord</h1>
          <p className="text-sm text-gray-600">
            Connecté en tant que: <span className="font-medium">{currentUser.nom}</span>
            {currentUser.role === 'admin' && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Administrateur</span>}
          </p>
        </div>
        
        <div className="flex gap-2">
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
          
          <Button variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Affichage du statut d'abonnement */}
      {subscriptionStatus && (
        <Alert className={`${subscriptionStatus.isExpiringSoon ? 'border-orange-500 bg-orange-50' : 'border-green-500 bg-green-50'}`}>
          <div className="flex items-center gap-2">
            {subscriptionStatus.isExpiringSoon ? (
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <div className="flex-1">
              <AlertDescription className={`${subscriptionStatus.isExpiringSoon ? 'text-orange-800' : 'text-green-800'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Statut d'abonnement :</strong> 
                    {subscriptionStatus.isExpiringSoon 
                      ? ` ⚠️ Expire dans ${subscriptionStatus.joursRestants} jour${subscriptionStatus.joursRestants > 1 ? 's' : ''} (${subscriptionStatus.dateExpiration})`
                      : ` ✅ Actif jusqu'au ${subscriptionStatus.dateExpiration} (${subscriptionStatus.joursRestants} jours restants)`
                    }
                  </div>
                  {subscriptionStatus.isExpiringSoon && (
                    <Button 
                      size="sm" 
                      onClick={handleReactivateSubscription}
                      className="ml-4 bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Réactiver
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

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
