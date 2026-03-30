import React, { useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, UploadCloud, File, Calendar, Trash2, ShieldCheck, Activity, BrainCircuit } from 'lucide-react';

export default function PatientRecords() {
  const { records, setRecords, setFullBodyReport } = useOutletContext();
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate creating a record entry
    const newRecord = {
      id: Date.now().toString(),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      date: new Date().toLocaleString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      }),
      type: file.type || 'Document'
    };

    setRecords(prev => [newRecord, ...prev]);
    
    // Simulate AI extraction if the file name contains 'checkup' or 'report'
    if (file.name.toLowerCase().includes('checkup') || file.name.toLowerCase().includes('report') || file.name.toLowerCase().includes('blood')) {
      // Create a mock full body extraction
      setTimeout(() => {
        setFullBodyReport({
          date: new Date().toISOString().split('T')[0],
          score: 84, // 0-100
          metrics: {
            bmi: { value: 24.2, status: 'Normal', benchmark: '18.5 - 24.9' },
            bloodPressure: { value: '125/82', status: 'Borderline', benchmark: '120/80 mmHg' },
            fastingSugar: { value: 92, status: 'Optimal', benchmark: '<100 mg/dL' },
            cholesterol: { value: 185, status: 'Optimal', benchmark: '<200 mg/dL' },
            hemoglobin: { value: 14.5, status: 'Normal', benchmark: '13.8 - 17.2 g/dL' }
          }
        });
        alert('MediVault AI instantly analyzed your Full Body Checkup! Your Health Score is now updated.');
      }, 1500);
    }
    
    // reset input
    e.target.value = null;
  };

  const deleteRecord = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Medical Records</h1>
          <p className="text-slate-500 text-sm mt-1">All your health documents secured with AES-256 encryption.</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
        >
          <UploadCloud size={20} />
          Upload Document
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept=".pdf,.png,.jpg,.jpeg"
        />
      </div>

      {records.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
            <FileText size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Your vault is empty</h3>
          <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
            Securely upload your prescriptions, lab reports, and imaging here. 
            <br/><br/>
            <span className="text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full text-xs">
              💡 Tip: Upload a file named "Checkup.pdf" to auto-generate your Health Score!
            </span>
          </p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-700 font-bold bg-white border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 px-8 py-3 rounded-xl transition-all"
          >
            Browse Files
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map(record => (
            <div key={record.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                  <File size={24} />
                </div>
                <button 
                  onClick={() => deleteRecord(record.id)}
                  className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <h4 className="font-bold text-slate-800 truncate mb-1" title={record.name}>{record.name}</h4>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500"/> Secured</span>
                <span>{record.size}</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex items-center text-xs text-slate-400 gap-1.5">
                <Calendar size={14} />
                {record.date}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
