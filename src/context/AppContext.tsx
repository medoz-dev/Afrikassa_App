
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface BoissonProps {
  id: number;
  nom: string;
  prix: number;
  trous: number | number[];
  type: string;
  special?: boolean;
  specialPrice?: number;
  specialUnit?: number;
}

interface User {
  id: string;
  nom: string;
  username: string;
  email?: string;
  role: string;
  statut: string;
}

interface AppContextType {
  venteTheorique: number;
  sommeEncaissee: number;
  reste: number;
  setVenteTheorique: (value: number) => void;
  setSommeEncaissee: (value: number) => void;
  setReste: (value: number) => void;
  boissons: BoissonProps[];
  updateBoissons: (boissons: BoissonProps[]) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateStockItem: (id: number, quantity: number) => void;
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
  const [venteTheorique, setVenteTheorique] = useState(0);
  const [sommeEncaissee, setSommeEncaissee] = useState(0);
  const [reste, setReste] = useState(0);
  const [boissons, setBoissons] = useState<BoissonProps[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load initial boissons data
  useEffect(() => {
    const loadBoissons = () => {
      try {
        const savedBoissons = localStorage.getItem('boissonsData');
        if (savedBoissons) {
          setBoissons(JSON.parse(savedBoissons));
        } else {
          // Default boissons data
          const defaultBoissons = [
            { id: 1, nom: "Castel", prix: 500, trous: 12, type: "casier" },
            { id: 2, nom: "Flag", prix: 450, trous: 12, type: "casier" },
            { id: 3, nom: "Beaufort", prix: 400, trous: 12, type: "casier" }
          ];
          setBoissons(defaultBoissons);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des boissons:', error);
      }
    };

    loadBoissons();
  }, []);

  const updateBoissons = (newBoissons: BoissonProps[]) => {
    setBoissons(newBoissons);
    localStorage.setItem('boissonsData', JSON.stringify(newBoissons));
  };

  const updateStockItem = (id: number, quantity: number) => {
    console.log(`Mise à jour du stock pour l'ID ${id} avec la quantité ${quantity}`);
    // Cette fonction peut être étendue pour mettre à jour le stock via Supabase
  };

  const value = {
    venteTheorique,
    sommeEncaissee,
    reste,
    setVenteTheorique,
    setSommeEncaissee,
    setReste,
    boissons,
    updateBoissons,
    currentUser,
    setCurrentUser,
    updateStockItem,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
