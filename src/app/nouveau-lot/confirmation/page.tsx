"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { useLots } from "../../../context/LotsContext";
import { Lot, getTypeProduitLabel } from "../../../types";
import { Button } from "../../../components/ui/Button";
import { CheckCircle2Icon, CopyIcon, ChevronRightIcon } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { trouverParId } = useLots();
  
  const id = searchParams.get("id");
  const [lot, setLot] = useState<Lot | null>(null);

  useEffect(() => {
    if (id) {
      const found = trouverParId(id);
      if (found) setLot(found);
    }
  }, [id, trouverParId]);

  if (!lot) return <div className="p-6">Chargement...</div>;

  const dateStr = new Date(lot.dateEnregistrement).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const copyHash = () => {
    if (lot.blockchainTxHash) {
      navigator.clipboard.writeText(lot.blockchainTxHash);
      alert("Hash copié !");
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-tracao-cream h-screen overflow-y-auto">
      <div className="bg-tracao-forest p-8 flex flex-col items-center justify-center text-white rounded-b-3xl shadow-lg relative z-10">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2Icon size={48} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-1 text-center leading-tight">Enregistrement réussi</h1>
        <p className="text-sm text-white/80">Le lot a été sécurisé sur la blockchain</p>
      </div>

      <div className="p-6 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-tracao-border">
          <div className="text-center mb-6">
            <h2 className="text-xs uppercase tracking-widest text-tracao-choco-light font-bold mb-1">ID du lot</h2>
            <p className="text-2xl font-black text-tracao-choco">{lot.lotId}</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white rounded-xl border-2 border-tracao-cacao inline-block">
              <QRCode value={lot.lotId} size={150} fgColor="#3D1F0A" />
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between border-b border-tracao-border-light pb-2">
              <span className="text-sm text-tracao-choco-light">Produit</span>
              <span className="text-sm font-bold text-tracao-choco">{getTypeProduitLabel(lot.typeProduit)}</span>
            </div>
            <div className="flex justify-between border-b border-tracao-border-light pb-2">
              <span className="text-sm text-tracao-choco-light">Poids</span>
              <span className="text-sm font-bold text-tracao-choco">{lot.poidsKg} kg</span>
            </div>
            <div className="flex justify-between border-b border-tracao-border-light pb-2">
              <span className="text-sm text-tracao-choco-light">Date</span>
              <span className="text-sm font-bold text-tracao-choco">{dateStr}</span>
            </div>
            <div className="flex justify-between border-b border-tracao-border-light pb-2">
              <span className="text-sm text-tracao-choco-light">GPS</span>
              <span className="text-sm font-bold text-tracao-choco font-mono">{lot.latitude.toFixed(4)}, {lot.longitude.toFixed(4)}</span>
            </div>
          </div>

          <div className="bg-tracao-cream-mid rounded-xl p-3 mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase font-bold text-tracao-choco-mid">Transaction Hash</span>
              <button onClick={copyHash} className="text-tracao-cacao"><CopyIcon size={14} /></button>
            </div>
            <p className="text-xs font-mono text-tracao-choco truncate">{lot.blockchainTxHash}</p>
          </div>

          <Button fullWidth onClick={() => router.push("/")} className="mb-3">
            Retour à l'accueil
          </Button>
          
          <Button variant="outline" fullWidth onClick={() => router.push(`/lot/${lot.lotId}`)}>
            Voir les détails <ChevronRightIcon size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationScreen() {
  return (
    <Suspense fallback={<div className="p-6">Chargement...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
