
import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  Wallet, 
  BarChart3, 
  Plus, 
  Minus,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface DemoModalProps {
  children: React.ReactNode;
}

const DemoModal: React.FC<DemoModalProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stockBiere, setStockBiere] = useState(50);
  const [stockSoda, setStockSoda] = useState(30);
  const [ventesTotales, setVentesTotales] = useState(1250);
  const [caisse, setCaisse] = useState(125000);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    "Gestion du stock en temps réel",
    "Enregistrement des ventes",
    "Suivi de la caisse",
    "Génération de rapports"
  ];

  const handleStockChange = (item: 'biere' | 'soda', change: number) => {
    if (item === 'biere') {
      setStockBiere(Math.max(0, stockBiere + change));
      if (change < 0) {
        setVentesTotales(ventesTotales + Math.abs(change));
        setCaisse(caisse + (Math.abs(change) * 500));
      }
    } else {
      setStockSoda(Math.max(0, stockSoda + change));
      if (change < 0) {
        setVentesTotales(ventesTotales + Math.abs(change));
        setCaisse(caisse + (Math.abs(change) * 300));
      }
    }
  };

  const startDemo = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= demoSteps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const resetDemo = () => {
    setStockBiere(50);
    setStockSoda(30);
    setVentesTotales(1250);
    setCaisse(125000);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-[500px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Démonstration Interactive AfriKassa
          </SheetTitle>
          <SheetDescription>
            Découvrez les fonctionnalités principales en action
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Contrôles de démonstration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Contrôles de Démonstration</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                onClick={startDemo} 
                disabled={isPlaying}
                size="sm"
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'En cours...' : 'Démarrer'}
              </Button>
              <Button 
                onClick={resetDemo} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </CardContent>
          </Card>

          {/* Étape actuelle */}
          {isPlaying && (
            <Card className="border-primary">
              <CardContent className="pt-4">
                <Badge className="mb-2">Étape {currentStep + 1}/4</Badge>
                <p className="text-sm font-medium">{demoSteps[currentStep]}</p>
              </CardContent>
            </Card>
          )}

          {/* Gestion de Stock Interactive */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gestion de Stock
              </CardTitle>
              <CardDescription>Cliquez pour ajuster le stock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Bière (500 FCFA)</p>
                  <p className="text-sm text-gray-600">Stock: {stockBiere}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStockChange('biere', 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStockChange('biere', -1)}
                    disabled={stockBiere === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Soda (300 FCFA)</p>
                  <p className="text-sm text-gray-600">Stock: {stockSoda}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStockChange('soda', 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStockChange('soda', -1)}
                    disabled={stockSoda === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tableau de Bord */}
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ShoppingCart className="h-4 w-4" />
                  Ventes Totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{ventesTotales}</p>
                <p className="text-xs text-gray-600">unités vendues</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Wallet className="h-4 w-4" />
                  Caisse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">{caisse.toLocaleString()}</p>
                <p className="text-xs text-gray-600">FCFA</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Rotation Stock</span>
                    <span className="font-medium">Excellente</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <h4 className="font-semibold text-blue-900 mb-2">Instructions:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Utilisez les boutons + et - pour ajuster le stock</li>
                <li>• Les ventes se mettent à jour automatiquement</li>
                <li>• Observez l'impact sur la caisse en temps réel</li>
                <li>• Cliquez sur "Démarrer" pour une démonstration guidée</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DemoModal;
