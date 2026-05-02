"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { Agriculteur } from '../types';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../lib/firebase";

interface AgriculteurContextType {
  agriculteur: Agriculteur | null;
  estConnecte: boolean;
  connecter: (agri: Agriculteur) => Promise<void>;
  deconnecter: () => Promise<void>;
  mettreAJourProfil: (infos: Partial<Agriculteur>) => Promise<void>;
}

const AgriculteurContext = createContext<AgriculteurContextType | undefined>(undefined);

export const AgriculteurProvider = ({ children }: { children: ReactNode }) => {
  const [agriculteur, setAgriculteur] = useState<Agriculteur | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "agriculteurs", user.uid));
          if (docSnap.exists()) {
            setAgriculteur(docSnap.data() as Agriculteur);
          } else {
            // Unlikely to have user but no profile unless they just signed up via Google and handleAuthSuccess hasn't finished.
            // We just wait, since handleAuthSuccess will call connecter() anyway.
          }
        } catch (e) {
          console.error("Error fetching profile:", e);
        }
      } else {
        setAgriculteur(null);
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    const isPublicPath = pathname === '/login' || pathname === '/register';
    
    if (!agriculteur && !isPublicPath) {
      router.replace('/login');
    } else if (agriculteur && isPublicPath) {
      router.replace('/');
    }
  }, [agriculteur, isLoaded, pathname, router]);

  const connecter = async (agri: Agriculteur) => {
    setAgriculteur(agri);
    try {
      await setDoc(doc(db, "agriculteurs", agri.id), agri);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde dans Firebase:", error);
    }
  };

  const deconnecter = async () => {
    await signOut(auth);
    setAgriculteur(null);
    router.replace('/login');
  };
  
  const mettreAJourProfil = async (infos: Partial<Agriculteur>) => {
    if (!agriculteur) return;
    
    const updatedAgri = { ...agriculteur, ...infos };
    setAgriculteur(updatedAgri);
    
    try {
      await setDoc(doc(db, "agriculteurs", agriculteur.id), updatedAgri, { merge: true });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      // Rollback if needed or notify user. For now just log.
    }
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen bg-tracao-cream text-tracao-cacao font-bold text-xl h-full w-full">Chargement...</div>;
  }

  return (
    <AgriculteurContext.Provider value={{
      agriculteur,
      estConnecte: !!agriculteur,
      connecter,
      deconnecter,
      mettreAJourProfil
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
