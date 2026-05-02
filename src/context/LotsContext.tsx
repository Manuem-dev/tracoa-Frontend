"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lot, LotStatut, TypeProduit, Notification, Cooperative } from '../types';
import { collection, getDocs, query, where, setDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

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
  chargerDonneesDemo: (agriculteurId: string) => Promise<void>;
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
        const parsed = JSON.parse(saved);
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
      const lotRef = doc(collection(db, "lots"));
      const lot: Lot = {
        id: lotRef.id,
        lotId: genererLotId(),
        agriculteurId: params.agriculteurId,
        cooperativeId: params.cooperativeId,
        typeProduit: params.typeProduit,
        poidsKg: params.poidsKg,
        latitude: params.latitude,
        longitude: params.longitude,
        dateRecolte: params.dateRecolte,
        dateEnregistrement: new Date().toISOString(),
        statut: 'enregistre',
        photoPath: params.photoPath,
        notesQualite: params.notesQualite,
        blockchainTxHash: `0x${Date.now().toString(16)}a3f7b`,
        syncBlockchain: true,
      };

      await setDoc(lotRef, lot);

      // Create notification for the cooperative if one was selected
      if (params.cooperativeId) {
        const notifRef = doc(collection(db, "notifications"));
        const notification: Notification = {
          id: notifRef.id,
          destinataireId: params.cooperativeId,
          type: 'demande_reception',
          date: new Date().toISOString(),
          lu: false,
          message: `Nouveau lot enregistré par un agriculteur. Lot ID: ${lot.lotId}`,
          metadata: {
            lotId: lot.lotId,
            agriculteurId: params.agriculteurId,
            agriculteurNom: "Agriculteur", // We could pass this in too
          }
        };
        await setDoc(notifRef, notification);
      }

      setLots(prev => [lot, ...prev]);
      return lot;
    } catch (e: any) {
      setError(`Erreur lors de l'enregistrement: ${e.message}`);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const chargerDonneesDemo = async (agriculteurId: string) => {
    try {
      const q = query(collection(db, "lots"), where("agriculteurId", "==", agriculteurId));
      const querySnapshot = await getDocs(q);
      const fetchedLots: Lot[] = [];
      querySnapshot.forEach((document) => {
        fetchedLots.push(document.data() as Lot);
      });
      
      setLots(fetchedLots.sort((a, b) => new Date(b.dateEnregistrement).getTime() - new Date(a.dateEnregistrement).getTime()));
    } catch (e) {
      console.error("Erreur lors de la récupération des lots :", e);
    }
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
