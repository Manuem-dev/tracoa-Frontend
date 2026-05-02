"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLots } from "../../context/LotsContext";
import { Lot, getTypeProduitLabel, getTypeProduitEmoji, getLotStatutLabel } from "../../types";
import { TracaoBadge } from "../../components/ui/TracaoBadge";
import { ArrowLeftIcon, CopyIcon, MapPinIcon, CheckCircle2Icon, QrCodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

function LotDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { trouverParId } = useLots();
  
  const id = searchParams.get("id");
  const [lot, setLot] = useState<Lot | null>(null);

  useEffect(() => {
    if (id) {
      const found = trouverParId(id);
      if (found) setLot(found);
    }
  }, [id, trouverParId]);

  if (!lot) return <div className="p-6 text-tracao-choco">Chargement du lot {id}...</div>;

  const dateStr = new Date(lot.dateEnregistrement).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const copyHash = () => {
    if (lot.blockchainTxHash) {
      navigator.clipboard.writeText(lot.blockchainTxHash);
      alert("Hash copié !");
    }
  };

  let badgeType: 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'neutral';
  if (lot.statut === 'eudrConforme') badgeType = 'success';
  if (lot.statut === 'enregistre') badgeType = 'warning';
  if (lot.statut === 'transfere' || lot.statut === 'enTransformation') badgeType = 'info';

  const timelineSteps = [
    { label: "Enregistré à la ferme", done: true, role: "Ferme" },
    { label: "Transféré à la coopérative", done: ['transfere', 'enTransformation', 'exporte', 'eudrConforme'].includes(lot.statut), role: "Coopérative" },
    { label: "Transformé / Conditionné", done: ['enTransformation', 'exporte', 'eudrConforme'].includes(lot.statut), role: "Transformateur" },
    { label: "Exporté", done: ['exporte', 'eudrConforme'].includes(lot.statut), role: "Exportateur" }
  ];

  return (
    <div className="flex flex-col flex-1 bg-tracao-cream h-screen overflow-y-auto pb-20">
      <div className="bg-tracao-cacao p-4 text-white flex items-center shadow-sm relative z-10">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all">
          <ArrowLeftIcon size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">Détails du Lot</h1>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Photo du lot (si présente) */}
        {lot.photoPath && (
          <div className="rounded-2xl overflow-hidden border border-tracao-border shadow-sm bg-tracao-choco">
            <img 
              src={lot.photoPath} 
              alt={`Lot ${lot.lotId}`} 
              className="w-full h-32 object-cover"
            />
          </div>
        )}

        {/* En-tête */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-tracao-border">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-tracao-cream-light border border-tracao-border flex items-center justify-center text-2xl">
                {getTypeProduitEmoji(lot.typeProduit)}
              </div>
              <div>
                <h2 className="text-xl font-black text-tracao-choco">{lot.lotId}</h2>
                <p className="text-xs text-tracao-choco-pale">{getTypeProduitLabel(lot.typeProduit)}</p>
              </div>
            </div>
            <TracaoBadge label={getLotStatutLabel(lot.statut)} type={badgeType} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-[10px] uppercase font-bold text-tracao-choco-light mb-0.5">Poids</p>
              <p className="text-lg font-bold text-tracao-cacao">{lot.poidsKg} kg</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-tracao-choco-light mb-0.5">Date</p>
              <p className="text-sm font-bold text-tracao-choco">{dateStr}</p>
            </div>
          </div>
        </div>

        {/* GPS */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-tracao-border flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-tracao-cream-mid flex items-center justify-center text-tracao-cacao shrink-0">
            <MapPinIcon size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-tracao-choco mb-1">Localisation de récolte</h3>
            <p className="text-xs font-mono text-tracao-choco-light">{lot.latitude.toFixed(6)}° N, {lot.longitude.toFixed(6)}° E</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-tracao-border flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4 w-full">
            <QrCodeIcon size={18} className="text-tracao-cacao" />
            <h3 className="text-sm font-bold text-tracao-choco">Code QR de Traçabilité</h3>
          </div>
          <div className="bg-white p-3 rounded-xl border border-tracao-border-light shadow-sm inline-block">
            <QRCodeSVG 
              value={`${window.location.origin}/lot/${lot.lotId}`} 
              size={180} 
              level="H"
              fgColor="#3D2000" // tracao-choco
              bgColor="#ffffff"
            />
          </div>
          <p className="text-[10px] text-tracao-choco-pale text-center mt-4">
            Scannez ce code pour vérifier l'authenticité et l'origine de ce lot.
          </p>
        </div>

        {/* Blockchain */}
        <div className="bg-tracao-cream-mid rounded-2xl p-5 border border-tracao-border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-tracao-choco flex items-center gap-2">
              Blockchain Status 
              {(lot.syncBlockchain && !!lot.blockchainTxHash) && <CheckCircle2Icon size={16} className="text-tracao-forest" />}
            </h3>
            {lot.blockchainTxHash && (
              <button onClick={copyHash} className="text-tracao-cacao"><CopyIcon size={16} /></button>
            )}
          </div>
          <p className="text-xs font-mono text-tracao-choco break-all bg-white/50 p-3 rounded-lg border border-tracao-border-light">
            {lot.blockchainTxHash || "En attente de synchronisation..."}
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-tracao-border">
          <h3 className="text-sm font-bold text-tracao-choco mb-5">Parcours du lot</h3>
          
          <div className="relative pl-3">
            {/* Ligne verticale */}
            <div className="absolute left-[17px] top-2 bottom-6 w-0.5 bg-tracao-border-light" />
            
            {timelineSteps.map((step, index) => (
              <div key={index} className="flex gap-4 mb-6 relative">
                <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 z-10 ${step.done ? 'bg-tracao-forest' : 'bg-tracao-border'}`} />
                <div>
                  <p className={`text-sm font-bold ${step.done ? 'text-tracao-choco' : 'text-tracao-choco-pale'}`}>{step.label}</p>
                  <p className="text-xs text-tracao-choco-light mt-0.5">{step.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function DetailLotScreen() {
  return (
    <Suspense fallback={<div className="p-6 text-tracao-choco">Chargement...</div>}>
      <LotDetailContent />
    </Suspense>
  );
}
