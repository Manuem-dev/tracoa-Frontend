"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lot, LotStatut, TypeProduit } from '../types';

interface LotsContextType {
  lots: Lot[];
  isLoading: boolean;
  error: string | null;
  totalLots: number;
  totalPoidsKg: number;
  lotsExportes: number;
  lotsEnAttente: number;
  lotsSyncronises: number;
  lotsRecents: Lot[];
  ajouterLot: (params: Omit<Lot, 'id' | 'lotId' | 'dateEnregistrement' | 'statut' | 'syncBlockchain'>) => Promise<Lot>;
  chargerDonneesDemo: (agriculteurId: string) => void;
  trouverParId: (lotId: string) => Lot | undefined;
}

const LotsContext = createContext<LotsContextType | undefined>(undefined);

export const LotsProvider = ({ children }: { children: ReactNode }) => {
  const [lots, setLots] = useState<Lot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('tracao_lots');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((l: any) => ({
          ...l,
          dateRecolte: new Date(l.dateRecolte),
          dateEnregistrement: new Date(l.dateEnregistrement)
        }));
        setLots(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (lots.length > 0) {
      localStorage.setItem('tracao_lots', JSON.stringify(lots));
    }
  }, [lots]);

  const genererLotId = () => {
    const annee = new Date().getFullYear();
    const numero = (lots.length + 1).toString().padStart(4, '0');
    return `LOT-${annee}-${numero}`;
  };

  const ajouterLot = async (params: Omit<Lot, 'id' | 'lotId' | 'dateEnregistrement' | 'statut' | 'syncBlockchain'>): Promise<Lot> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate network/blockchain delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const lot: Lot = {
        id: crypto.randomUUID(),
        lotId: genererLotId(),
        agriculteurId: params.agriculteurId,
        typeProduit: params.typeProduit,
        poidsKg: params.poidsKg,
        latitude: params.latitude,
        longitude: params.longitude,
        dateRecolte: params.dateRecolte,
        dateEnregistrement: new Date(),
        statut: 'enregistre',
        photoPath: params.photoPath,
        notesQualite: params.notesQualite,
        blockchainTxHash: `0x${Date.now().toString(16)}a3f7b`,
        syncBlockchain: true,
      };

      setLots(prev => [lot, ...prev]);
      return lot;
    } catch (e: any) {
      setError(`Erreur lors de l'enregistrement: ${e.message}`);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const chargerDonneesDemo = (agriculteurId: string) => {
    const now = new Date();
    
    const threeDaysAgo = new Date(now); threeDaysAgo.setDate(now.getDate() - 3);
    const fiveDaysAgo = new Date(now); fiveDaysAgo.setDate(now.getDate() - 5);
    const twelveDaysAgo = new Date(now); twelveDaysAgo.setDate(now.getDate() - 12);

    const demoLots: Lot[] = [
      {
        id: crypto.randomUUID(),
        lotId: 'LOT-2026-0042',
        agriculteurId,
        typeProduit: 'cacao',
        poidsKg: 280,
        latitude: 6.1296,
        longitude: 1.2254,
        dateRecolte: threeDaysAgo,
        dateEnregistrement: threeDaysAgo,
        statut: 'transfere',
        blockchainTxHash: '0x18429011a3f7b',
        syncBlockchain: true,
      },
      {
        id: crypto.randomUUID(),
        lotId: 'LOT-2026-0039',
        agriculteurId,
        typeProduit: 'cacao',
        poidsKg: 195,
        latitude: 6.1312,
        longitude: 1.2198,
        dateRecolte: fiveDaysAgo,
        dateEnregistrement: fiveDaysAgo,
        statut: 'enregistre',
        blockchainTxHash: '0x18428542c1d9e',
        syncBlockchain: true,
      },
      {
        id: crypto.randomUUID(),
        lotId: 'LOT-2026-0031',
        agriculteurId,
        typeProduit: 'cafe',
        poidsKg: 410,
        latitude: 6.1089,
        longitude: 1.2411,
        dateRecolte: twelveDaysAgo,
        dateEnregistrement: twelveDaysAgo,
        statut: 'eudrConforme',
        blockchainTxHash: '0x18421337f4a2c',
        syncBlockchain: true,
      }
    ];

    setLots(demoLots);
  };

  const trouverParId = (lotId: string) => {
    return lots.find(l => l.lotId === lotId);
  };

  const totalLots = lots.length;
  const totalPoidsKg = lots.reduce((sum, l) => sum + l.poidsKg, 0);
  const lotsExportes = lots.filter(l => l.statut === 'exporte' || l.statut === 'eudrConforme').length;
  const lotsEnAttente = lots.filter(l => l.statut === 'enregistre').length;
  const lotsSyncronises = lots.filter(l => l.syncBlockchain && l.blockchainTxHash).length;
  const lotsRecents = [...lots].sort((a, b) => new Date(b.dateEnregistrement).getTime() - new Date(a.dateEnregistrement).getTime()).slice(0, 5);

  return (
    <LotsContext.Provider value={{
      lots,
      isLoading,
      error,
      totalLots,
      totalPoidsKg,
      lotsExportes,
      lotsEnAttente,
      lotsSyncronises,
      lotsRecents,
      ajouterLot,
      chargerDonneesDemo,
      trouverParId
    }}>
      {children}
    </LotsContext.Provider>
  );
};

export const useLots = () => {
  const context = useContext(LotsContext);
  if (context === undefined) {
    throw new Error('useLots must be used within a LotsProvider');
  }
  return context;
};
