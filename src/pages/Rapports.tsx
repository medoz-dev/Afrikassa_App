
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, FileText, Calendar } from 'lucide-react';

const Rapports: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Rapports et Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Rapport des Ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Analysez vos performances de vente sur différentes périodes.
            </p>
            <div className="text-sm text-gray-500">
              Fonctionnalité en développement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Rapport de Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Suivez l'évolution de votre inventaire et les mouvements de stock.
            </p>
            <div className="text-sm text-gray-500">
              Fonctionnalité en développement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Rapport Financier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Générez des rapports financiers détaillés pour votre comptabilité.
            </p>
            <div className="text-sm text-gray-500">
              Fonctionnalité en développement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Rapport Mensuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Consultez un résumé complet de l'activité mensuelle.
            </p>
            <div className="text-sm text-gray-500">
              Fonctionnalité en développement
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rapports;
