
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Download, Printer, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const Rapports: React.FC = () => {
  const {
    stockAncien,
    arrivageTotal,
    stockGeneral,
    stockTotal,
    venteTheorique,
    sommeEncaissee,
    reste,
    totalDepenses,
    resteFinal,
  } = useAppContext();

  const [reportType, setReportType] = useState<string>('daily');
  const [date, setDate] = useState<Date>(new Date());

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Rapports et Statistiques</h1>

      <Card>
        <CardHeader>
          <CardTitle>Générer un Rapport</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium mb-1">
                Type de Rapport
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Rapport Journalier</SelectItem>
                  <SelectItem value="weekly">Rapport Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Rapport Mensuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handlePrintReport}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter en PDF
            </Button>
            <Button variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exporter en Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu du Rapport</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 print:block">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">BAR RESTAURANT CHEZ MAMAN-DIDI</h2>
              <p className="text-lg">{reportType === 'daily' ? 'Rapport Journalier' : reportType === 'weekly' ? 'Rapport Hebdomadaire' : 'Rapport Mensuel'}</p>
              <p className="text-muted-foreground">
                Date: {format(date, 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>

            <div className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="py-2 px-4 text-left">Description</th>
                      <th className="py-2 px-4 text-right">Montant (FCFA)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4">Stock Ancien</td>
                      <td className="py-2 px-4 text-right">{stockAncien.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Arrivage Total</td>
                      <td className="py-2 px-4 text-right">{arrivageTotal.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="py-2 px-4 font-medium">Stock Général</td>
                      <td className="py-2 px-4 text-right font-medium">{stockGeneral.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Stock Restant Actuel</td>
                      <td className="py-2 px-4 text-right">{stockTotal.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="py-2 px-4 font-medium">Vente Théorique</td>
                      <td className="py-2 px-4 text-right font-medium">{venteTheorique.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Somme Encaissée</td>
                      <td className="py-2 px-4 text-right">{sommeEncaissee.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Reste</td>
                      <td className="py-2 px-4 text-right">{reste.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Total des Dépenses</td>
                      <td className="py-2 px-4 text-right">{totalDepenses.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-2 px-4 font-bold">Reste Final</td>
                      <td className="py-2 px-4 text-right font-bold">{resteFinal.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 border-t pt-4">
                <p className="text-right text-sm text-muted-foreground">
                  Ce rapport a été généré le {format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rapports;
