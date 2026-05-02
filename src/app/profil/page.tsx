"use client";

import { useState } from "react";
import { useAgriculteur } from "../../context/AgriculteurContext";
import { useLots } from "../../context/LotsContext";
import {
  UserIcon, MailIcon, PhoneIcon, MapPinIcon, BuildingIcon,
  ShieldCheckIcon, LogOutIcon, ChevronRightIcon, PackageIcon,
  WeightIcon, LinkIcon, EditIcon, CheckCircle2Icon, XCircleIcon,
  BellIcon, HelpCircleIcon, InfoIcon
} from "lucide-react";

export default function ProfilScreen() {
  const { agriculteur, deconnecter } = useAgriculteur();
  const { totalLots, totalPoidsKg, lotsSyncronises } = useLots();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!agriculteur) return null;

  const initials = `${agriculteur.prenom.charAt(0)}${agriculteur.nom.charAt(0)}`.toUpperCase();

  const stats = [
    { label: "Lots enregistrés", value: totalLots, icon: "📦" },
    { label: "Kg total", value: `${totalPoidsKg.toFixed(0)} kg`, icon: "⚖️" },
    { label: "Sur blockchain", value: lotsSyncronises, icon: "🔗" },
  ];

  const infoRows = [
    { icon: UserIcon, label: "Nom complet", value: `${agriculteur.prenom} ${agriculteur.nom}` },
    { icon: MailIcon, label: "Email", value: agriculteur.email || "Non renseigné" },
    { icon: PhoneIcon, label: "Téléphone", value: agriculteur.telephone || "Non renseigné" },
    { icon: MapPinIcon, label: "Région", value: agriculteur.region || "Non renseignée" },
    { icon: BuildingIcon, label: "Coopérative", value: agriculteur.cooperative || "Indépendant" },
    { icon: ShieldCheckIcon, label: "Secteur", value: agriculteur.secteur || "Agriculteur" },
  ];

  return (
    <div className="flex flex-col flex-1 bg-tracao-cream lg:bg-zinc-100 min-h-screen pb-24 lg:pb-8">

      {/* Header */}
      <div className="bg-tracao-cacao lg:rounded-2xl lg:m-6 lg:mb-0 p-6 pt-10 lg:pt-8 text-white shadow-md">
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-tracao-gold flex items-center justify-center text-tracao-choco font-black text-2xl shadow-lg shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black truncate">{agriculteur.prenom} {agriculteur.nom}</h1>
            <p className="text-sm text-white/60 truncate">{agriculteur.email || "Pas d'email"}</p>
            {/* Certification badge */}
            <div className="mt-1.5 flex items-center gap-1.5">
              {agriculteur.certifie ? (
                <span className="flex items-center gap-1 text-[11px] bg-tracao-forest-light text-tracao-forest font-bold px-2 py-0.5 rounded-full">
                  <CheckCircle2Icon size={11} /> Certifié
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] bg-white/10 text-white/60 font-semibold px-2 py-0.5 rounded-full">
                  <XCircleIcon size={11} /> Non certifié
                </span>
              )}
              <span className="text-[11px] bg-white/15 text-white/80 font-semibold px-2 py-0.5 rounded-full">
                {agriculteur.secteur || "Agriculteur"}
              </span>
            </div>
          </div>
          <button className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors shrink-0">
            <EditIcon size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/15 rounded-xl p-3 text-center">
              <div className="text-lg mb-0.5">{s.icon}</div>
              <p className="text-lg font-black">{s.value}</p>
              <p className="text-[9px] text-white/60 uppercase font-semibold leading-tight mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 lg:p-6 mt-2 flex flex-col gap-4">

        {/* Informations personnelles */}
        <section>
          <h2 className="text-xs font-bold text-tracao-choco-pale uppercase tracking-widest mb-2 px-1">
            Informations personnelles
          </h2>
          <div className="bg-tracao-cream-light border border-tracao-border-light rounded-2xl overflow-hidden divide-y divide-tracao-border-light">
            {infoRows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-tracao-cream-mid flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-tracao-cacao" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-tracao-choco-pale uppercase font-semibold">{label}</p>
                  <p className={`text-sm font-semibold truncate ${value === "Non renseigné" || value === "Non renseignée" ? "text-tracao-choco-pale italic" : "text-tracao-choco"}`}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Identifiant blockchain */}
        <section>
          <h2 className="text-xs font-bold text-tracao-choco-pale uppercase tracking-widest mb-2 px-1">
            Identifiant blockchain
          </h2>
          <div className="bg-tracao-cream-light border border-tracao-border-light rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <LinkIcon size={14} className="text-tracao-cacao shrink-0" />
              <span className="text-xs font-bold text-tracao-choco uppercase tracking-wide">ID Tracao</span>
            </div>
            <p className="text-xs font-mono text-tracao-choco-light break-all bg-tracao-cream-mid rounded-lg px-3 py-2 mt-1">
              {agriculteur.id}
            </p>
          </div>
        </section>

        {/* Paramètres */}
        <section>
          <h2 className="text-xs font-bold text-tracao-choco-pale uppercase tracking-widest mb-2 px-1">
            Paramètres
          </h2>
          <div className="bg-tracao-cream-light border border-tracao-border-light rounded-2xl overflow-hidden divide-y divide-tracao-border-light">
            {[
              { icon: BellIcon, label: "Notifications", sub: "Gérer les alertes" },
              { icon: HelpCircleIcon, label: "Aide & Support", sub: "FAQ, contact" },
              { icon: InfoIcon, label: "À propos de Tracao", sub: "Version 1.0.0" },
            ].map(({ icon: Icon, label, sub }) => (
              <button key={label} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-tracao-cream transition-colors">
                <div className="w-8 h-8 rounded-lg bg-tracao-cream-mid flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-tracao-choco-light" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-tracao-choco">{label}</p>
                  <p className="text-[11px] text-tracao-choco-pale">{sub}</p>
                </div>
                <ChevronRightIcon size={16} className="text-tracao-choco-pale" />
              </button>
            ))}
          </div>
        </section>

        {/* Déconnexion */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 bg-tracao-error-light border border-tracao-error/20 text-tracao-error font-bold py-4 rounded-2xl hover:bg-tracao-error/15 transition-colors"
        >
          <LogOutIcon size={18} />
          Se déconnecter
        </button>

        <p className="text-center text-[11px] text-tracao-choco-pale pb-2">
          Tracao · Traçabilité Cacao-Café · v1.0.0
        </p>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end lg:items-center justify-center">
          <div className="bg-tracao-cream-light w-full max-w-md rounded-t-3xl lg:rounded-3xl p-6 shadow-2xl">
            <div className="w-12 h-12 bg-tracao-error-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogOutIcon size={22} className="text-tracao-error" />
            </div>
            <h3 className="text-lg font-extrabold text-tracao-choco text-center mb-1">
              Se déconnecter ?
            </h3>
            <p className="text-sm text-tracao-choco-light text-center mb-6">
              Vous serez redirigé vers la page de connexion.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3.5 bg-tracao-cream-mid text-tracao-choco rounded-xl font-bold hover:bg-tracao-border transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => deconnecter()}
                className="flex-[1.5] py-3.5 bg-tracao-error text-white rounded-xl font-bold hover:bg-tracao-error/90 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
