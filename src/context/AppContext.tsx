import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { boissons as defaultBoissons } from '@/data/boissons';

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
  id: number;
  motif: string;
  montant: number;
  date: string;
}

interface AppContextType {
  // Boissons
  boissons: Boisson[];
  updateBoissons: (newBoissons: Boisson[]) => void;
  
  // Stock
  stockItems: StockItem[];
  updateStockItem: (boissonId: number, quantite: number) => void;
  stockTotal: number;
  stockDate: string;
  setStockDate: (date: string) => void;
  saveStockData: () => void;
  
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
  ajouterDepense: (motif: string, montant: number) => void;
  supprimerDepense: (id: number) => void;
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

// Fonction pour obtenir l'ID du client actuel
const getCurrentUserId = (): string => {
  const currentUser = localStorage.getItem('current_user');
  if (currentUser) {
    const user = JSON.parse(currentUser);
    return user.id || 'default';
  }
  return 'default';
};

// Fonction pour obtenir les données spécifiques au client
const getClientSpecificData = (key: string, defaultValue: any = null) => {
  const userId = getCurrentUserId();
  const clientKey = `${key}_client_${userId}`;
  const data = localStorage.getItem(clientKey);
  return data ? JSON.parse(data) : defaultValue;
};

// Fonction pour sauvegarder les données spécifiques au client
const saveClientSpecificData = (key: string, data: any) => {
  const userId = getCurrentUserId();
  const clientKey = `${key}_client_${userId}`;
  localStorage.setItem(clientKey, JSON.stringify(data));
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialisation des états
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

  // Fonction pour mettre à jour les boissons spécifiques au client
  const updateBoissons = (newBoissons: Boisson[]) => {
    setBoissons(newBoissons);
    
    // Sauvegarder les boissons spécifiques au client
    saveClientSpecificData('boissonsData', newBoissons);
    
    // Réinitialiser les items de stock et d'arrivage avec les nouveaux IDs
    const initialStockItems = newBoissons.map((boisson) => ({
      boissonId: boisson.id,
      quantite: 0,
      valeur: 0,
    }));
    setStockItems(initialStockItems);

    // Initialiser les items d'arrivage
    const initialArrivageItems = newBoissons.map((boisson) => ({
      boissonId: boisson.id,
      quantite: 0,
      typeTrous: Array.isArray(boisson.trous) ? boisson.trous[0] : boisson.trous,
      valeur: 0,
    }));
    setArrivageItems(initialArrivageItems);
  };

  // Initialiser les données spécifiques au client
  useEffect(() => {
    const initializeClientData = () => {
      // Charger les boissons spécifiques au client
      const clientBoissons = getClientSpecificData('boissonsData', defaultBoissons);
      setBoissons(clientBoissons);

      // Initialiser les items de stock
      const initialStockItems = clientBoissons.map((boisson: Boisson) => ({
        boissonId: boisson.id,
        quantite: 0,
        valeur: 0,
      }));
      setStockItems(initialStockItems);

      // Initialiser les items d'arrivage
      const initialArrivageItems = clientBoissons.map((boisson: Boisson) => ({
        boissonId: boisson.id,
        quantite: 0,
        typeTrous: Array.isArray(boisson.trous) ? boisson.trous[0] : boisson.trous,
        valeur: 0,
      }));
      setArrivageItems(initialArrivageItems);

      // Charger les données du client depuis le localStorage
      const loadClientData = () => {
        try {
          // Charger le stock précédent du client
          const previousStock = getClientSpecificData('stockData');
          if (previousStock) {
            setStockAncien(previousStock.total || 0);
          }

          // Charger les autres données spécifiques au client
          const clientDepenses = getClientSpecificData('depenses', []);
          setDepenses(clientDepenses);

          const clientSommeEncaissee = getClientSpecificData('sommeEncaissee', 0);
          setSommeEncaissee(clientSommeEncaissee);

          const clientEspeceGerant = getClientSpecificData('especeGerant', 0);
          setEspeceGerant(clientEspeceGerant);

        } catch (error) {
          console.error("Erreur lors du chargement des données du client:", error);
        }
      };

      loadClientData();
    };

    // Attendre que l'utilisateur soit connecté
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
      initializeClientData();
    }
  }, []);

