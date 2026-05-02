/**
 * cloudinary.ts — Service d'upload d'images vers Cloudinary
 * Utilise l'upload non signé (unsigned preset configuré dans .env.local)
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload un fichier image vers Cloudinary (existant: lots, nouveau: profils/kyc)
 * @param file - Le fichier image à uploader
 * @param folder - Le dossier Cloudinary cible (ex: "tracao/profils", "tracao/kyc")
 * @param onProgress - Callback optionnel pour suivre la progression (0-100)
 */
export async function uploadImage(
  file: File,
  folder: string = "tracao/lots",
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.warn("[Cloudinary] Variables non configurées — preview local uniquement.");
    return {
      secure_url: URL.createObjectURL(file),
      public_id: `local_${Date.now()}`,
      width: 0,
      height: 0,
      format: "local",
    };
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResult);
        } catch {
          reject(new Error("Réponse Cloudinary invalide"));
        }
      } else {
        reject(new Error(`Erreur d'upload : ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Erreur réseau lors de l'upload")));
    xhr.addEventListener("abort", () => reject(new Error("Upload annulé")));

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
}

/** Rétro-compatibilité avec l'ancien nom utilisé dans nouveau-lot */
export const uploadToCloudinary = (file: File) => uploadImage(file, "tracao/lots");

/**
 * Valide un fichier image (format + taille)
 * @returns message d'erreur ou null si valide
 */
export function validateImageFile(file: File, maxMB: number = 10): string | null {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
  if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic|heif)$/i)) {
    return "Format non supporté. Utilisez JPG, PNG ou WEBP.";
  }
  if (file.size > maxMB * 1024 * 1024) {
    return `Image trop lourde. Maximum ${maxMB} Mo.`;
  }
  return null;
}
