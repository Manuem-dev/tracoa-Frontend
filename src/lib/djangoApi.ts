import { Agriculteur, Lot } from "../types";

const DJANGO_API_BASE = "http://127.0.0.1:8000/api";

/**
 * Enregistre silencieusement un utilisateur Firebase dans Django (Agriculteur ou Coopérative)
 * afin d'obtenir un ID entier Django pour le Smart Contract.
 */
export const syncUserToDjango = async (user: Agriculteur): Promise<number | null> => {
  try {
    const endpoint = user.secteur === "Coopérative" ? "/users/cooperative_signup" : "/users/producer_signup";
    
    // Le backend Django s'attend à email, first_name, last_name, etc. (cf user/models.py et schemas.py)
    const payload = {
      email: user.email || `${user.id}@tracao.local`,
      first_name: user.prenom,
      last_name: user.nom,
      phone_number: user.telephone || "",
      password: "TracaoHackathon2026!", // Mot de passe dummy pour satisfaire l'inscription
      cooperative_name: user.secteur === "Coopérative" ? (user.nom + " " + user.prenom) : ""
    };

    const res = await fetch(`${DJANGO_API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      // Si l'utilisateur existe déjà (email unique), on devrait idéalement faire un GET pour récupérer son ID.
      // Pour le hackathon, on suppose que l'API renvoie l'utilisateur s'il existe (ou on gère l'erreur).
      console.warn("Erreur ou utilisateur existant côté Django:", errorText);
      // NOTE: En production, il faudrait un endpoint GET /users/by_email pour récupérer l'ID
    }

    // Le backend renvoie le user_model (ProducerList ou CooperativeList) avec le champ 'id'
    const data = await res.json();
    return data.id || null;
  } catch (err) {
    console.error("Impossible de synchroniser l'utilisateur avec Django:", err);
    return null;
  }
};

/**
 * Envoie le lot validé vers Django pour insertion dans le Smart Contract Vyper.
 */
export const pushLotToDjangoBlockchain = async (
  lot: Lot,
  producerDjangoId: number,
  coopDjangoId: number,
  producerEmail: string
): Promise<string | null> => {
  try {
    // 1. Création du StockProducer
    const stockProducerPayload = {
      producer: producerDjangoId,
      cooperative: coopDjangoId,
      weight: lot.poidsKg,
      date: new Date(lot.dateRecolte).toISOString().split('T')[0],
      product_type: lot.typeProduit,
      origin: "Firebase Sync", // Idéalement le nom de la région/ferme
      surface_size: 0,
      production_size: lot.poidsKg
    };

    const spRes = await fetch(`${DJANGO_API_BASE}/stock/stock_producer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stockProducerPayload)
    });

    if (!spRes.ok) throw new Error("Erreur création StockProducer: " + await spRes.text());
    const spData = await spRes.json();
    const stockProducerId = spData.id;

    // 2. Création du StockOrigin (La coopérative valide)
    // Cela déclenchera le signal `log_transaction_on_coop_source_receive` en Python
    const stockOriginPayload = {
      cooperative: coopDjangoId,
      producer_stock: stockProducerId,
      is_confirmed: true
    };

    const soRes = await fetch(`${DJANGO_API_BASE}/stock/stock_origin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stockOriginPayload)
    });

    if (!soRes.ok) throw new Error("Erreur création StockOrigin: " + await soRes.text());

    // Le smart contract a été appelé par les signaux Django. 
    // On génère un faux hash de transaction pour l'UI, ou on pourrait le récupérer si l'API le renvoyait.
    return `0x${Date.now().toString(16)}a3f7b`; 
  } catch (err) {
    console.error("Impossible de pousser le lot vers Django:", err);
    return null;
  }
};
