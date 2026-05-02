"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { ArrowLeftIcon, QrCodeIcon, XIcon, ShieldCheckIcon } from "lucide-react";
import { Button } from "../../components/ui/Button";

export default function ScannerScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Component unmount logic to stop the scanner
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanner = async () => {
    setError(null);
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        setHasPermission(true);
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        // Start scanning with the back camera (environment)
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // Success callback
            html5QrCode.stop();
            handleScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Ignore minor errors like "no QR code found"
          }
        );
      } else {
        setHasPermission(false);
        setError("Aucune caméra trouvée sur cet appareil.");
      }
    } catch (err) {
      setHasPermission(false);
      setError("Permission refusée ou erreur d'accès à la caméra.");
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    try {
      // Assuming the QR code contains a URL like: https://app.tracao.com/lot/LOT-1234
      const url = new URL(decodedText);
      const pathname = url.pathname;
      
      // Check if it's a valid Tracao URL
      if (pathname.startsWith('/lot/')) {
        // Automatically redirect to the lot page
        router.push(pathname);
      } else {
        setError("Ce QR code n'est pas un code Tracao valide.");
      }
    } catch (e) {
      // If it's just raw text (e.g. LOT-1234)
      if (decodedText.startsWith('LOT-')) {
        router.push(`/lot/${decodedText}`);
      } else {
        setError("Format de QR code non reconnu.");
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-black h-screen overflow-hidden relative">
      {/* Header overlaid on the camera */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent text-white">
        <button onClick={() => router.back()} className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all">
          <XIcon size={24} />
        </button>
        <div className="flex items-center gap-2 bg-tracao-forest/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
          <ShieldCheckIcon size={16} />
          <span className="text-sm font-bold tracking-wide">Scanner sécurisé</span>
        </div>
      </div>

      {/* Main scanner area */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full">
        {hasPermission === null ? (
          <div className="p-8 text-center bg-zinc-900/80 backdrop-blur-md rounded-3xl max-w-sm mx-4">
            <div className="w-20 h-20 bg-tracao-cacao/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <QrCodeIcon size={40} className="text-tracao-gold" />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Vérification de lot</h2>
            <p className="text-sm text-white/70 mb-8 leading-relaxed">
              Scannez le QR Code d'un lot Tracao pour vérifier instantanément son origine et son authenticité sur la blockchain.
            </p>
            <Button fullWidth onClick={startScanner}>
              Activer la caméra
            </Button>
          </div>
        ) : (
          <div className="w-full h-full relative flex items-center justify-center">
            {/* The div where html5-qrcode injects the video stream */}
            <div id="reader" className="w-full h-full object-cover"></div>
            
            {/* Custom overlay instructions at the bottom */}
            <div className="absolute bottom-10 left-0 right-0 px-6 text-center z-20">
              <div className="inline-block bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-white text-sm font-medium border border-white/10 shadow-2xl">
                Placez le QR code au centre du cadre
              </div>
            </div>

            {/* Error message overlay */}
            {error && (
              <div className="absolute top-1/4 left-6 right-6 bg-tracao-error-light/95 backdrop-blur-md border border-tracao-error/50 p-4 rounded-2xl shadow-2xl z-30 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-tracao-error mb-3">
                  <XIcon size={24} />
                </div>
                <h3 className="font-bold text-tracao-error mb-1">Erreur de lecture</h3>
                <p className="text-sm text-tracao-error/80 mb-4">{error}</p>
                <button 
                  onClick={() => {
                    setError(null);
                    if (!scannerRef.current?.isScanning) startScanner();
                  }}
                  className="w-full py-2.5 bg-tracao-error text-white font-bold rounded-xl"
                >
                  Réessayer
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global CSS override to hide default html5-qrcode UI elements that are ugly */}
      <style dangerouslySetInnerHTML={{__html: `
        #reader { border: none !important; }
        #reader video { object-fit: cover !important; }
        #reader__dashboard_section_csr { display: none !important; }
        #reader__dashboard_section_swaplink { display: none !important; }
      `}} />
    </div>
  );
}
