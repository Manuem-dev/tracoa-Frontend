"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon, HelpCircleIcon, ChevronDownIcon, 
  ChevronUpIcon, SearchIcon, MessageCircleIcon,
  PhoneIcon, MailIcon
} from "lucide-react";

const FAQ_DATA = [
  {
    category: "Général",
    questions: [
      {
        q: "Qu'est-ce que Tracao ?",
        a: "Tracao est une plateforme de traçabilité blockchain conçue pour les agriculteurs de café et de cacao au Togo. Elle permet de certifier l'origine de votre production conformément aux nouvelles normes européennes (EUDR)."
      },
      {
        q: "L'application fonctionne-t-elle sans internet ?",
        a: "Oui, Tracao est conçue pour fonctionner en mode hors-ligne. Vous pouvez enregistrer vos lots et capturer les positions GPS sur le terrain. Les données se synchroniseront automatiquement dès que vous retrouverez une connexion internet."
      }
    ]
  },
  {
    category: "Mes Lots & Traçabilité",
    questions: [
      {
        q: "Pourquoi dois-je capturer ma position GPS ?",
        a: "La réglementation EUDR exige que chaque lot de café ou de cacao importé en Europe soit lié à la parcelle exacte où il a été produit, afin de garantir qu'aucune déforestation n'a eu lieu après 2020."
      },
      {
        q: "Comment puis-je prouver l'authenticité d'un lot ?",
        a: "Chaque lot reçoit un identifiant unique et un QR code scellé sur la blockchain. En scannant ce code, n'importe qui dans la chaîne de valeur peut vérifier l'historique complet, du champ jusqu'à l'export."
      },
      {
        q: "Puis-je modifier un lot déjà enregistré ?",
        a: "Une fois qu'un lot est 'scellé' sur la blockchain, certaines informations comme le poids ou la localisation ne peuvent plus être modifiées pour garantir l'intégrité des données. Vérifiez bien vos informations avant de valider."
      }
    ]
  },
  {
    category: "Coopératives & Ventes",
    questions: [
      {
        q: "Comment choisir ma coopérative ?",
        a: "Lors de l'enregistrement d'un lot, l'application vous propose les coopératives partenaires situées dans votre région géographique. Une notification leur est envoyée dès que vous validez votre choix."
      },
      {
        q: "Comment savoir si ma coopérative a reçu mon lot ?",
        a: "Vous pouvez suivre l'état de votre lot dans l'espace 'Suivi'. Le statut passera de 'Enregistré' à 'Transféré' dès que la coopérative aura scanné et validé la réception."
      }
    ]
  }
];

export default function AideFAQScreen() {
  const router = useRouter();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (q: string) => {
    setOpenItems(prev => 
      prev.includes(q) ? prev.filter(i => i !== q) : [...prev, q]
    );
  };

  const filteredFaq = FAQ_DATA.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="flex flex-col flex-1 bg-zinc-100 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-tracao-cacao p-6 pt-12 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <button onClick={() => router.back()} className="mb-4 p-2 -ml-2 rounded-full hover:bg-white/10">
          <ArrowLeftIcon size={24} />
        </button>
        <h1 className="text-2xl font-black mb-2">Aide & Support</h1>
        <p className="text-sm text-white/70">Tout ce que vous devez savoir sur Tracao</p>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-tracao-choco-pale">
            <SearchIcon size={18} />
          </div>
          <input
            type="text"
            placeholder="Rechercher une réponse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/15 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all"
          />
        </div>
      </div>

      <div className="p-5 flex flex-col gap-6">
        {filteredFaq.map((cat) => (
          <section key={cat.category}>
            <h2 className="text-xs font-bold text-tracao-choco-pale uppercase tracking-widest mb-3 px-1">
              {cat.category}
            </h2>
            <div className="bg-white border border-tracao-border-light rounded-3xl overflow-hidden divide-y divide-tracao-border-light">
              {cat.questions.map((item) => {
                const isOpen = openItems.includes(item.q);
                return (
                  <div key={item.q} className="group">
                    <button
                      onClick={() => toggleItem(item.q)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-tracao-cream-light transition-colors"
                    >
                      <span className="text-sm font-bold text-tracao-choco leading-snug pr-4">
                        {item.q}
                      </span>
                      <div className={`shrink-0 text-tracao-choco-pale transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDownIcon size={20} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                        <p className="text-sm text-tracao-choco-light leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Contact Support */}
        <div className="mt-4 bg-tracao-cacao/5 border border-tracao-cacao/10 rounded-3xl p-6 text-center">
          <div className="w-12 h-12 bg-tracao-cacao rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
            <MessageCircleIcon size={24} />
          </div>
          <h3 className="font-black text-tracao-choco mb-1">Besoin d'aide supplémentaire ?</h3>
          <p className="text-xs text-tracao-choco-light mb-6">Nos conseillers sont disponibles du lundi au vendredi de 8h à 18h.</p>
          
          <div className="grid grid-cols-2 gap-3">
            <a href="tel:+22800000000" className="flex items-center justify-center gap-2 bg-white border border-tracao-border-light py-3 rounded-xl text-sm font-bold text-tracao-choco hover:bg-white/80 transition-all">
              <PhoneIcon size={16} /> Appeler
            </a>
            <a href="mailto:support@tracao.tg" className="flex items-center justify-center gap-2 bg-white border border-tracao-border-light py-3 rounded-xl text-sm font-bold text-tracao-choco hover:bg-white/80 transition-all">
              <MailIcon size={16} /> Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
