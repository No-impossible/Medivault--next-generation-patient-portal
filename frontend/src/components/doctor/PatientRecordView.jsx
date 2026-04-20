import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  AlertTriangle,
  FileText,
  Activity,
  Calendar,
  Download,
  Eye,
  Plus,
  BrainCircuit,
  Search,
  Filter,
  X,
  ExternalLink,
  Tag,
  Loader2,
  Image,
  FileType,
  File
} from 'lucide-react';
import { fetchPatientRecords } from '../../supabaseClient';
import { getTagStyle, refreshTemporalTags } from '../../services/aiTaggingService';

// Tag pill component (consistent with patient UI)
function TagPill({ tag, onClick, active }) {
  const style = getTagStyle(tag);
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all select-none
        ${style.bg} ${style.text} ${style.border}
        ${onClick ? 'cursor-pointer hover:scale-105 hover:shadow-sm' : ''}
        ${active ? 'ring-2 ring-offset-1 ring-current scale-105' : ''}
      `}
    >
      {tag.replace('_', ' ')}
    </span>
  );
}

export default function PatientRecordView({ patient }) {
  const [records, setRecords] = useState([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [activeTagFilters, setActiveTagFilters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (!patient?.id && !patient?.abhaId) return;
    setIsLoadingRecords(true);
    const patientId = patient.id || patient.abhaId;
    fetchPatientRecords(patientId)
      .then(data => {
        const refreshed = refreshTemporalTags(data || []);
        setRecords(refreshed.sort((a, b) => new Date(b.date) - new Date(a.date)));
      })
      .catch(console.error)
      .finally(() => setIsLoadingRecords(false));
  }, [patient?.id, patient?.abhaId]);

  if (!patient) return null;

  const toggleTagFilter = (tag) => {
    setActiveTagFilters(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // All unique tags from all records
  const allTags = [...new Set(records.flatMap(r => r.tags || []))].sort();

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesTags = activeTagFilters.length === 0 || activeTagFilters.every(t => record.tags?.includes(t));
    const matchesSearch = !searchText || record.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesTags && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col gap-6 md:flex-row bg-transparent">

      {/* Left Column: Demographics & Quick Info */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/40 to-transparent rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{patient.name}</h2>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg text-xs font-black mt-2 border border-emerald-200/50 uppercase tracking-tight">
                <HeartPulse size={14} className="text-emerald-500" /> Active ABDM Link
              </div>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 dark:border-gray-800">
              <span className="text-slate-500 dark:text-slate-400">Age / Gender</span>
              <span className="font-medium text-slate-800 dark:text-slate-100">{patient.age} yrs, {patient.gender}</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 dark:border-gray-800">
              <span className="text-slate-500 dark:text-slate-400">Blood Group</span>
              <span className="font-bold text-red-500">{patient.bloodGroup}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mt-4">
              <Phone size={16} className="text-slate-400" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <Mail size={16} className="text-slate-400" />
              <span>{patient.email}</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
              <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <span>{patient.address}</span>
            </div>
          </div>
        </div>

        {/* Medical Alerts / Conditions */}
        <div className="bg-red-50/50 dark:bg-red-900/10 rounded-3xl p-6 border border-red-100 dark:border-red-900/30">
          <h3 className="text-sm font-bold uppercase tracking-wider text-red-800 dark:text-red-300 flex items-center gap-2 mb-4">
            <AlertTriangle size={18} /> Critical Alerts
          </h3>
          <div className="mb-4">
            <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">ALLERGIES</p>
            <div className="flex flex-wrap gap-2">
              {(patient.allergies || ['None reported']).map(allergy => (
                <span key={allergy} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium border border-red-200 dark:border-red-800">
                  {allergy}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">CHRONIC CONDITIONS</p>
            <div className="flex flex-wrap gap-2">
              {(patient.chronicConditions || ['None reported']).map(condition => (
                <span key={condition} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-xs font-medium border border-orange-200 dark:border-orange-800">
                  {condition}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Records with Tag Search */}
      <div className="w-full md:w-2/3 flex flex-col gap-5 h-[calc(100vh-220px)] overflow-y-auto pr-2 pb-10 custom-scrollbar">

        {/* Action Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-emerald-200 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Vitals</span>
          </div>
          <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-emerald-200 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer group">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Write Rx</span>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl shadow-lg text-white flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
              <Plus size={24} />
            </div>
            <span className="text-sm font-bold">New Consult</span>
          </div>
        </div>

        {/* Records Section with Tag-Based Search */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Tag size={18} className="text-primary" /> Patient Records
            </h3>
            <span className="text-xs text-slate-400 font-medium">{records.length} total</span>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Search by filename..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>

          {/* Tag filter pills */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Filter size={13} className="text-slate-400 shrink-0" />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mr-1">Filter by tag:</span>
              {allTags.map(tag => (
                <TagPill
                  key={tag}
                  tag={tag}
                  active={activeTagFilters.includes(tag)}
                  onClick={() => toggleTagFilter(tag)}
                />
              ))}
              {activeTagFilters.length > 0 && (
                <button onClick={() => setActiveTagFilters([])} className="text-[10px] text-red-400 hover:text-red-600 font-bold ml-1 transition-colors">
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Records list */}
          {isLoadingRecords ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              <Loader2 size={24} className="animate-spin mr-2" /> Loading records...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Tag size={28} className="text-slate-300 mb-3" />
              <p className="text-slate-400 text-sm font-medium">
                {records.length === 0 ? 'No records found for this patient.' : 'No records match the selected filters.'}
              </p>
              {activeTagFilters.length > 0 && (
                <button onClick={() => setActiveTagFilters([])} className="mt-2 text-primary text-xs font-bold hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map(record => {
                const isImage = record.type?.includes('image');
                const isPDF = record.type?.includes('pdf');
                return (
                  <div
                    key={record.id}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all group cursor-pointer"
                    onClick={() => setSelectedRecord(selectedRecord?.id === record.id ? null : record)}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isPDF ? 'bg-red-50 text-red-500 dark:bg-red-900/20' :
                      isImage ? 'bg-blue-50 text-blue-500 dark:bg-blue-900/20' :
                      'bg-primary/10 text-primary dark:bg-indigo-900/30'
                    }`}>
                      {isPDF ? <FileType size={20} /> : isImage ? <Image size={20} /> : <File size={20} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{record.name}</h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{record.size}</span>
                      </div>

                      {/* Tags */}
                      {record.tags && record.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {record.tags.map(tag => (
                            <TagPill
                              key={tag}
                              tag={tag}
                              active={activeTagFilters.includes(tag)}
                              onClick={(e) => { e?.stopPropagation?.(); toggleTagFilter(tag); }}
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {record.date}</span>
                      </div>

                      {/* Expanded view: AI brief */}
                      {selectedRecord?.id === record.id && record.aiSummary && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center gap-1.5 mb-2">
                            <BrainCircuit size={14} className="text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-wider">AI Medical Brief</span>
                            <span className="text-[10px] text-slate-400 ml-auto">Confidence: {record.aiSummary.confidence}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">{record.aiSummary.brief}</p>
                          <ul className="space-y-1">
                            {record.aiSummary.keyFindings?.map((finding, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <span className="w-1 h-1 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                                {finding}
                              </li>
                            ))}
                          </ul>
                          <a
                            href={record.fileURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                          >
                            <ExternalLink size={12} /> View Full Document
                          </a>
                        </div>
                      )}
                    </div>

                    {/* View icon */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                        <Eye size={14} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
