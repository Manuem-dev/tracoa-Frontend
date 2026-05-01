"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Agriculteur } from '../types';

interface AgriculteurContextType {
  agriculteur: Agriculteur | null;
  estConnecte: boolean;
  connecter: (agri: Agriculteur) => void;
  deconnecter: () => void;
}

const AgriculteurContext = createContext<AgriculteurContextType | undefined>(undefined);

export const AgriculteurProvider = ({ children }: { children: ReactNode }) => {
  const [agriculteur, setAgriculteur] = useState<Agriculteur | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tracao_agriculteur');
    if (saved) {
      try {
        setAgriculteur(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse agriculteur from local storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const connecter = (agri: Agriculteur) => {
    setAgriculteur(agri);
    localStorage.setItem('tracao_agriculteur', JSON.stringify(agri));
  };

  const deconnecter = () => {
    setAgriculteur(null);
    localStorage.removeItem('tracao_agriculteur');
  };

  if (!isLoaded) return null; // Wait for hydration

  return (
    <AgriculteurContext.Provider value={{
      agriculteur,
      estConnecte: !!agriculteur,
      connecter,
      deconnecter
    }}>
      {children}
    </AgriculteurContext.Provider>
  );
};

export const useAgriculteur = () => {
  const context = useContext(AgriculteurContext);
  if (context === undefined) {
    throw new Error('useAgriculteur must be used within an AgriculteurProvider');
  }
  return context;
};
