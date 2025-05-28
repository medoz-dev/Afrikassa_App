
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  venteTheorique: number;
  sommeEncaissee: number;
  reste: number;
  setVenteTheorique: (value: number) => void;
  setSommeEncaissee: (value: number) => void;
  setReste: (value: number) => void;
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

  const value = {
    venteTheorique,
    sommeEncaissee,
    reste,
    setVenteTheorique,
    setSommeEncaissee,
    setReste,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
