import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Trash2, 
  ShoppingCart, 
  Calendar, 
  Plus, 
  AlertCircle,
  X 
} from 'lucide-react';

export default function PatientPrescriptions() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    let dbData = [];
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patientId', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
         dbData = data;
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    }
    
    // Merge with LocalStorage fallback records
    try {
      const localData = JSON.parse(localStorage.getItem(`medivault_prescriptions_${user.id}`) || '[]');
      const combined = [...dbData, ...localData];
      combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPrescriptions(combined);
    } catch(e) {
      setPrescriptions(dbData);
    }
    
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    
    // Handle LocalStorage deletes
    if (String(deletingId).startsWith('local-')) {
      try {
        const localData = JSON.parse(localStorage.getItem(`medivault_prescriptions_${user.id}`) || '[]');
        const filtered = localData.filter(p => p.id !== deletingId);
        localStorage.setItem(`medivault_prescriptions_${user.id}`, JSON.stringify(filtered));
        setPrescriptions(prev => prev.filter(p => p.id !== deletingId));
      } catch (e) { console.error('Local delete err', e); }
      setDeletingId(null);
      return;
    }

    // Handle Supabase DB deletes
    try {
      const { error } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', deletingId);
        
      if (!error) {
        setPrescriptions(prev => prev.filter(p => p.id !== deletingId));
      } else {
        console.error(error);
      }
    } catch (err) {
      console.error('Failed to delete', err);
    } finally {
      setDeletingId(null);
    }
  };

  const openDeepLink = (medStr, pharmacy) => {
    // medStr might look like "Dolo 650 (1-0-1)"
    let query = medStr;
    const match = medStr.match(/(.*?)\s*\(/);
    if (match && match[1]) {
      query = match[1].trim();
    }
    
    query = encodeURIComponent(query);
    if (pharmacy === 'pharmeasy') {
      window.open(`https://pharmeasy.in/search/all?searchtext=${query}`, '_blank');
    } else if (pharmacy === 'apollo') {
      window.open(`https://www.apollopharmacy.in/search-medicines/${query}`, '_blank');
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Unknown Date';
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(isoString));
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin text-secondary-foreground">
          <FileText size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-secondary-foreground">Prescription History</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium mt-1">View your past prescriptions and quickly reorder medicines.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/patient/order-medicine')}
          className="bg-secondary hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} /> New Scan
        </button>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mb-6">
            <FileText size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-3">No Prescriptions Yet</h3>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium max-w-md mb-8 leading-relaxed">
            You haven't uploaded any prescriptions yet. Use the Smart Pharmacy module to scan your prescriptions and unlock instant reordering.
          </p>
          <button 
            onClick={() => navigate('/dashboard/patient/order-medicine')}
            className="bg-secondary text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-900 transition-all hover:-translate-y-1 flex items-center gap-2"
          >
            <Plus size={20} /> Upload Your First Prescription
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {prescriptions.map((record) => (
            <div key={record.id} className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              
              {/* Card Header: Image & Date */}
              <div className="p-4 flex items-center gap-4 border-b border-slate-50 bg-slate-50 dark:bg-[#121212]/50 relative group">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                  {record.imageUrl ? (
                    <img src={record.imageUrl} alt="Prescription snippet" className="w-full h-full object-cover opacity-90" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <FileText size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Calendar size={16} className="text-slate-400 dark:text-slate-500" /> 
                    {formatDate(record.created_at)}
                  </h3>
                  <span className="inline-block mt-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {record.status || 'Verified'}
                  </span>
                </div>
                
                <button 
                  onClick={() => setDeletingId(record.id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-white dark:bg-[#1e1e1e] transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Record"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Medicines List */}
              <div className="p-5 flex-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Extracted Medicines</p>
                <div className="space-y-4">
                  {Array.isArray(record.medicines) && record.medicines.map((med, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-[#121212] border border-slate-100 dark:border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{med}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => openDeepLink(med, 'pharmeasy')}
                          className="w-8 h-8 rounded-full bg-[#10847e] text-white flex items-center justify-center hover:bg-[#0c6b66] transition-colors"
                          title="Order via PharmEasy"
                        >
                          P
                        </button>
                        <button 
                          onClick={() => openDeepLink(med, 'apollo')}
                          className="w-8 h-8 rounded-full bg-[#f47f20] text-white flex items-center justify-center hover:bg-[#d86b15] transition-colors"
                          title="Order via Apollo"
                        >
                          A
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {(!record.medicines || record.medicines.length === 0) && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 italic">No medicines specifically logged.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setDeletingId(null)}
          />
          <div className="relative bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setDeletingId(null)}
              className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:text-slate-500 p-2"
            >
              <X size={20} />
            </button>
            
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <AlertCircle size={32} />
            </div>
            
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 text-center mb-2">Delete Record?</h2>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-center text-sm mb-8">
              This will permanently remove this prescription and its medical data from your vault. This action cannot be undone.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5"
              >
                Yes, Delete It
              </button>
              <button 
                onClick={() => setDeletingId(null)}
                className="w-full py-3.5 text-slate-500 dark:text-slate-400 dark:text-slate-500 font-bold hover:text-slate-800 dark:text-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
