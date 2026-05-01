export type TypeProduit = 'cacao' | 'cafe';

export type LotStatut = 'enregistre' | 'transfere' | 'enTransformation' | 'exporte' | 'eudrConforme';

export interface Agriculteur {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  region: string;
  cooperative: string;
  certifie: boolean;
}

export interface Lot {
  id: string;
  lotId: string; // ex: LOT-2026-0042
  agriculteurId: string;
  typeProduit: TypeProduit;
  poidsKg: number;
  latitude: number;
  longitude: number;
  dateRecolte: Date | string;
  dateEnregistrement: Date | string;
  statut: LotStatut;
  photoPath?: string;
  notesQualite?: string;
  blockchainTxHash?: string;
  syncBlockchain: boolean;
}

export interface EtapeTransfert {
  id: string;
  lotId: string;
  acteur: string;
  role: 'ferme' | 'cooperative' | 'transformateur' | 'exportateur';
  date: Date | string;
  notes?: string;
}

// Helpers
export const getTypeProduitLabel = (type: TypeProduit): string => {
  return type === 'cacao' ? 'Cacao' : 'Café';
};

export const getTypeProduitEmoji = (type: TypeProduit): string => {
  return type === 'cacao' ? '🍫' : '☕';
};

export const getLotStatutLabel = (statut: LotStatut): string => {
  switch (statut) {
    case 'enregistre': return 'Enregistré';
    case 'transfere': return 'Transféré';
    case 'enTransformation': return 'En transformation';
    case 'exporte': return 'Exporté';
    case 'eudrConforme': return 'EUDR ✓';
    default: return statut;
  }
};
