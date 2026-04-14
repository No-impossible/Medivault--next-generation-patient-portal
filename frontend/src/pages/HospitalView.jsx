import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, AlertTriangle, FileText, User, HeartPulse, Activity } from 'lucide-react';
import { supabase, fetchPatientRecords } from '../supabaseClient';

export default function HospitalView() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      setLoading(true);
      
      const { data: tokenData, error: tokenError } = await supabase
        .from('share_tokens')
        .select('*')
        .eq('id', token)
        .single();
        
      if (tokenError || !tokenData) {
        throw new Error('Access token is invalid or does not exist.');
      }
      
      const expiresAt = new Date(tokenData.expires_at).getTime();
      if (Date.now() > expiresAt) {
        throw new Error('Access Experimental Expired. Temporary link naturally exceeded its 10-minute limit.');
      }

      // Valid token! Fetch patient details and records
      const patientId = tokenData.patient_id;
      
      // Attempt to get basic profile from mock_abha_users
      const { data: profileData } = await supabase
        .from('mock_abha_users')
        .select('*')
        .eq('abhaId', patientId)
        .single();

      // Fetch from records table using existing fn
      const recs = await fetchPatientRecords(patientId);
      
      setPatientData(profileData || { abhaId: patientId, name: 'Secure Patient' });
      // Keep only 5 most recent records
      setRecords(recs.slice(0, 5));
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Access Expired');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#121212] flex flex-col items-center justify-center p-4">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-sm">Verifying Secure Access Wrapper...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#121212] flex items-center justify-center p-4 font-sans text-slate-800 dark:text-slate-100">
        <div className="max-w-md w-full bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 border border-red-100 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={40} />
          </div>
          <h1 className="text-2xl font-black mb-2 text-slate-900 dark:text-white">Access Expired</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-8 leading-relaxed">
            {error}
          </p>
          <div className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-bold">
            <ShieldCheck size={16} /> MediVault Row Level Security
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121212] pb-12 font-sans text-slate-900 dark:text-white">
      {/* Banner */}
      <div className="bg-blue-600 text-white p-3 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase shadow-md relative z-10">
        <ShieldCheck size={16} /> Temporary Access Provided via MediVault Secure Share
      </div>
      
      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8 animate-in fade-in duration-500">
        
        {/* Patient Header */}
        <section className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl" />
          
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl font-black shrink-0 relative z-10">
            {patientData?.name?.[0] || 'P'}
          </div>
          
          <div className="flex-1 relative z-10">
             <div className="flex items-center gap-3 mb-2">
               <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">{patientData?.name}</h1>
               <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-200">
                 <ShieldCheck size={14} /> Verified ID
               </span>
             </div>
             
             <div className="grid grid-cols-2 md:flex gap-x-8 gap-y-4 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 font-semibold mt-4">
               <div>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Date of Birth</span>
                  {patientData?.dob || 'Not provided'}
               </div>
               <div>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Blood Group</span>
                  <span className="flex items-center gap-1 text-red-600"><Activity size={14}/> {patientData?.bloodGroup || 'O+'}</span>
               </div>
               <div>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Identifier</span>
                  {patientData?.abhaId || 'Restricted'}
               </div>
             </div>
          </div>
        </section>

        {/* Action Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
           <h2 className="text-xl font-bold flex items-center gap-2">
             <FileText className="text-blue-500" />
             Recent Medical History
           </h2>
           <span className="text-slate-400 dark:text-slate-500 text-sm font-bold">Most Recent 5 Records</span>
        </div>
        
        {/* Records */}
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 dark:text-slate-500 shadow-sm">
              <FileText size={48} className="mx-auto mb-4 text-slate-300" />
              Patient has no medical records in their vault.
            </div>
          ) : (
            records.map((record) => (
              <div key={record.id} className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 hover:shadow-md transition-shadow group flex flex-col md:flex-row gap-6 md:items-center">
                <div className="w-12 h-12 bg-primary/10 dark:bg-indigo-900/30 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{record.name}</h3>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-4">
                    <span>{record.date}</span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">{record.size}</span>
                  </div>
                </div>
                
                {record.aiSummary && (
                  <div className="md:w-1/3 bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-2 block">Extracted Summary</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold line-clamp-2">{record.aiSummary.brief}</p>
                  </div>
                )}
                
                <button 
                  onClick={() => record.fileURL && window.open(record.fileURL, '_blank')}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl font-bold text-sm transition-all md:w-auto w-full flex items-center justify-center mt-4 md:mt-0"
                >
                  View Document
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
