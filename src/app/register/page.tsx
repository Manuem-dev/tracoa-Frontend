"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAgriculteur } from "../../context/AgriculteurContext";
import { Button } from "../../components/ui/Button";
import { ChevronDownIcon, XIcon } from "lucide-react";

export default function RegisterScreen() {
  const router = useRouter();
  const { connecter } = useAgriculteur();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    secteur: "Agriculteur",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const secteurs = ["Agriculteur", "Client", "Coopérative", "Transporteur"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.nom || !formData.prenom || !formData.secteur) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      const newProfile = {
        id: userCredential.user.uid,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        secteur: formData.secteur,
        certifie: false,
      };

      await connecter(newProfile);
      // redirection handled by AuthGuard in Context
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Cet email est déjà utilisé.");
      } else {
        setError("Erreur lors de l'inscription.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-6 bg-tracao-cream h-screen justify-center relative">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-tracao-cacao tracking-tight">Inscription</h1>
        <p className="text-tracao-choco-light mt-2 text-sm">Étape {step} sur 2</p>
      </div>

      <div className="bg-tracao-cream-light p-6 rounded-2xl shadow-sm border border-tracao-border-light">
        {error && (
          <div className="bg-tracao-error-light text-tracao-error text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-tracao-choco-light mb-1 uppercase tracking-wide">Prénom</label>
                <input 
                  type="text" 
                  name="prenom" 
                  required 
                  value={formData.prenom} 
                  onChange={handleChange}
                  className="w-full border border-tracao-border rounded-lg p-3 bg-white focus:outline-none focus:border-tracao-cacao focus:ring-1 focus:ring-tracao-cacao"
                  placeholder="Votre prénom"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-tracao-choco-light mb-1 uppercase tracking-wide">Nom</label>
                <input 
                  type="text" 
                  name="nom" 
                  required 
                  value={formData.nom} 
                  onChange={handleChange}
                  className="w-full border border-tracao-border rounded-lg p-3 bg-white focus:outline-none focus:border-tracao-cacao focus:ring-1 focus:ring-tracao-cacao"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-tracao-choco-light mb-1 uppercase tracking-wide">Secteur</label>
              <button 
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="w-full text-left border border-tracao-border rounded-lg p-3 bg-white focus:outline-none focus:border-tracao-cacao focus:ring-1 focus:ring-tracao-cacao flex justify-between items-center"
              >
                <span className="text-tracao-choco">{formData.secteur}</span>
                <ChevronDownIcon size={18} className="text-tracao-choco-pale" />
              </button>
            </div>

            <Button type="submit" fullWidth>
              Suivant
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-tracao-choco-light mb-1 uppercase tracking-wide">Email</label>
              <input 
                type="email" 
                name="email"
                required 
                value={formData.email} 
                onChange={handleChange}
                className="w-full border border-tracao-border rounded-lg p-3 bg-white focus:outline-none focus:border-tracao-cacao focus:ring-1 focus:ring-tracao-cacao"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-tracao-choco-light mb-1 uppercase tracking-wide">Mot de passe</label>
              <input 
                type="password" 
                name="password"
                required 
                value={formData.password} 
                onChange={handleChange}
                className="w-full border border-tracao-border rounded-lg p-3 bg-white focus:outline-none focus:border-tracao-cacao focus:ring-1 focus:ring-tracao-cacao"
                placeholder="••••••••"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-tracao-choco-light mb-1 uppercase tracking-wide">Confirmer le mot de passe</label>
              <input 
                type="password" 
                name="confirmPassword"
                required 
                value={formData.confirmPassword} 
                onChange={handleChange}
                className="w-full border border-tracao-border rounded-lg p-3 bg-white focus:outline-none focus:border-tracao-cacao focus:ring-1 focus:ring-tracao-cacao"
                placeholder="••••••••"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-tracao-cream-mid text-tracao-choco rounded-lg font-semibold hover:bg-tracao-border transition-colors"
              >
                Retour
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-[2] py-3 bg-tracao-cacao text-white rounded-lg font-semibold hover:bg-tracao-cacao/90 transition-colors disabled:opacity-70"
              >
                {isLoading ? "Inscription..." : "S'inscrire"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-tracao-choco-light">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-tracao-cacao font-bold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Tiroir (Bottom Sheet) pour Secteur */}
      <div className={`fixed inset-0 z-50 flex flex-col justify-end transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsDrawerOpen(false)} />
        <div className={`relative bg-tracao-cream w-full max-w-md mx-auto rounded-t-3xl p-6 shadow-2xl transition-transform duration-300 ease-out transform ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-tracao-choco">Choisissez un secteur</h3>
            <button 
              type="button" 
              onClick={() => setIsDrawerOpen(false)} 
              className="p-2 bg-tracao-cream-mid rounded-full text-tracao-choco hover:bg-tracao-border transition-colors"
            >
              <XIcon size={20} />
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {secteurs.map(s => (
              <button 
                key={s}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, secteur: s }));
                  setIsDrawerOpen(false);
                }}
                className={`p-4 rounded-xl text-left font-bold transition-all shadow-sm ${formData.secteur === s ? 'bg-tracao-cacao text-white scale-[1.02]' : 'bg-white text-tracao-choco hover:bg-tracao-cream-light border border-tracao-border-light'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
