"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ListIcon, PlusCircleIcon, SettingsIcon } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  // Never show on auth pages, and on desktop (lg+) SideNav takes over
  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-tracao-cream-light border-t border-tracao-border flex justify-around items-center h-[65px] z-50 px-2 pb-safe">
      <NavItem href="/" icon={<HomeIcon size={24} />} label="Accueil" isActive={pathname === '/'} />
      <NavItem href="/nouveau-lot" icon={<PlusCircleIcon size={24} />} label="Nouveau" isActive={pathname === '/nouveau-lot'} />
      <NavItem href="/mes-lots" icon={<ListIcon size={24} />} label="Mes Lots" isActive={pathname === '/mes-lots'} />
      <NavItem href="/profil" icon={<SettingsIcon size={24} />} label="Profil" isActive={pathname === '/profil'} />
    </div>
  );
}

function NavItem({ href, icon, label, isActive }: { href: string; icon: React.ReactNode; label: string; isActive: boolean }) {
  const colorClass = isActive ? "text-tracao-cacao" : "text-tracao-choco-pale";
  const weightClass = isActive ? "font-semibold" : "font-medium";

  return (
    <Link href={href} className={`flex flex-col items-center justify-center gap-1 w-16 h-full ${colorClass}`}>
      {icon}
      <span className={`text-[11px] ${weightClass}`}>{label}</span>
    </Link>
  );
}
