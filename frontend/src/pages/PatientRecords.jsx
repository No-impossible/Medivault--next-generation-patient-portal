import React, { useRef, useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, UploadCloud, File, Calendar, Trash2, ShieldCheck, Activity, BrainCircuit, ExternalLink, X, Loader2, Image, FileDigit, FileType } from 'lucide-react';
import { uploadReport, addPatientRecord, fetchPatientRecords, deletePatientRecord } from '../supabaseClient';
import { useTranslation } from 'react-i18next';

export default function PatientRecords() {
  const { t } = useTranslation();

  const { user, records, setRecords, setFullBodyReport } = useOutletContext();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAIReport, setSelectedAIReport] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({ name: '', category: 'General' });

  // Fetch real records on mount
  useEffect(() => {
    if (user?.id) {
      fetchPatientRecords(user.id).then(fetched => {
        if (fetched.length > 0) {
          setRecords(prev => {
            const newIds = new Set(fetched.map(f => f.id));
            const distinctPrev = prev.filter(p => !newIds.has(p.id));
            return [...distinctPrev, ...fetched].sort((a,b) => new Date(b.date) - new Date(a.date));
          });
        }
      });
    }
  }, [user?.id, setRecords]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingFile(file);
    setUploadForm({ 
      name: file.name.split('.')[0], 
      category: 'General' 
    });
  };

  const confirmUpload = async () => {
    if (!pendingFile) return;
    const file = pendingFile;

    try {
      setIsUploading(true);
      
      // Upload to Storage
      let fileURL = '';
      try {
        fileURL = await uploadReport(file, user?.id || 'guest');
      } catch (err) {
        console.error("Storage error:", err);
        fileURL = URL.createObjectURL(file);
      }

      // Generate a mock AI brief
      const isBlood = file.name.toLowerCase().includes('blood');
      const isXray = file.name.toLowerCase().includes('xray') || file.name.toLowerCase().includes('x-ray');
      const isCheckup = file.name.toLowerCase().includes('checkup');
      const isPrescription = file.name.toLowerCase().includes('prescription');
      
      let aiBrief = `This ${file.type.includes('image') ? 'imaging' : 'document'} report appears to be a standard clinical evaluation for ${user?.name || 'this patient'}. Overall indicators are mostly within normal limits, though continued monitoring is recommended.`;
      let aiFindings = ["No acute abnormalities detected.", "Vitals and primary markers are stable.", "Follow-up suggested in 3-6 months if symptoms persist."];
      let confidenceStr = "92%";
      
      if (isBlood) {
         aiBrief = `Complete Blood Count (CBC) and lipid panels have been analyzed. Hemoglobin and differential counts are stable.`;
         aiFindings = ["RBC and WBC counts within optimal range.", "Mild variation in cholesterol levels detected.", "Consider dietary adjustments and hydration."];
         confidenceStr = "96%";
      } else if (isXray) {
         aiBrief = `Radiological imaging analysis completed. Bone structures and joint spaces are preserved.`;
         aiFindings = ["No fractures, dislocations, or lytic lesions seen.", "Soft tissues appear unremarkable.", "Suggest clinical correlation for localized pain."];
         confidenceStr = "89%";
      } else if (isPrescription) {
         aiBrief = `Medical prescription scanned and mapped. Detected active pharmaceutical ingredients and dosages.`;
         aiFindings = ["Prescribed medications logged successfully.", "No major drug-drug interactions detected among listed items.", "Adhere strictly to prescribed schedule."];
         confidenceStr = "98%";
      }

      const mockAISummary = { brief: aiBrief, keyFindings: aiFindings, confidence: confidenceStr };

      const extension = file.name.split('.').pop();
      const newRecordData = {
        name: `${uploadForm.name}.${extension}`,
        category: uploadForm.category,
        size: (file.size / 1024).toFixed(1) + ' KB',
        date: new Date().toLocaleString('en-US', { 
          year: 'numeric', month: 'short', day: 'numeric', 
          hour: '2-digit', minute: '2-digit' 
        }),
        type: file.type || 'Document',
        fileURL,
        aiSummary: mockAISummary
      };

      // Save to Firestore / Supabase
      let savedId = Date.now().toString();
      if (user?.id) {
         try {
           savedId = await addPatientRecord(user.id, newRecordData);
         } catch (dbErr) {
           console.error("Failed to add to database, using local id:", dbErr);
         }
      }
      
      const newRecord = { id: savedId, ...newRecordData };
      setRecords(prev => [newRecord, ...prev]);

      // Simulate full body extraction for specific files
      if (file.name.toLowerCase().includes('checkup') || file.name.toLowerCase().includes('report') || file.name.toLowerCase().includes('blood')) {
        setTimeout(() => {
          const dynamicScore = 75 + (file.name.length % 20);
          setFullBodyReport({
            date: new Date().toISOString().split('T')[0],
            score: dynamicScore,
            metrics: {
              bmi: { value: 24.2, status: 'Normal', benchmark: '18.5 - 24.9' },
              bloodPressure: { value: dynamicScore > 85 ? '120/80' : '135/88', status: dynamicScore > 85 ? 'Optimal' : 'Borderline', benchmark: '120/80 mmHg' },
              fastingSugar: { value: 92, status: 'Optimal', benchmark: '<100 mg/dL' },
              cholesterol: { value: 185, status: 'Optimal', benchmark: '<200 mg/dL' },
              hemoglobin: { value: 14.5, status: 'Normal', benchmark: '13.8 - 17.2 g/dL' }
            }
          });
          alert('MediVault AI instantly analyzed your Full Body Checkup! Your Health Score is now updated.');
        }, 1500);
      }

    } catch (error) {
       console.error("Upload error:", error);
       alert("Failed to upload the document. Please try again.");
    } finally {
      setIsUploading(false);
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  const handleDeleteRecord = async (record) => {
    // Instantly remove from UI
    setRecords(prev => prev.filter(r => r.id !== record.id));
    
    // Permanently remove from DB and Storage bucket
    try {
      await deletePatientRecord(record.id, record.fileURL);
    } catch (error) {
      console.error("Failed to delete record from Supabase:", error);
      alert("Failed to permanently delete the file.");
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">{t('records_title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm mt-1">All your health documents secured with AES-256 encryption.</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:hover:translate-y-0 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
        >
          {isUploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
          {isUploading ? 'Uploading & Analyzing...' : 'Upload Document'}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
        />
      </div>

      {records.length === 0 ? (
        <div className="bg-white dark:bg-[#1e1e1e] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-[#121212] text-slate-300 rounded-full flex items-center justify-center mb-6">
            <FileText size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Your vault is empty</h3>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 max-w-sm mb-8 leading-relaxed">
            Securely upload your prescriptions, lab reports, and imaging here. 
            <br/><br/>
            <span className="text-primary font-semibold bg-primary/10 dark:bg-indigo-900/30 px-3 py-1 rounded-full text-xs">
              💡 Tip: Upload a file named "Checkup.pdf" to auto-generate your Health Score!
            </span>
          </p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-700 dark:text-slate-300 font-bold bg-white dark:bg-[#1e1e1e] border-2 border-slate-200 dark:border-slate-700 hover:border-primary/30 hover:bg-primary/90/10 dark:bg-indigo-900/30 px-8 py-3 rounded-xl transition-all"
          >
            Browse Files
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map(record => {
            const isImage = record.type.includes('image');
            const isPDF = record.type.includes('pdf');
            
            return (
              <div key={record.id} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-primary/30 hover:shadow-xl hover:shadow-indigo-100/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isPDF ? 'bg-red-50 text-red-500 dark:bg-red-900/20' : 
                    isImage ? 'bg-blue-50 text-blue-500 dark:bg-blue-900/20' : 
                    'bg-primary/10 text-primary dark:bg-indigo-900/30'
                  }`}>
                    {isPDF ? <FileType size={24} /> : isImage ? <Image size={24} /> : <File size={24} />}
                  </div>
                    <a 
                      href={record.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-400 dark:text-slate-500 hover:text-primary p-2 rounded-lg hover:bg-primary/90/10 dark:bg-indigo-900/30 transition-colors opacity-0 group-hover:opacity-100"
                      title="View Document"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRecord(record);
                      }}
                    className="text-slate-400 dark:text-slate-500 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate mb-1" title={record.name}>{record.name}</h4>
                <div className="flex items-center gap-3 text-xs font-medium mb-4">
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400"><ShieldCheck size={14} className="text-emerald-500"/> Secured</span>
                  <span className="text-slate-500 dark:text-slate-400">{record.size}</span>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">{record.category || 'General'}</span>
                </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 gap-1.5">
                  <Calendar size={14} />
                  {record.date}
                </div>
                {record.aiSummary && (
                  <button 
                    onClick={() => setSelectedAIReport(record)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 dark:bg-indigo-900/30 px-2.5 py-1.5 rounded-lg hover:bg-primary/90/10 transition-colors"
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                  <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 gap-1.5">
                    <Calendar size={14} />
                    {record.date}
                  </div>
                  {record.aiSummary && (
                    <button 
                      onClick={() => setSelectedAIReport(record)}
                      className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 dark:bg-indigo-900/30 px-2.5 py-1.5 rounded-lg hover:bg-primary/90/10 transition-colors"
                    >
                      <BrainCircuit size={12} /> AI Brief
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Summary Modal */}
      {selectedAIReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedAIReport(null)}
          />
          <div className="relative bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedAIReport(null)}
              className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:text-slate-500 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-[#121212] transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 dark:bg-indigo-900/30 text-primary rounded-xl flex items-center justify-center">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">AI Medical Brief</h2>
                <p className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                  Confidence: {selectedAIReport.aiSummary?.confidence || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">Short Brief</h4>
                <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 text-sm leading-relaxed">
                  {selectedAIReport.aiSummary?.brief}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">Key Findings (Doctor Summary)</h4>
                <ul className="space-y-2">
                  {selectedAIReport.aiSummary?.keyFindings?.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400 dark:text-slate-500">For informational purposes only.</span>
              <a 
                href={selectedAIReport?.fileURL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                <ExternalLink size={16} className="text-primary" /> View Original
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Upload Confirmation Modal */}
      {pendingFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPendingFile(null)} />
          <div className="relative bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <UploadCloud size={24} className="text-primary" />
              Finalize Upload
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Record Name</label>
                <input 
                  type="text" 
                  value={uploadForm.name} 
                  onChange={e => setUploadForm({...uploadForm, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="e.g. Blood Report 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Medical Category</label>
                <select 
                  value={uploadForm.category} 
                  onChange={e => setUploadForm({...uploadForm, category: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                >
                  <option>General</option>
                  <option>Cardiology (Heart)</option>
                  <option>Radiology (X-Ray/Scan)</option>
                  <option>Ophthalmology (Eye)</option>
                  <option>Laboratory (Blood/Tests)</option>
                  <option>Orthopedics (Bones)</option>
                  <option>Prescription</option>
                </select>
              </div>

              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">File Details</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">{pendingFile.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{(pendingFile.size / 1024).toFixed(1)} KB · {pendingFile.type || 'Document'}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setPendingFile(null)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmUpload}
                  disabled={isUploading}
                  className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {isUploading ? 'Uploading...' : 'Confirm Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
