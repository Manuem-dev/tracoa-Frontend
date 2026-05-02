"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ListIcon, PlusCircleIcon, SettingsIcon, LogOutIcon, HistoryIcon } from "lucide-react";
import { useAgriculteur } from "../../context/AgriculteurContext";

const navItems = [
  { href: "/", icon: HomeIcon, label: "Accueil" },
  { href: "/nouveau-lot", icon: PlusCircleIcon, label: "Nouveau Lot" },
  { href: "/suivi", icon: HistoryIcon, label: "Suivi des Lots" },
  { href: "/mes-lots", icon: ListIcon, label: "Mes Lots" },
  { href: "/profil", icon: SettingsIcon, label: "Profil" },
];

export function SideNav() {
  const pathname = usePathname();
  const { agriculteur, deconnecter } = useAgriculteur();

  if (!agriculteur) return null;

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-tracao-choco shrink-0 sticky top-0">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src="/icon-192.png" alt="Tracao Logo" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Tracao</h1>
          </div>
        </div>
      </div>

      {/* User profile */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
          <div className="w-10 h-10 rounded-full bg-tracao-gold flex items-center justify-center text-tracao-choco font-black text-lg shrink-0 overflow-hidden">
            {agriculteur.photoUrl ? (
              <img src={agriculteur.photoUrl} alt="Photo de profil" className="w-full h-full object-cover" />
            ) : (
              <span>{agriculteur.prenom.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{agriculteur.prenom} {agriculteur.nom}</p>
            <p className="text-[11px] text-white/50 truncate">{agriculteur.secteur || agriculteur.region || "Agriculteur"}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold transition-all ${
                isActive
                  ? "bg-tracao-cacao text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm">{label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-tracao-gold" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => deconnecter()}
          className="flex items-center gap-3 text-white/50 hover:text-tracao-rust-light transition-colors px-4 py-2.5 rounded-xl hover:bg-white/5 w-full"
        >
          <LogOutIcon size={18} />
          <span className="text-sm font-semibold">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
