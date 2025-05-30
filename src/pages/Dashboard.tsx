
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockTable from '@/components/stock/StockTable';
import ArrivageTable from '@/components/stock/ArrivageTable';
import CalculGeneral from '@/components/caisse/CalculGeneral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package2, ArrowDownUp, Calculator, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AICalculation from '@/components/ai/AICalculation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isCreator } = useAuth();
  const { 
    stockTotal, 
    arrivageTotal, 
    venteTheorique 
  } = useAppContext();

  // Vérifier l'état du client à chaque chargement du dashboard (simplifié)
  useEffect(() => {
    const currentUser = localStorage.getItem('current_user');
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Rediriger les utilisateurs normaux vers la page caisse
    if (!isCreator) {
      navigate('/caisse');
      return;
    }

    // Vérification simplifiée sans abonnement
    const user = JSON.parse(currentUser);
    const clientsStockes = localStorage.getItem('clients_list');
    
    if (clientsStockes) {
      const clients = JSON.parse(clientsStockes);
      const clientActuel = clients.find((client: any) => client.id === user.id);
      
      if (!clientActuel) {
        // Client supprimé
        localStorage.removeItem('current_user');
        navigate('/login');
        return;
      }

      if (clientActuel.statut !== 'actif') {
        // Client désactivé
        localStorage.removeItem('current_user');
        navigate('/login');
        return;
      }

      // Mettre à jour les données utilisateur si nécessaire
      if (JSON.stringify(user) !== JSON.stringify(clientActuel)) {
        localStorage.setItem('current_user', JSON.stringify(clientActuel));
      }
    }
  }, [navigate, isCreator]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de Bord</h1>
        
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
