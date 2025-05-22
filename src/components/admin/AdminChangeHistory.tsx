
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { History, Search, UserCog } from 'lucide-react';
import { format } from 'date-fns';

interface AdminChangeItem {
  date: string;
  section: string;
  action: string;
  details: string;
}

const AdminChangeHistory: React.FC = () => {
  const [changeHistory, setChangeHistory] = useState<AdminChangeItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<AdminChangeItem[]>([]);
  const [dateDebut, setDateDebut] = useState<string>('');
  const [dateFin, setDateFin] = useState<string>('');
  const [sectionFilter, setSectionFilter] = useState<string>('');

  useEffect(() => {
    // Récupérer l'historique des modifications administratives depuis localStorage
    const loadChangeHistory = () => {
      try {
        const adminHistoryData = localStorage.getItem('adminChangeHistory');
        
        if (adminHistoryData) {
          const history = JSON.parse(adminHistoryData);
          
          // Trier par date (plus récent en premier)
          history.sort((a: AdminChangeItem, b: AdminChangeItem) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          setChangeHistory(history);
          setFilteredHistory(history);
        } else {
          // Données d'exemple si aucun historique n'existe encore
          const exampleData: AdminChangeItem[] = [
            {
              date: new Date().toISOString(),
              section: "Prix Boissons",
              action: "Modification",
              details: "Mise à jour des prix de plusieurs boissons"
            },
            {
              date: new Date(Date.now() - 86400000).toISOString(), // Hier
              section: "Produits",
              action: "Ajout",
              details: "Ajout d'un nouveau produit: Eau minérale"
            }
          ];
          
          localStorage.setItem('adminChangeHistory', JSON.stringify(exampleData));
          setChangeHistory(exampleData);
          setFilteredHistory(exampleData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique des modifications:", error);
      }
    };

    loadChangeHistory();
  }, []);

  const handleFilter = () => {
    let filtered = [...changeHistory];
    
    if (dateDebut) {
      filtered = filtered.filter(item => item.date >= dateDebut);
    }
    
    if (dateFin) {
      filtered = filtered.filter(item => item.date <= dateFin);
    }
    
    if (sectionFilter) {
      filtered = filtered.filter(item => 
        item.section.toLowerCase().includes(sectionFilter.toLowerCase())
      );
    }
    
    setFilteredHistory(filtered);
  };

  const resetFilter = () => {
    setDateDebut('');
    setDateFin('');
    setSectionFilter('');
    setFilteredHistory(changeHistory);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
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
            <div className="flex-1">
              <label htmlFor="section" className="block text-sm font-medium mb-1">
                Section:
              </label>
              <Input 
                type="text" 
                id="section"
                placeholder="Filtrer par section" 
                value={sectionFilter} 
                onChange={(e) => setSectionFilter(e.target.value)} 
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

        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{item.section}</TableCell>
                    <TableCell>{item.action}</TableCell>
                    <TableCell>{item.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun historique de modification disponible pour la période sélectionnée.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminChangeHistory;
