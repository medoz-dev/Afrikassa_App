import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { boissons as defaultBoissons } from '@/data/boissons';
import { User } from '@/services/authService';
import * as boissonsService from '@/services/boissonsService';
import * as stockService from '@/services/stockService';
import * as depensesService from '@/services/depensesService';

interface Boisson {
  id: number;
  nom: string;
  prix: number;
  trous: number | number[];
  type: string;
  special?: boolean;
  specialPrice?: number;
  specialUnit?: number;
}

interface StockItem {
  boissonId: number;
  quantite: number;
  valeur: number;
}

interface ArrivageItem {
  boissonId: number;
  quantite: number;
  typeTrous: number;
  valeur: number;
}

interface Depense {
  id: string;
  motif: string;
  montant: number;
  date: string;
}

interface AppContextType {
  // Utilisateur
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Boissons
  boissons: Boisson[];
  updateBoissons: (newBoissons: Boisson[]) => void;
  loadClientBoissons: () => Promise<void>;
  
  // Stock
  stockItems: StockItem[];
  updateStockItem: (boissonId: number, quantite: number) => void;
  stockTotal: number;
  stockDate: string;
  setStockDate: (date: string) => void;
  saveStockData: () => Promise<void>;
  
  // Arrivage
  arrivageItems: ArrivageItem[];
  updateArrivageItem: (boissonId: number, quantite: number, typeTrous?: number) => void;
  arrivageTotal: number;
  arrivageDate: string;
  setArrivageDate: (date: string) => void;
  saveArrivageData: () => void;
  
  // Calculs
  stockAncien: number;
  updateStockAncien: (montant: number) => void;
  stockGeneral: number;
  venteTheorique: number;
  
  // Encaissements
  sommeEncaissee: number;
  updateSommeEncaissee: (montant: number) => void;
  reste: number;
  
  // Dépenses
  depenses: Depense[];
  ajouterDepense: (motif: string, montant: number) => Promise<void>;
  supprimerDepense: (id: string) => Promise<void>;
  loadClientDepenses: () => Promise<void>;
  totalDepenses: number;
  resteFinal: number;
  
  // Résultat final
  especeGerant: number;
  updateEspeceGerant: (montant: number) => void;
  resultatFinal: number;
  calculerResultatFinal: () => void;
  saveResults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [arrivageItems, setArrivageItems] = useState<ArrivageItem[]>([]);
  const [stockDate, setStockDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [arrivageDate, setArrivageDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [stockAncien, setStockAncien] = useState<number>(0);
  const [sommeEncaissee, setSommeEncaissee] = useState<number>(0);
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [especeGerant, setEspeceGerant] = useState<number>(0);
  const [resultatFinal, setResultatFinal] = useState<number>(0);
  const [boissons, setBoissons] = useState<Boisson[]>(defaultBoissons);

  // Charger les données du client depuis Supabase
  const loadClientBoissons = async () => {
    if (!currentUser) return;

    try {
      const clientBoissons = await boissonsService.getClientBoissons(currentUser.id);
      
      if (clientBoissons.length > 0) {
        // Transformer les données Supabase en format de l'app
        const transformedBoissons = clientBoissons.map(cb => ({
          id: cb.boisson_id,
          nom: cb.nom,
          prix: Number(cb.prix),
          trous: cb.trous,
          type: cb.type,
          special: cb.special,
          specialPrice: cb.special_price ? Number(cb.special_price) : undefined,
          specialUnit: cb.special_unit
        }));
        setBoissons(transformedBoissons);
      } else {
        // Utiliser les boissons par défaut si aucune personnalisation
        setBoissons(defaultBoissons);
        await boissonsService.saveClientBoissons(currentUser.id, defaultBoissons);
      }

      // Initialiser les items de stock et d'arrivage
      const initialStockItems = boissons.map((boisson) => ({
        boissonId: boisson.id,
        quantite: 0,
        valeur: 0,
      }));
      setStockItems(initialStockItems);

      const initialArrivageItems = boissons.map((boisson) => ({
        boissonId: boisson.id,
        quantite: 0,
        typeTrous: Array.isArray(boisson.trous) ? boisson.trous[0] : boisson.trous,
        valeur: 0,
      }));
      setArrivageItems(initialArrivageItems);

    } catch (error) {
      console.error('Erreur chargement boissons client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données personnalisées",
        variant: "destructive"
      });
    }
  };

  const loadClientDepenses = async () => {
    if (!currentUser) return;

    try {
      const clientDepenses = await depensesService.getClientDepenses(currentUser.id);
      const transformedDepenses = clientDepenses.map(d => ({
        id: d.id,
        motif: d.motif,
        montant: Number(d.montant),
        date: d.date_depense
      }));
      setDepenses(transformedDepenses);
    } catch (error) {
      console.error('Erreur chargement dépenses:', error);
    }
  };

  // Charger les données quand l'utilisateur change
  useEffect(() => {
    if (currentUser) {
      loadClientBoissons();
      loadClientDepenses();
    } else {
      // Réinitialiser les données si pas d'utilisateur
      setBoissons(defaultBoissons);
      setDepenses([]);
      setStockItems([]);
      setArrivageItems([]);
    }
  }, [currentUser]);

  // Mettre à jour les boissons spécifiques au client
  const updateBoissons = async (newBoissons: Boisson[]) => {
    if (!currentUser) return;

    try {
      setBoissons(newBoissons);
      await boissonsService.saveClientBoissons(currentUser.id, newBoissons);
      
      // Réinitialiser les items de stock et d'arrivage
      const initialStockItems = newBoissons.map((boisson) => ({
        boissonId: boisson.id,
        quantite: 0,
        valeur: 0,
      }));
      setStockItems(initialStockItems);

      const initialArrivageItems = newBoissons.map((boisson) => ({
        boissonId: boisson.id,
        quantite: 0,
        typeTrous: Array.isArray(boisson.trous) ? boisson.trous[0] : boisson.trous,
        valeur: 0,
      }));
      setArrivageItems(initialArrivageItems);

      toast({
        title: "Succès",
        description: "Vos boissons ont été mises à jour",
      });
    } catch (error) {
      console.error('Erreur mise à jour boissons:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos modifications",
        variant: "destructive"
      });
    }
  };

