
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminAuth from '@/components/admin/AdminAuth';
import PrixBoissonsEditor from '@/components/admin/PrixBoissonsEditor';
import HistoriquePointsEditor from '@/components/admin/HistoriquePointsEditor';
import ProduitEditor from '@/components/admin/ProduitEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HistoriqueVentes from '@/components/ventes/HistoriqueVentes';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("prix");

  // Vérifier si l'utilisateur a déjà été authentifié
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Sauvegarder l'état d'authentification
  const handleAuthenticated = () => {
    localStorage.setItem('admin_authenticated', 'true');
    setIsAuthenticated(true);
  };

  // Gérer le changement d'onglet
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Administration</h1>

      {!isAuthenticated ? (
        <AdminAuth onAuthenticated={handleAuthenticated} />
      ) : (
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="prix">Prix des Boissons</TabsTrigger>
            <TabsTrigger value="produits">Gestion des Produits</TabsTrigger>
            <TabsTrigger value="historique">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prix">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Prix des Boissons</CardTitle>
              </CardHeader>
              <CardContent>
                <PrixBoissonsEditor />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="produits">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Produits</CardTitle>
              </CardHeader>
              <CardContent>
                <ProduitEditor />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="historique">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Points</CardTitle>
              </CardHeader>
              <CardContent>
                <HistoriquePointsEditor />
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Historique des Ventes</CardTitle>
              </CardHeader>
              <CardContent>
                <HistoriqueVentes />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Admin;
