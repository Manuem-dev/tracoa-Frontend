"use client";

import { useState } from "react";
import { useLots } from "../../context/LotsContext";
import { LotCard } from "../../components/ui/LotCard";
import { SearchIcon, FilterIcon, PackageIcon } from "lucide-react";

export default function MesLotsScreen() {
  const { lots, totalLots, totalPoidsKg, lotsSyncronises } = useLots();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredLots = lots.filter(lot => 
    lot.lotId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 bg-tracao-cream lg:bg-zinc-100 min-h-screen">
      {/* Header */}
      <div className="bg-tracao-cacao lg:rounded-2xl lg:m-6 lg:mb-0 p-6 text-white shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl lg:text-2xl font-bold">Mes Lots</h1>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
            {totalLots} lot{totalLots > 1 ? 's' : ''}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-xl font-black">{totalLots}</p>
            <p className="text-[10px] text-white/60 uppercase font-semibold mt-0.5">Total lots</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-xl font-black">{totalPoidsKg.toFixed(0)}</p>
            <p className="text-[10px] text-white/60 uppercase font-semibold mt-0.5">Kg total</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-xl font-black">{lotsSyncronises}</p>
            <p className="text-[10px] text-white/60 uppercase font-semibold mt-0.5">Blockchain</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-tracao-choco-pale" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par ID de lot..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-xl py-3 pl-10 pr-10 text-tracao-choco placeholder:text-tracao-choco-pale focus:outline-none focus:ring-2 focus:ring-tracao-gold"
          />
          <FilterIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-tracao-cacao" size={18} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6 mt-2 mb-20 lg:mb-0">
        {filteredLots.length === 0 ? (
          <div className="text-center py-16">
            <PackageIcon size={48} className="mx-auto text-tracao-choco-pale mb-4" />
            <p className="text-sm font-bold text-tracao-choco-light">Aucun lot trouvé.</p>
            <p className="text-xs text-tracao-choco-pale mt-1">Modifiez votre recherche ou créez un nouveau lot.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredLots.map(lot => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