  // Écouter les changements d'utilisateur
  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = localStorage.getItem('current_user');
      if (currentUser) {
        // Recharger les données du nouveau client
        const clientBoissons = getClientSpecificData('boissonsData', defaultBoissons);
        setBoissons(clientBoissons);
        
        // Réinitialiser les autres données
        const clientDepenses = getClientSpecificData('depenses', []);
        setDepenses(clientDepenses);
        
        const clientSommeEncaissee = getClientSpecificData('sommeEncaissee', 0);
        setSommeEncaissee(clientSommeEncaissee);
        
        const clientEspeceGerant = getClientSpecificData('especeGerant', 0);
        setEspeceGerant(clientEspeceGerant);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Calculer la valeur du stock pour chaque boisson
  const updateStockItem = (boissonId: number, quantite: number) => {
    setStockItems(prevItems => {
      return prevItems.map(item => {
        if (item.boissonId === boissonId) {
          const boisson = boissons.find(b => b.id === boissonId);
          if (!boisson) return item;

          let valeur = 0;
          if (boisson.special && boisson.specialPrice && boisson.specialUnit) {
            // Cas spécial (ex: 3 unités pour 1000 FCFA)
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

  // Calculer la valeur totale du stock
  const stockTotal = stockItems.reduce((total, item) => total + item.valeur, 0);

  // Calculer la valeur de l'arrivage pour chaque boisson
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

  // Calculer la valeur totale de l'arrivage
  const arrivageTotal = arrivageItems.reduce((total, item) => total + item.valeur, 0);

  // Mettre à jour le stock ancien
  const updateStockAncien = (montant: number) => {
    setStockAncien(montant);
    saveClientSpecificData('stockAncien', montant);
  };

  // Calculer le stock général
  const stockGeneral = stockAncien + arrivageTotal;

  // Calculer la vente théorique
  const venteTheorique = stockGeneral - stockTotal;

  // Mettre à jour la somme encaissée
  const updateSommeEncaissee = (montant: number) => {
    setSommeEncaissee(montant);
    saveClientSpecificData('sommeEncaissee', montant);
  };

  // Calculer le reste
  const reste = venteTheorique - sommeEncaissee;

  // Ajouter une dépense
  const ajouterDepense = (motif: string, montant: number) => {
    const nouvelleDepense = {
      id: Date.now(),
      motif,
      montant,
      date: new Date().toISOString().split('T')[0]
    };
    const nouvellesDepenses = [...depenses, nouvelleDepense];
    setDepenses(nouvellesDepenses);
    saveClientSpecificData('depenses', nouvellesDepenses);
  };

  // Supprimer une dépense
  const supprimerDepense = (id: number) => {
    const nouvellesDepenses = depenses.filter(depense => depense.id !== id);
    setDepenses(nouvellesDepenses);
    saveClientSpecificData('depenses', nouvellesDepenses);
  };

  // Calculer le total des dépenses
  const totalDepenses = depenses.reduce((total, depense) => total + depense.montant, 0);

  // Calculer le reste final après dépenses
  const resteFinal = reste - totalDepenses;

  // Mettre à jour l'espèce du gérant
  const updateEspeceGerant = (montant: number) => {
    setEspeceGerant(montant);
    saveClientSpecificData('especeGerant', montant);
  };

  // Calculer le résultat final
  const calculerResultatFinal = () => {
    const resultat = especeGerant - resteFinal;
    setResultatFinal(resultat);
  };

  // Sauvegarder les données du stock spécifiques au client
  const saveStockData = () => {
    try {
      const stockData = {
        date: stockDate,
        total: stockTotal,
        details: stockItems.map(item => {
          const boisson = boissons.find(b => b.id === item.boissonId);
          return {
            nom: boisson?.nom || 'Inconnu',
            quantite: item.quantite,
            valeur: item.valeur
          };
        })
      };
      
      saveClientSpecificData('stockData', stockData);
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

  // Sauvegarder les données de l'arrivage spécifiques au client
  const saveArrivageData = () => {
    try {
      const arrivageData = {
        date: arrivageDate,
        total: arrivageTotal,
        details: arrivageItems.map(item => {
          const boisson = boissons.find(b => b.id === item.boissonId);
          return {
            nom: boisson?.nom || 'Inconnu',
            quantite: item.quantite,
            typeTrous: item.typeTrous,
            valeur: item.valeur
          };
        })
      };
      
      saveClientSpecificData('arrivalData', arrivageData);
      toast({
        title: "Succès",
        description: "Arrivage enregistré avec succès!",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'arrivage:", error);
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement de l'arrivage.",
        variant: "destructive"
      });
    }
  };

  // Sauvegarder les résultats spécifiques au client
  const saveResults = () => {
    try {
      const resultsData = {
        date: new Date().toISOString().split('T')[0],
        stockAncien,
        arrivageTotal,
        stockGeneral,
        stockRestant: stockTotal,
        vente: venteTheorique,
        sommeEncaissee,
        reste,
        depenses,
        resteFinal,
        especeGerant,
        resultatFinal
      };
      
      saveClientSpecificData('resultsData', resultsData);
      
      // Sauvegarder le stock actuel comme ancien stock pour la prochaine fois
      saveClientSpecificData('previousStock', {
        total: stockTotal
      });
      
      // Ajouter à l'historique des points spécifique au client
      const historicalData = getClientSpecificData('historicalResults', []);
      let history = historicalData || [];
      
      // Vérifier si une entrée pour cette date existe déjà
      const existingIndex = history.findIndex((item: any) => item.date === resultsData.date);
      
      if (existingIndex >= 0) {
        history[existingIndex] = resultsData;
      } else {
        history.push(resultsData);
      }
      
      saveClientSpecificData('historicalResults', history);
      
      toast({
        title: "Succès",
        description: "Résultats enregistrés avec succès!",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des résultats:", error);
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement des résultats.",
        variant: "destructive"
      });
    }
  };

  const value: AppContextType = {
    boissons,
    updateBoissons,
    
    // Stock
    stockItems,
    updateStockItem,
    stockTotal,
    stockDate,
    setStockDate,
    saveStockData,
    
    // Arrivage
    arrivageItems,
    updateArrivageItem,
    arrivageTotal,
    arrivageDate,
    setArrivageDate,
    saveArrivageData,
    
    // Calculs
    stockAncien,
    updateStockAncien,
    stockGeneral,
    venteTheorique,
    
    // Encaissements
    sommeEncaissee,
    updateSommeEncaissee,
    reste,
    
    // Dépenses
    depenses,
    ajouterDepense,
    supprimerDepense,
    totalDepenses,
    resteFinal,
    
    // Résultat final
    especeGerant,
    updateEspeceGerant,
    resultatFinal,
    calculerResultatFinal,
    saveResults
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
