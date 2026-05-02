// Cloudinary upload utility
// Config: set your environment variables in .env.local
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
// NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset  (unsigned preset)

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    // Keys not set yet — return a placeholder so the app doesn't crash
    console.warn("[Cloudinary] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET not set. Using local preview only.");
    return {
      secure_url: URL.createObjectURL(file),
      public_id: `local_${Date.now()}`,
      width: 0,
      height: 0,
    };
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "tracao/lots");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`);
  }

  return response.json() as Promise<CloudinaryUploadResult>;
}
