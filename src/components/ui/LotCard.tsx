"use client";

import Link from "next/link";
import { Lot, getTypeProduitEmoji, getTypeProduitLabel, getLotStatutLabel } from "../../types";
import { TracaoBadge } from "./TracaoBadge";

export function LotCard({ lot }: { lot: Lot }) {
  const dateStr = new Date(lot.dateEnregistrement).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  let badgeType: 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'neutral';
  if (lot.statut === 'eudrConforme') badgeType = 'success';
  if (lot.statut === 'enregistre') badgeType = 'warning';
  if (lot.statut === 'transfere' || lot.statut === 'enTransformation') badgeType = 'info';

  const hasPhoto = !!lot.photoPath;

  return (
    <Link
      href={`/lot/${lot.lotId}`}
      className="block w-full bg-tracao-cream-light border border-tracao-border-light rounded-2xl overflow-hidden mb-3 shadow-sm hover:shadow-md hover:scale-[1.005] transition-all"
    >
      {/* Photo banner or emoji header */}
      {hasPhoto ? (
        <div className="relative aspect-[5/4] sm:aspect-square w-full overflow-hidden bg-tracao-choco">
          <img
            src={lot.photoPath!}
            alt={`Photo du lot ${lot.lotId}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay - taller to cover more of the square image smoothly */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Status badge at the top right for better visibility on square images */}
          <div className="absolute top-3 right-3">
            <TracaoBadge label={getLotStatutLabel(lot.statut)} type={badgeType} />
          </div>

          {/* Lot ID and Type over the image at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end">
            <span className="text-xs text-white/80 uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
              <span>{getTypeProduitEmoji(lot.typeProduit)}</span>
              {getTypeProduitLabel(lot.typeProduit)}
            </span>
            <h3 className="font-black text-white text-xl lg:text-2xl leading-tight">{lot.lotId}</h3>
          </div>
        </div>
      ) : (
        /* No photo — coloured emoji header */
        <div className="bg-tracao-cream-mid px-4 pt-5 pb-4 flex justify-between items-start">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm">
              {getTypeProduitEmoji(lot.typeProduit)}
            </div>
            <div>
              <span className="text-xs text-tracao-choco-pale uppercase font-bold tracking-wider">{getTypeProduitLabel(lot.typeProduit)}</span>
              <h3 className="font-black text-tracao-choco text-xl leading-tight mt-0.5">{lot.lotId}</h3>
            </div>
          </div>
          <TracaoBadge label={getLotStatutLabel(lot.statut)} type={badgeType} />
        </div>
      )}

      {/* Body */}
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex gap-5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-tracao-choco-pale font-semibold">Poids</span>
            <span className="text-base font-black text-tracao-cacao">{lot.poidsKg} kg</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-tracao-choco-pale font-semibold">Date</span>
            <span className="text-sm font-semibold text-tracao-choco">{dateStr}</span>
          </div>
          {(lot.syncBlockchain && !!lot.blockchainTxHash) && (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-tracao-choco-pale font-semibold">Blockchain</span>
              <span className="text-sm font-semibold text-tracao-forest flex items-center gap-1">✓ Sync</span>
            </div>
          )}
        </div>
        <div className="text-tracao-cacao">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
    </Link>
  );
}
