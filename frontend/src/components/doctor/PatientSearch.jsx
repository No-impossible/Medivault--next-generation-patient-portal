import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, QrCode } from 'lucide-react';
import PatientRecordView from './PatientRecordView';
import { supabase } from '../../supabaseClient';

export default function PatientSearch({ onScanClick, onSavePatient }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');
    setPatientData(null);

    try {
      if (searchQuery.length < 3) {
        setError('Please enter at least 3 characters to search.');
        setIsSearching(false);
        return;
      }

      let data = [];
      let dbError = null;

      // Check if we are using placeholder credentials
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const isPlaceholder = supabaseUrl.includes('placeholder.supabase.co');

      if (!isPlaceholder) {
        try {
          const response = await supabase
            .from('mock_abha_users')
            .select('*')
            .or(`abhaId.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`)
            .limit(1);
          data = response.data;
          dbError = response.error;
        } catch (netErr) {
          console.error('Supabase Network Error:', netErr);
          dbError = netErr;
        }
      }

      // If we got an error or are using placeholders, fallback to mock data
      if (isPlaceholder || dbError || !data || data.length === 0) {
        console.warn('Falling back to local mock patient registry...');
        const query = searchQuery.toLowerCase();
        
        // Import MOCK_PATIENTS from healthService (we can also define a smaller subset here)
        const MOCK_REGISTRY = [
          { abhaId: "91-0000-1111-2222", name: "Rahul Sharma", age: 28, dob: "1996-05-15", gender: "Male", mobile: "9876543210", address: "123 Tech Park, Bangalore", bloodGroup: "O+" },
          { abhaId: "91-1122-3344-5566", name: "Aarav Sharma", age: 52, dob: "1972-03-10", gender: "Male", mobile: "9811223344", address: "42 MG Road, Pune", bloodGroup: "O+" },
          { abhaId: "82-2233-4455-6677", name: "Priya Patel", age: 45, dob: "1979-11-20", gender: "Female", mobile: "9988776655", address: "15 Marine Drive, Mumbai", bloodGroup: "B+" }
        ];

        const found = MOCK_REGISTRY.find(p => 
          p.abhaId.toLowerCase().includes(query) || 
          p.name.toLowerCase().includes(query)
        );

        if (found) {
          data = [found];
          dbError = null;
        }
      }

      if (dbError) throw dbError;

      if (data && data.length > 0) {
        const p = data[0];
        setPatientData({
          id: p.id || p.abhaId,
          abhaId: p.abhaId,
          name: p.name,
          age: p.age || 42,
          gender: p.gender || 'Not specified',
          bloodGroup: p.bloodGroup || 'Not specified',
          phone: p.mobile || 'Not specified',
          email: p.email || 'Not specified',
          address: p.address || 'Not specified',
          allergies: ['None reported'],
          chronicConditions: ['None reported'],
          emergencyContact: {
            name: 'Emergency Contact',
            phone: 'Not provided'
          }
        });
      } else {
        setError('No patient found with the given ABHA ID or Name in the backend database.');
      }
    } catch (err) {
      console.error('Fetch Patient Error:', err);
      setError('A connection error occurred. Please ensure your Supabase configuration is correct in the .env file.');
    } finally {
      setIsSearching(false);
    }

  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">

      {/* Search Header Area Overlay (Hero Section) */}
      {!patientData && (
        <div className="w-full mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
          <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 mb-8" style={{ minHeight: '340px' }}>
            {/* Background Image */}
            <div className="absolute inset-0 bg-slate-900 group">
              <img src="/patient_search_hero.png" className="w-full h-full object-cover opacity-80" alt="Beautiful Medical Background" />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-teal-900/60 to-slate-900/90"></div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-md tracking-tight">Patient Lookup Center</h2>
              <p className="text-emerald-50 max-w-xl text-sm md:text-base font-medium drop-shadow mb-8 leading-relaxed">Securely retrieve and access comprehensive medical histories, verified prescriptions, and health timelines instantly via ABHA network.</p>

              <form onSubmit={handleSearch} className="relative group w-full max-w-2xl px-2">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-emerald-600 group-focus-within:text-emerald-500 transition-colors z-10">
                  <Search size={22} />
                </div>
                <input
                  type="text"
                  className="block w-full pl-14 pr-40 py-5 border-4 border-white/25 rounded-2xl leading-5 bg-white/95 backdrop-blur-md placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/30 sm:text-lg transition-all shadow-2xl text-slate-800 font-medium"
                  placeholder="e.g. 91-2345-6789-1023 or Patient Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-2 right-4 flex items-center z-10">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-4 focus:ring-emerald-300 text-white rounded-xl px-6 py-3 font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
                  >
                    {isSearching ? <Loader2 className="animate-spin" size={20} /> : 'Fetch Records'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <button 
              onClick={onScanClick}
              className="group flex items-center gap-3 bg-white dark:bg-[#1e1e1e] hover:bg-emerald-500 text-emerald-600 hover:text-white px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 shadow-sm hover:shadow-emerald-500/25 border-2 border-emerald-100 hover:border-emerald-500 hover:-translate-y-1"
            >
              <QrCode size={22} className="text-emerald-500 group-hover:text-white transition-colors" />
              <span>Scan a QR to fetch patient details</span>
            </button>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto flex items-start gap-3 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 animate-in slide-in-from-top-2 shadow-sm mb-4">
              <AlertCircle className="shrink-0" size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {!error && (
            <div className="text-center text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 font-semibold">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Consent-based access active via ABDM Global Network
            </div>
          )}
        </div>
      )}

      {/* Patient Data View */}
      {patientData && (
        <div className="flex-1 flex flex-col h-full animate-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in slide-in-from-top-4">
            <button
              onClick={() => setPatientData(null)}
              className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              ← Back to Lookup
            </button>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-bold">
                Lookup Context: <span className="text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">{patientData.abhaId}</span>
              </div>
              {onSavePatient && (
                <button
                  id="search-save-patient-btn"
                  onClick={() => onSavePatient(patientData, 'search-save-patient-btn')}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" /><path d="M7 3v4a1 1 0 0 0 1 1h7" /></svg>
                  Save Profile
                </button>
              )}
            </div>
          </div>

          <PatientRecordView patient={patientData} />
        </div>
      )}
    </div>
  );
}
