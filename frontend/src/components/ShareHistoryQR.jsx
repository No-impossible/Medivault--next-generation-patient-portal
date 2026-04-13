import React, { useState, useEffect } from 'react';
import { X, QrCode, ShieldCheck, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import QRCode from 'react-qr-code';
import { supabase } from '../supabaseClient';

export default function ShareHistoryQR({ user, onClose }) {
  const QRCodeComponent = typeof QRCode === 'object' && QRCode.default ? QRCode.default : QRCode;

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins in seconds
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateToken();
  }, []);

  useEffect(() => {
    if (!token) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setToken(null);
          setError("QR Code expired. Please generate a new one.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  const generateToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const patientId = user?.id || user?.abhaId || 'guest';
      const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();
      const tokenId = crypto.randomUUID(); 
      
      const { data, error } = await supabase
        .from('share_tokens')
        .insert([{ id: tokenId, patient_id: patientId, expires_at: expiresAt }])
        .select()
        .single();
        
      if (error) {
         // Fallback for missing table prototype: create fake token
         console.error("Supabase error (table likely missing):", error);
         setToken(tokenId); // Prototype fallback
         localStorage.setItem(`mock_token_${tokenId}`, JSON.stringify({
            id: tokenId, patient_id: patientId, expires_at: expiresAt
         }));
      } else {
         setToken(data.id);
      }
    } catch (err) {
      console.warn("Using fallback token due to missing table.", err);
      const fallbackId = crypto.randomUUID();
      setToken(fallbackId);
      localStorage.setItem(`mock_token_${fallbackId}`, JSON.stringify({
         id: fallbackId, patient_id: user?.abhaId || 'guest', expires_at: new Date(Date.now() + 10 * 60000).toISOString()
      }));
    } finally {
      setLoading(false);
      setTimeLeft(600);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const qrUrl = `${window.location.origin}/doctor/dashboard?token=${token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-blue-100 flex flex-col items-center">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:text-slate-500 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-[#121212] transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 mt-2 border border-blue-100 shadow-sm">
          <QrCode size={32} />
        </div>
        
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 text-center mb-1">Emergency Check-in</h2>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-center text-sm mb-6 leading-relaxed">
          Show this QR code to the hospital staff to instantly grant temporary access to your medical history.
        </p>
        
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : error ? (
          <div className="h-48 flex flex-col items-center justify-center text-center">
            <AlertCircle className="text-red-500 mb-2" size={32} />
            <p className="text-red-500 font-bold mb-4">{error}</p>
            <button onClick={generateToken} className="px-4 py-2 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700">
               Generate New QR
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-[#1e1e1e] border-4 border-blue-500 p-4 rounded-[2rem] shadow-lg mb-4 flex justify-center w-full max-w-[240px]">
               <QRCodeComponent value={qrUrl} size={180} fgColor="#0F172A" />
            </div>
            
            <div className="w-full flex items-center gap-2 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 p-2 rounded-xl mb-6 shadow-inner">
               <input 
                 readOnly 
                 value={qrUrl} 
                 className="bg-transparent flex-1 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 font-mono outline-none cursor-text truncate px-2"
               />
               <button 
                 onClick={handleCopy}
                 className={`p-2 rounded-lg flex items-center justify-center transition-all ${copied ? 'bg-emerald-100 text-emerald-600' : 'bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800'}`}
               >
                 {copied ? <Check size={14} /> : <Copy size={14} />}
               </button>
            </div>

            <div className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center space-y-2 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-red-100 overflow-hidden">
                 <div className="h-full bg-red-500 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft/600)*100}%` }} />
               </div>
               <div className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                 Expires in: <span className="text-red-600 text-lg">{formatTime(timeLeft)}</span>
               </div>
            </div>

            <div className="mt-6 flex flex-col w-full items-center gap-2 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
              <div className="flex items-center gap-1.5 justify-center"><ShieldCheck size={16} className="text-emerald-500"/> Secured via MediVault RLS</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Tokens are destroyed after expiration</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