  const updateStockItem = (boissonId: number, quantite: number) => {
    setStockItems(prevItems => {
      return prevItems.map(item => {
        if (item.boissonId === boissonId) {
          const boisson = boissons.find(b => b.id === boissonId);
          if (!boisson) return item;

          let valeur = 0;
          if (boisson.special && boisson.specialPrice && boisson.specialUnit) {
            const groupes = Math.round(quantite / boisson.specialUnit * 10) / 10;
            valeur = Math.round(groupes * boisson.specialPrice);
          } else {
            valeur = quantite * boisson.prix;
          }

          return { ...item, quantite, valeur };
        }
        return item;
      });
    });
  };

  const stockTotal = stockItems.reduce((total, item) => total + item.valeur, 0);

  const updateArrivageItem = (boissonId: number, quantite: number, typeTrous?: number) => {
    setArrivageItems(prevItems => {
      return prevItems.map(item => {
        if (item.boissonId === boissonId) {
          const boisson = boissons.find(b => b.id === boissonId);
          if (!boisson) return item;

          const nombreTrous = typeTrous !== undefined ? typeTrous : 
            (Array.isArray(boisson.trous) ? boisson.trous[0] : boisson.trous);

          let valeur = 0;
          if (boisson.type === 'unite') {
            valeur = quantite * boisson.prix;
          } else {
            valeur = quantite * nombreTrous * boisson.prix;
          }

          return { 
            ...item, 
            quantite, 
            typeTrous: nombreTrous,
            valeur 
          };
        }
        return item;
      });
    });
  };

  const arrivageTotal = arrivageItems.reduce((total, item) => total + item.valeur, 0);

  const updateStockAncien = (montant: number) => {
    setStockAncien(montant);
  };

  const stockGeneral = stockAncien + arrivageTotal;
  const venteTheorique = stockGeneral - stockTotal;

  const updateSommeEncaissee = (montant: number) => {
    setSommeEncaissee(montant);
  };

  const reste = venteTheorique - sommeEncaissee;

  const ajouterDepense = async (motif: string, montant: number) => {
    if (!currentUser) return;

    try {
      await depensesService.addClientDepense(currentUser.id, motif, montant);
      await loadClientDepenses();
      toast({
        title: "Succès",
        description: "Dépense ajoutée avec succès",
      });
    } catch (error) {
      console.error('Erreur ajout dépense:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la dépense",
        variant: "destructive"
      });
    }
  };

  const supprimerDepense = async (id: string) => {
    try {
      await depensesService.deleteClientDepense(id);
      await loadClientDepenses();
      toast({
        title: "Succès",
        description: "Dépense supprimée avec succès",
      });
    } catch (error) {
      console.error('Erreur suppression dépense:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la dépense",
        variant: "destructive"
      });
    }
  };

  const totalDepenses = depenses.reduce((total, depense) => total + depense.montant, 0);
  const resteFinal = reste - totalDepenses;

  const updateEspeceGerant = (montant: number) => {
    setEspeceGerant(montant);
  };

  const calculerResultatFinal = () => {
    const resultat = especeGerant - resteFinal;
    setResultatFinal(resultat);
  };

  const saveStockData = async () => {
    if (!currentUser) return;

    try {
      await stockService.saveClientStock(currentUser.id, stockItems, stockDate);
      toast({
        title: "Succès",
        description: "Stock restant enregistré avec succès!",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du stock:", error);
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement du stock.",
        variant: "destructive"
      });
    }
  };

  const saveArrivageData = () => {
    // À implémenter si nécessaire
    toast({
      title: "Succès",
      description: "Arrivage enregistré avec succès!",
    });
  };

  const saveResults = () => {
    // À implémenter si nécessaire
    toast({
      title: "Succès",
      description: "Résultats enregistrés avec succès!",
    });
  };

  const value: AppContextType = {
    currentUser,
    setCurrentUser,
    boissons,
    updateBoissons,
    loadClientBoissons,
    
    stockItems,
    updateStockItem,
    stockTotal,
    stockDate,
    setStockDate,
    saveStockData,
    
    arrivageItems,
    updateArrivageItem,
    arrivageTotal,
    arrivageDate,
    setArrivageDate,
    saveArrivageData,
    
    stockAncien,
    updateStockAncien,
    stockGeneral,
    venteTheorique,
    
    sommeEncaissee,
    updateSommeEncaissee,
    reste,
    
    depenses,
    ajouterDepense,
    supprimerDepense,
    loadClientDepenses,
    totalDepenses,
    resteFinal,
    
    especeGerant,
    updateEspeceGerant,
    resultatFinal,
    calculerResultatFinal,
    saveResults
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
