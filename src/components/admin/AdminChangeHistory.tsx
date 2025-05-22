
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { History, Search, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface AdminChangeItem {
  date: string;
  section: string;
  action: string;
  details: string;
  // Champs optionnels pour stocker les données avant/après
  before?: any;
  after?: any;
}

const AdminChangeHistory: React.FC = () => {
  const [changeHistory, setChangeHistory] = useState<AdminChangeItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<AdminChangeItem[]>([]);
  const [dateDebut, setDateDebut] = useState<string>('');
  const [dateFin, setDateFin] = useState<string>('');
  const [sectionFilter, setSectionFilter] = useState<string>('');
  const [selectedChange, setSelectedChange] = useState<AdminChangeItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
              details: "Mise à jour des prix de plusieurs boissons",
              before: { "Coca Cola": 500, "Fanta": 500 },
              after: { "Coca Cola": 600, "Fanta": 550 }
            },
            {
              date: new Date(Date.now() - 86400000).toISOString(), // Hier
              section: "Produits",
              action: "Ajout",
              details: "Ajout d'un nouveau produit: Eau minérale",
              before: null,
              after: { nom: "Eau minérale", prix: 300 }
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

  const showDetails = (item: AdminChangeItem) => {
    setSelectedChange(item);
    setIsDialogOpen(true);
  };

  const renderPriceChangesTable = (beforeData: any, afterData: any) => {
    if (!beforeData || !afterData) return null;
    
    // Pour les modifications de prix
    const allProductNames = new Set([
      ...Object.keys(beforeData || {}),
      ...Object.keys(afterData || {})
    ]);
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Détail des changements de prix</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Ancien prix</TableHead>
              <TableHead>Nouveau prix</TableHead>
              <TableHead>Différence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from(allProductNames).map(productName => {
              const oldPrice = beforeData && beforeData[productName] ? 
                (typeof beforeData[productName] === 'object' ? 
                  beforeData[productName].prix : beforeData[productName]) : '—';
              
              const newPrice = afterData && afterData[productName] ? 
                (typeof afterData[productName] === 'object' ? 
                  afterData[productName].prix : afterData[productName]) : '—';
              
              // Calculer la différence si les deux valeurs sont des nombres
              let difference = '—';
              if (typeof oldPrice === 'number' && typeof newPrice === 'number') {
                const diff = newPrice - oldPrice;
                difference = `${diff > 0 ? '+' : ''}${diff} FCFA`;
              }
              
              return (
                <TableRow key={productName}>
                  <TableCell>{productName}</TableCell>
                  <TableCell>{typeof oldPrice === 'number' ? `${oldPrice} FCFA` : oldPrice}</TableCell>
                  <TableCell>{typeof newPrice === 'number' ? `${newPrice} FCFA` : newPrice}</TableCell>
                  <TableCell className={difference.includes('+') ? 'text-green-500' : difference.includes('-') ? 'text-red-500' : ''}>
                    {difference}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderDetailContent = () => {
    if (!selectedChange) return null;
    
    // Déterminer si c'est un changement de prix ou un ajout de produit
    const isPriceChange = selectedChange.section === "Prix Boissons" && selectedChange.action === "Modification";
    const isProductAddition = selectedChange.section === "Produits" && selectedChange.action === "Ajout";
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Informations générales</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="font-medium">Date:</div>
            <div>{formatDate(selectedChange.date)}</div>
            <div className="font-medium">Section:</div>
            <div>{selectedChange.section}</div>
            <div className="font-medium">Action:</div>
            <div>{selectedChange.action}</div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Description détaillée</h3>
          <p className="mt-2">{selectedChange.details}</p>
        </div>
        
        {/* Afficher le tableau des changements de prix si c'est une modification de prix */}
        {isPriceChange && renderPriceChangesTable(selectedChange.before, selectedChange.after)}
        
        {/* Pour les ajouts de produits */}
        {isProductAddition && selectedChange.after && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Détail du nouveau produit</h3>
            <div className="bg-slate-50 p-4 rounded-md mt-2">
              {typeof selectedChange.after === 'object' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Nom:</div>
                  <div>{selectedChange.after.nom}</div>
                  <div className="font-medium">Prix:</div>
                  <div>{selectedChange.after.prix} FCFA</div>
                  {selectedChange.after.type && (
                    <>
                      <div className="font-medium">Type:</div>
                      <div>{selectedChange.after.type}</div>
                    </>
                  )}
                  {selectedChange.after.trous && (
                    <>
                      <div className="font-medium">Unités:</div>
                      <div>{Array.isArray(selectedChange.after.trous) 
                        ? selectedChange.after.trous.join(' ou ') 
                        : selectedChange.after.trous}</div>
                    </>
                  )}
                  {selectedChange.after.special && (
                    <>
                      <div className="font-medium">Prix spécial:</div>
                      <div>{selectedChange.after.specialPrice} FCFA pour {selectedChange.after.specialUnit} unités</div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Données brutes (avant/après) - affichées seulement si ce n'est pas un changement de prix ou un ajout de produit */}
        {!isPriceChange && !isProductAddition && selectedChange.before && (
          <div>
            <h3 className="text-lg font-medium">Avant la modification</h3>
            <pre className="bg-slate-100 p-2 rounded-md mt-2 text-sm overflow-auto">
              {JSON.stringify(selectedChange.before, null, 2)}
            </pre>
          </div>
        )}
        
        {!isPriceChange && !isProductAddition && selectedChange.after && (
          <div>
            <h3 className="text-lg font-medium">Après la modification</h3>
            <pre className="bg-slate-100 p-2 rounded-md mt-2 text-sm overflow-auto">
              {JSON.stringify(selectedChange.after, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{item.section}</TableCell>
                    <TableCell>{item.action}</TableCell>
                    <TableCell>{item.details}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => showDetails(item)}>
                        <Info size={16} className="mr-1" />
                        Détails
                      </Button>
                    </TableCell>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la modification</DialogTitle>
            <DialogDescription>
              Informations détaillées sur la modification administrative
            </DialogDescription>
          </DialogHeader>
          {renderDetailContent()}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminChangeHistory;
