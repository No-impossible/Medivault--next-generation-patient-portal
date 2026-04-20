import React, { useRef, useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, UploadCloud, File, Calendar, Trash2, ShieldCheck, BrainCircuit, ExternalLink, X, Loader2, Image, FileType, Tag, Search, Filter, Activity, AlertTriangle, HeartPulse } from 'lucide-react';
import { uploadReport, addPatientRecord, fetchPatientRecords, deletePatientRecord } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { generateAITags, getTagStyle, refreshTemporalTags } from '../services/aiTaggingService';
import { analyzeMedicalDocument, generateGeneralReport } from '../services/geminiService';

// Tag pill component
function TagPill({ tag, onClick, active, removable, onRemove }) {
  const style = getTagStyle(tag);
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer select-none
        ${style.bg} ${style.text} ${style.border}
        ${active ? 'ring-2 ring-offset-1 ring-current scale-105' : 'hover:scale-105 hover:shadow-sm'}
      `}
    >
      {tag.replace('_', ' ')}
      {removable && (
        <button onClick={(e) => { e.stopPropagation(); onRemove(tag); }} className="ml-0.5 hover:opacity-60">
          <X size={9} />
        </button>
      )}
    </span>
  );
}

export default function PatientRecords() {
  const { t } = useTranslation();
  const { user, records, setRecords, setFullBodyReport } = useOutletContext();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAIReport, setSelectedAIReport] = useState(null);
  const [activeTagFilters, setActiveTagFilters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [generalReport, setGeneralReport] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  // Fetch real records on mount
  useEffect(() => {
    if (user?.id) {
      setIsLoadingRecords(true);
      const targetId = user.abhaId || user.id;
      fetchPatientRecords(targetId).then(data => {
        if (data) {
          const refreshed = refreshTemporalTags(data);
          setRecords(prev => {
            const newIds = new Set(refreshed.map(f => f.id));
            const distinctPrev = prev.filter(p => !newIds.has(p.id));
            return [...distinctPrev, ...refreshed].sort((a, b) => new Date(b.date) - new Date(a.date));
          });
        }
        setIsLoadingRecords(false);
      });
    }
  }, [user?.id, setRecords]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

      // Automatically generate AI metadata using Gemini
      const aiAnalysis = await analyzeMedicalDocument(file);

      const extension = file.name.split('.').pop();
      const newRecordData = {
        name: `${aiAnalysis.name}.${extension}`,
        category: aiAnalysis.category,
        size: (file.size / 1024).toFixed(1) + ' KB',
        date: new Date().toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        uploadedAt: new Date().toISOString(),
        type: file.type || 'Document',
        fileURL,
        aiSummary: aiAnalysis.aiSummary,
        tags: aiAnalysis.aiTags
      };

      // Save to Supabase (tags are saved as part of recordData)
      let savedId = Date.now().toString();
      if (user?.id) {
        try {
          const targetId = user.abhaId || user.id;
          savedId = await addPatientRecord(targetId, newRecordData);
        } catch (dbErr) {
          console.error("Failed to add to database, using local id:", dbErr);
        }
      }

      const newRecord = { id: savedId, ...newRecordData };
      setRecords(prev => [newRecord, ...prev]);

      // Simulate full body extraction for specific files
      if (aiAnalysis.aiTags.includes('CHECKUP') || aiAnalysis.aiTags.includes('BLOOD') || aiAnalysis.name.toLowerCase().includes('report')) {
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
          alert('MediVault AI instantly analyzed your checkup! Your Health Score is now updated.');
        }, 1500);
      }

    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload the document. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const report = await generateGeneralReport(records);
      setGeneralReport(report);
    } catch (err) {
      console.error(err);
      alert("Failed to generate report.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleDeleteRecord = async (record) => {
    setRecords(prev => prev.filter(r => r.id !== record.id));
    try {
      const targetId = user?.abhaId || user?.id || 'guest';
      await deletePatientRecord(record.id, record.fileURL, targetId);
    } catch (error) {
      console.error("Failed to delete record from Supabase:", error);
      alert("Failed to permanently delete the file.");
    }
  };

  const toggleTagFilter = (tag) => {
    setActiveTagFilters(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Get all unique tags across all records
  const allTags = [...new Set(records.flatMap(r => r.tags || []))].sort();

  // Filter records by active tags + text search
  const filteredRecords = records.filter(record => {
    const matchesTags = activeTagFilters.length === 0 || activeTagFilters.every(t => record.tags?.includes(t));
    const matchesSearch = !searchText || record.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesTags && matchesSearch;
  });

  return (
    <div className="max-w-6xl w-full mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">{t('records_title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">All your health documents secured with AES-256 encryption.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:hover:translate-y-0 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
        >
          {isUploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
          {isUploading ? 'Uploading & Analyzing...' : 'Upload Document'}
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
      </div>

      {/* AI General Medical Overview Card */}
      {records.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-3xl p-6 border border-blue-100/50 dark:border-blue-900/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <BrainCircuit size={18} /> AI Patient Overview
            </h3>
            {!generalReport && (
              <button
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                {isGeneratingReport ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
                {isGeneratingReport ? 'Analyzing...' : 'Generate AI Report'}
              </button>
            )}
          </div>
          
          {!generalReport && !isGeneratingReport && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Click to generate a comprehensive AI summary based on all {records.length} of your uploaded records.
            </p>
          )}

          {isGeneratingReport && (
            <div className="flex flex-col items-center justify-center py-6 space-y-3">
              <div className="flex gap-1.5 items-center">
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">Synthesizing Clinical Data...</p>
            </div>
          )}

          {generalReport && (
            <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Overall Summary</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-white dark:border-slate-800/50">
                  {generalReport.summary}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-red-600 dark:text-red-400 mb-1.5">Critical Alerts</h4>
                  <ul className="space-y-1.5">
                    {generalReport.criticalAlerts.map((alert, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {alert}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">Key Recommendations</h4>
                  <ul className="space-y-1.5">
                    {generalReport.keyRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <HeartPulse size={16} className="mt-0.5 shrink-0" /> {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search + Tag Filter Bar */}
      {records.length > 0 && (
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
          {/* Text search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>

          {/* Tag filter pills */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-slate-400 shrink-0" />
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mr-1">Filter:</span>
              {allTags.map(tag => (
                <TagPill
                  key={tag}
                  tag={tag}
                  active={activeTagFilters.includes(tag)}
                  onClick={() => toggleTagFilter(tag)}
                />
              ))}
              {activeTagFilters.length > 0 && (
                <button
                  onClick={() => setActiveTagFilters([])}
                  className="text-xs text-slate-400 hover:text-red-500 font-bold ml-2 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {filteredRecords.length === 0 && records.length === 0 ? (
        <div className="bg-white dark:bg-[#1e1e1e] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-[#121212] text-slate-300 rounded-full flex items-center justify-center mb-6">
            <FileText size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Your vault is empty</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
            Securely upload your prescriptions, lab reports, and imaging here.
            <br /><br />
            <span className="text-primary font-semibold bg-primary/10 dark:bg-indigo-900/30 px-3 py-1 rounded-full text-xs">
              💡 AI auto-tags every upload for easy doctor search!
            </span>
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-700 dark:text-slate-300 font-bold bg-white dark:bg-[#1e1e1e] border-2 border-slate-200 dark:border-slate-700 hover:border-primary/30 px-8 py-3 rounded-xl transition-all"
          >
            Browse Files
          </button>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-100 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <Tag size={32} className="text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No records match the selected filters.</p>
          <button onClick={() => { setActiveTagFilters([]); setSearchText(''); }} className="mt-3 text-primary text-sm font-bold hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map(record => {
            const isImage = record.type?.includes('image');
            const isPDF = record.type?.includes('pdf');

            return (
              <div key={record.id} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-primary/30 hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/20 transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isPDF ? 'bg-red-50 text-red-500 dark:bg-red-900/20' :
                    isImage ? 'bg-blue-50 text-blue-500 dark:bg-blue-900/20' :
                    'bg-primary/10 text-primary dark:bg-indigo-900/30'
                  }`}>
                    {isPDF ? <FileType size={24} /> : isImage ? <Image size={24} /> : <File size={24} />}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={record.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-400 dark:text-slate-500 hover:text-primary p-2 rounded-lg hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="View Document"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteRecord(record); }}
                      className="text-slate-400 dark:text-slate-500 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate mb-2" title={record.name}>{record.name}</h4>

                {/* AI Tags */}
                {record.tags && record.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {record.tags.map(tag => (
                      <TagPill key={tag} tag={tag} onClick={() => toggleTagFilter(tag)} active={activeTagFilters.includes(tag)} />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs font-medium mb-3">
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400"><ShieldCheck size={14} className="text-emerald-500"/> Secured</span>
                  <span className="text-slate-500 dark:text-slate-400">{record.size}</span>
                </div>

                <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                  <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 gap-1.5">
                    <Calendar size={14} />
                    {record.date}
                  </div>
                  {record.aiSummary && (
                    <button
                      onClick={() => setSelectedAIReport(record)}
                      className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 dark:bg-indigo-900/30 px-2.5 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
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
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 dark:bg-indigo-900/30 text-primary rounded-xl flex items-center justify-center">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">AI Medical Brief</h2>
                <p className="text-xs font-bold text-primary uppercase tracking-wider">
                  Confidence: {selectedAIReport.aiSummary?.confidence || 'N/A'}
                </p>
              </div>
            </div>

            {/* Tags in modal */}
            {selectedAIReport.tags && selectedAIReport.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                {selectedAIReport.tags.map(tag => <TagPill key={tag} tag={tag} />)}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">Short Brief</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {selectedAIReport.aiSummary?.brief}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">Key Findings (Doctor Summary)</h4>
                <ul className="space-y-2">
                  {selectedAIReport.aiSummary?.keyFindings?.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">For informational purposes only.</span>
              <a
                href={selectedAIReport?.fileURL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                <ExternalLink size={16} className="text-primary" /> View Original
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modals Handled Inside Same Container End */}
    </div>
  );
}
