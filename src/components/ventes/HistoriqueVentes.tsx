
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { History, Search } from 'lucide-react';
import { format } from 'date-fns';

interface HistoriqueItem {
  date: string;
  vente: number;
  sommeEncaissee: number;
  reste: number;
}

const HistoriqueVentes: React.FC = () => {
  const [historiqueVentes, setHistoriqueVentes] = useState<HistoriqueItem[]>([]);
  const [filteredHistorique, setFilteredHistorique] = useState<HistoriqueItem[]>([]);
  const [dateDebut, setDateDebut] = useState<string>('');
  const [dateFin, setDateFin] = useState<string>('');

  useEffect(() => {
    // Récupérer l'historique des ventes depuis localStorage
    const loadHistorique = () => {
      try {
        const historicalData = localStorage.getItem('historicalResults');
        
        if (historicalData) {
          const history = JSON.parse(historicalData);
          
          // Transformer les données pour notre affichage
          const venteHistory: HistoriqueItem[] = history.map((item: any) => ({
            date: item.date,
            vente: item.vente || 0,
            sommeEncaissee: item.sommeEncaissee || 0,
            reste: item.reste || 0,
          }));
          
          // Trier par date (plus récent en premier)
          venteHistory.sort((a: HistoriqueItem, b: HistoriqueItem) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          setHistoriqueVentes(venteHistory);
          setFilteredHistorique(venteHistory);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique des ventes:", error);
      }
    };

    loadHistorique();
  }, []);

  const handleFilter = () => {
    let filtered = [...historiqueVentes];
    
    if (dateDebut) {
      filtered = filtered.filter(item => item.date >= dateDebut);
    }
    
    if (dateFin) {
      filtered = filtered.filter(item => item.date <= dateFin);
    }
    
    setFilteredHistorique(filtered);
  };

  const resetFilter = () => {
    setDateDebut('');
    setDateFin('');
    setFilteredHistorique(historiqueVentes);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <History size={20} className="mr-2" />
          Historique des Ventes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="dateDebut" className="block text-sm font-medium mb-1">
                Date de début:
              </label>
              <Input 
                type="date" 
                id="dateDebut"
                value={dateDebut} 
                onChange={(e) => setDateDebut(e.target.value)} 
              />
            </div>
            <div className="flex-1">
              <label htmlFor="dateFin" className="block text-sm font-medium mb-1">
                Date de fin:
              </label>
              <Input 
                type="date" 
                id="dateFin"
                value={dateFin} 
                onChange={(e) => setDateFin(e.target.value)} 
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleFilter} className="flex-1">
              <Search size={16} className="mr-2" />
              Filtrer
            </Button>
            <Button variant="outline" onClick={resetFilter} className="flex-1">
              Réinitialiser
            </Button>
          </div>
        </div>

        {filteredHistorique.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vente Théorique</TableHead>
                  <TableHead>Somme Encaissée</TableHead>
                  <TableHead>Reste</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistorique.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{item.vente.toLocaleString()} FCFA</TableCell>
                    <TableCell>{item.sommeEncaissee.toLocaleString()} FCFA</TableCell>
                    <TableCell className={item.reste > 0 ? 'text-red-500' : 'text-green-500'}>
                      {item.reste.toLocaleString()} FCFA
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun historique de vente disponible pour la période sélectionnée.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoriqueVentes;
