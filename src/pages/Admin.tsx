
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminAuth from '@/components/admin/AdminAuth';
import PrixBoissonsEditor from '@/components/admin/PrixBoissonsEditor';
import HistoriquePointsEditor from '@/components/admin/HistoriquePointsEditor';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Administration</h1>

      {!isAuthenticated ? (
        <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Prix des Boissons</CardTitle>
            </CardHeader>
            <CardContent>
              <PrixBoissonsEditor />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Historique des Points</CardTitle>
            </CardHeader>
            <CardContent>
              <HistoriquePointsEditor />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Admin;
