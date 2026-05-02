export default function RegistrePage() {
  return (
    <div className="flex flex-col flex-1 bg-[#FDF9F1] min-h-screen text-[#5D3A1A] p-8">
      <h1 className="text-2xl font-serif font-bold text-[#5D3A1A] mb-6">Registre Blockchain</h1>
      <div className="bg-white rounded-2xl p-8 text-center border border-[#EBE3D5]">
        <p className="text-4xl mb-4">⛓️</p>
        <p className="font-bold text-[#825026]">Explorateur Blockchain en construction.</p>
        <p className="text-sm text-[#A8886A] mt-2">Cette section vous permettra de consulter tous les blocs de transactions minés par les smart contracts Vyper pour vérifier l'intégrité de votre chaîne d'approvisionnement.</p>
      </div>
    </div>
  );
}
