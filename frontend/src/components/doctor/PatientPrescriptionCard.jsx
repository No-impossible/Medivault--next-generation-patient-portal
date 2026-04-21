import React, { useState, useEffect } from 'react';
import { User, FileText, Loader2, Calendar, Pill } from 'lucide-react';
import { fetchPatientPrescriptions } from '../../supabaseClient';

export default function PatientPrescriptionCard({ patient }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadPrescriptions = async () => {
      setLoading(true);
      const patientId = patient.id || patient.abhaId;
      try {
        const data = await fetchPatientPrescriptions(patientId, patient.abhaId);
        if (isMounted) {
          setPrescriptions(data || []);
        }
      } catch (err) {
        console.error("Failed to load prescriptions for patient", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadPrescriptions();
    return () => { isMounted = false; };
  }, [patient]);

  const formatDate = (isoString) => {
    if (!isoString) return 'Unknown Date';
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    }).format(new Date(isoString));
  };

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all overflow-hidden flex flex-col">
      {/* Patient Header */}
      <div className="p-5 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-4 bg-slate-50/50 dark:bg-[#121212]">
        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/50">
          <User size={24} />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate text-lg">{patient.name || 'Unknown Patient'}</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{patient.abhaId || 'No ABHA ID'}</p>
        </div>
      </div>

      {/* Prescriptions Content */}
      <div className="p-5 flex-1 bg-white dark:bg-[#1e1e1e] flex flex-col items-center">
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Fetching records...</span>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="py-8 flex flex-col items-center text-center gap-3 w-full">
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#121212] flex items-center justify-center text-slate-300">
              <FileText size={24} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No prescriptions uploaded yet.</p>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {prescriptions.map((record) => (
              <div key={record.id} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-[#121212] flex flex-col gap-3">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-sm">
                    <Calendar size={14} className="text-emerald-500" />
                    {formatDate(record.created_at)}
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {record.status || 'Verified'}
                  </span>
                </div>

                <div className="space-y-2 mt-1">
                  {Array.isArray(record.medicines) && record.medicines.map((med, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white dark:bg-[#1e1e1e] p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                      <Pill size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">{med}</span>
                    </div>
                  ))}
                  
                  {(!record.medicines || record.medicines.length === 0) && (
                    <p className="text-xs text-slate-400 italic">No extractable medicines found.</p>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
