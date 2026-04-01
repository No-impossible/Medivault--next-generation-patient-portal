import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, QrCode } from 'lucide-react';
import PatientRecordView from './PatientRecordView';

export default function PatientSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');

  const mockPatient = {
    id: 'PT-98234-88',
    abhaId: '91-2345-6789-1023',
    name: 'Arjun Sharma',
    age: 42,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    email: 'arjun.s@example.com',
    address: '124, Koramangala, Bangalore',
    allergies: ['Penicillin', 'Peanuts'],
    chronicConditions: ['Type 2 Diabetes', 'Hypertension'],
    emergencyContact: {
      name: 'Priya Sharma (Wife)',
      phone: '+91 98765 11223'
    }
  };

  const handleScanQR = () => {
    setIsScanningQR(true);
    setError('');
    // Simulate 2.5s scanning process
    setTimeout(() => {
      setIsScanningQR(false);
      setPatientData(mockPatient);
    }, 2500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');
    setPatientData(null);

    // Mock API call to fetch patient records
    setTimeout(() => {
      setIsSearching(false);
      
      if (searchQuery.length < 3) {
        setError('Please enter at least 3 characters to search.');
        return;
      }

      if (searchQuery.toLowerCase().includes('unknown')) {
        setError('No patient found with the given ABHA ID or Name.');
        return;
      }

      setPatientData(mockPatient);
      
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      {/* Search Header Area */}
      {!patientData && !isScanningQR && (
        <div className="max-w-2xl mx-auto w-full mt-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Patient Lookup</h2>
            <p className="text-slate-600">Enter a Patient Name or ABHA ID to securely fetch their medical records and history.</p>
          </div>

          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-500 group-focus-within:text-emerald-600 transition-colors">
              <Search size={22} />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-32 py-5 border-2 border-emerald-100 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 sm:text-lg transition-all shadow-sm group-hover:shadow-md"
              placeholder="e.g. 91-2345-6789-1023 or Arjun..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-2 right-2 flex items-center">
              <button
                type="submit"
                disabled={isSearching}
                className="bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-300 text-white rounded-xl px-6 py-3 font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSearching ? <Loader2 className="animate-spin" size={20} /> : 'Fetch Records'}
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-center">
            <div className="h-px bg-slate-200 w-full max-w-[60px]"></div>
            <span className="px-4 text-xs font-bold text-slate-400 tracking-wider">OR</span>
            <div className="h-px bg-slate-200 w-full max-w-[60px]"></div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleScanQR}
              className="group flex flex-col items-center justify-center gap-3 w-48 h-40 bg-white border-2 border-dashed border-emerald-300 rounded-3xl text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-100"
            >
              <QrCode size={40} className="text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Scan QR Code</span>
            </button>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 animate-in slide-in-from-top-2">
              <AlertCircle className="shrink-0" size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            Consent-based access via ABDM
          </div>
        </div>
      )}

      {/* QR Scanning UI */}
      {isScanningQR && (
        <div className="max-w-md mx-auto w-full mt-16 p-8 bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center animate-in zoom-in-95 duration-300">
          <style>{`
            @keyframes scan {
              0% { top: 0; }
              50% { top: 100%; }
              100% { top: 0; }
            }
          `}</style>
          <h3 className="text-2xl font-black text-slate-800 mb-8">Scanning Patient QR</h3>
          <div className="relative w-56 h-56 bg-emerald-50/50 border-4 border-emerald-500/30 rounded-3xl flex items-center justify-center overflow-hidden mb-8 shadow-inner shadow-emerald-500/10">
            <QrCode size={96} className="text-emerald-500/30" />
            <div className="absolute left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_3px_rgba(16,185,129,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
            
            {/* Corner Markers */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl"></div>
          </div>
          
          <div className="flex items-center gap-3 text-emerald-600 font-bold mb-6">
            <Loader2 size={20} className="animate-spin" />
            <span>Align QR code within frame...</span>
          </div>

          <button 
            type="button"
            onClick={() => setIsScanningQR(false)}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-semibold transition-all shadow-sm"
          >
            Cancel Scan
          </button>
        </div>
      )}

      {/* Patient Data View */}
      {patientData && (
        <div className="flex-1 flex flex-col h-full animate-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 flex items-center justify-between">
            <button 
              onClick={() => setPatientData(null)}
              className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
            >
              ← Back to Search
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              Current Patient Context: <span className="font-bold text-slate-800">{patientData.abhaId}</span>
            </div>
          </div>
          
          <PatientRecordView patient={patientData} />
        </div>
      )}
    </div>
  );
}
