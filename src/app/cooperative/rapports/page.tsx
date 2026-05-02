export default function RapportsPage() {
  return (
    <div className="flex flex-col flex-1 bg-[#FDF9F1] min-h-screen text-[#5D3A1A] p-8">
      <h1 className="text-2xl font-serif font-bold text-[#5D3A1A] mb-6">Rapports de Conformité EUDR</h1>
      <div className="bg-white rounded-2xl p-8 text-center border border-[#EBE3D5]">
        <p className="text-4xl mb-4">📄</p>
        <p className="font-bold text-[#825026]">Générateur de rapports en construction.</p>
        <p className="text-sm text-[#A8886A] mt-2">Cette section vous permettra de générer et d'exporter les documents de diligence raisonnable exigés par le règlement européen sur la déforestation (EUDR), basés sur les données géospatiales de vos lots.</p>
      </div>
    </div>
  );
}
