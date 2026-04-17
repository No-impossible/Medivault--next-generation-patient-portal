import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, AlertCircle, Loader2, X } from 'lucide-react';

/**
 * QrScanner Component
 * Uses html5-qrcode for robust, cross-browser camera-based scanning.
 * 
 * @param {Function} onScanSuccess - Callback when a QR is successfully decoded
 * @param {Function} onClose - Callback when the scanner should be closed
 */
const QrScanner = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [status, setStatus] = useState('initializing'); // 'initializing' | 'scanning' | 'permission-denied' | 'error' | 'unsupported'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // 1. Initialize the scanner instance
    const html5QrCode = new Html5Qrcode('qr-reader-container');
    setScanner(html5QrCode);

    const startScanner = async () => {
      try {
        // Check for cameras
        const devices = await Html5Qrcode.getCameras();
        
        if (devices && devices.length > 0) {
          // Prefer back camera if available
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear')
          );
          const cameraId = backCamera ? backCamera.id : devices[0].id;

          setStatus('scanning');
          
          await html5QrCode.start(
            cameraId,
            {
              fps: 15, // Scans frames per second
              qrbox: { width: 250, height: 250 }, // Scanning region
            },
            (decodedText) => {
              // On Successful Scan
              console.log("QR Decoded:", decodedText);
              onScanSuccess(decodedText);
              // We typically want to stop and close after success to prevent double-scans
              html5QrCode.stop().then(() => onClose()).catch(e => console.error(e));
            },
            (error) => {
              // This callback is called for every frame where no QR is found.
              // We don't usually want to log or show errors here as it's continuous.
            }
          );
        } else {
          setStatus('unsupported');
          setErrorMessage('No camera devices found on this device.');
        }
      } catch (err) {
        console.error("Scanner startup error:", err);
        if (err.toString().includes("NotAllowedError") || err.toString().includes("Permission denied")) {
          setStatus('permission-denied');
        } else {
          setStatus('error');
          setErrorMessage(err.message || 'Unable to access your camera.');
        }
      }
    };

    startScanner();

    // 2. Cleanup on unmount
    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Error stopping scanner:", err));
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-full max-w-sm aspect-square bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl">
        
        {/* The target container for the video stream */}
        <div id="qr-reader-container" className="w-full h-full"></div>

        {/* Status Overlays */}
        {status === 'initializing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400 z-10">
            <Loader2 className="animate-spin mb-3" size={40} />
            <p className="font-bold text-sm uppercase tracking-widest">Initializing Camera...</p>
          </div>
        )}

        {status === 'permission-denied' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 p-8 text-center z-10">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
              <Camera size={32} />
            </div>
            <h4 className="text-white font-black mb-2">Camera Access Denied</h4>
            <p className="text-slate-400 text-sm mb-6 font-medium">Please enable camera permissions in your browser settings to scan QR codes.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-xl text-xs hover:bg-emerald-600 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {(status === 'error' || status === 'unsupported') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 p-8 text-center z-10">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h4 className="text-white font-black mb-2">Scanner Error</h4>
            <p className="text-slate-400 text-sm mb-6 font-medium">{errorMessage}</p>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs hover:bg-slate-700 transition-all"
            >
              Close
            </button>
          </div>
        )}

        {/* Scanner Guideline Frame (Visible while scanning) */}
        {status === 'scanning' && (
          <div className="absolute inset-0 pointer-events-none border-[40px] border-slate-900/60 z-0">
            <div className="w-full h-full border-2 border-emerald-500/50 rounded-lg relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>
              
              {/* Scanning animation line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-[scan_2s_infinite]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
          {status === 'scanning' ? (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Align QR Code within Frame
            </>
          ) : 'Ready to Scan'}
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(250px); opacity: 0; }
        }
        #qr-reader-container video {
          height: 100% !important;
          width: 100% !important;
          object-fit: cover !important;
        }
      `}</style>
    </div>
  );
};

export default QrScanner;
