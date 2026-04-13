import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Calendar, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  Shield,
  Download,
  MoreVertical,
  X,
  Lock,
  Server,
  Key
} from 'lucide-react';

export default function PatientDashboard({ user }) {
  const navigate = useNavigate();
  const { records, fullBodyReport, consultations } = useOutletContext();
  const userName = user?.name || 'Patient';
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const stats = [
    { label: 'Medical Records', value: records?.length || '0', icon: <FileText size={20} />, color: 'blue', onClick: () => navigate('/dashboard/patient/records') },
    { label: 'Consultations', value: consultations?.length || '0', icon: <Calendar size={20} />, color: 'teal', onClick: () => navigate('/dashboard/patient/consultations') },
    { label: 'Upcoming', value: consultations?.filter(c=>c.status==='upcoming').length || '0', icon: <Clock size={20} />, color: 'indigo', onClick: () => navigate('/dashboard/patient/consultations') },
    { label: 'Health Score', value: fullBodyReport ? fullBodyReport.score : '--', icon: <TrendingUp size={20} />, color: 'emerald', onClick: () => navigate('/dashboard/patient/health-score') },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Welcome, {userName}</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Here's what's happening with your health today.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/patient/records')}
          className="bg-[#1E40AF] hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} />
          Upload New Record
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            onClick={stat.onClick}
            className={`bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all ${stat.onClick ? 'cursor-pointer hover:shadow-md hover:border-indigo-100 hover:-translate-y-1' : 'hover:shadow-md'}`}
          >
            <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {/* Recent Records (Empty State) */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Records</h2>
            {records?.length > 0 && (
              <button 
                onClick={() => navigate('/dashboard/patient/records')}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View All <ChevronRight size={16} />
              </button>
            )}
          </div>
          
          {(!records || records.length === 0) ? (
            <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-[#121212] text-slate-300 rounded-full flex items-center justify-center mb-4">
                <FileText size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">No records found</h3>
              <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm max-w-xs mb-6">
                You haven't uploaded any medical records yet. Your vault is empty.
              </p>
              <button 
                onClick={() => navigate('/dashboard/patient/records')}
                className="text-indigo-600 font-bold text-sm bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 px-6 py-2 rounded-xl transition-all"
              >
                Upload Your First Record
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              {records.slice(0, 3).map((record, idx) => (
                <div key={record.id} className={`p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-[#121212] transition-colors ${idx !== 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate max-w-[200px] sm:max-w-xs">{record.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5 text-left">{record.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg hidden sm:block">{record.size}</span>
                    <button onClick={() => record.fileURL && window.open(record.fileURL, '_blank')} className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 p-2 bg-transparent hover:bg-indigo-50 dark:bg-indigo-900/30 rounded-lg transition-colors"><Download size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Mini-Card */}
        <div className="space-y-6">
          <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <Shield size={24} className="text-indigo-400" />
              <h3 className="font-bold">Vault Security</h3>
              <p className="text-indigo-200 text-xs leading-relaxed">
                Your medical data is protected with 256-bit AES encryption.
              </p>
              <button 
                onClick={() => setShowSecurityModal(true)}
                className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white mt-4 border-b border-white/20 pb-1"
              >
                Learn more
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white dark:bg-[#1e1e1e]/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>

      {/* Security Details Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowSecurityModal(false)}
          />
          <div className="relative bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowSecurityModal(false)}
              className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:text-slate-500 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-[#121212] transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Shield size={32} />
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">Military-Grade Protection</h2>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-8 leading-relaxed">
              We take the privacy and security of your medical data very seriously. Here is how we protect your health records.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">End-to-End Encryption</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">All data is encrypted using AES-256 before it leaves your device. Only you hold the keys to access your medical records.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                  <Server size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">HIPAA Compliant Storage</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Our servers meet and exceed national health data protection standards. Your data is distributed across secure, isolated networks.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                  <Key size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">Zero-Knowledge Architecture</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">We cannot read, scan, or sell your health data. The architecture guarantees that only you and your authorized doctors can see your file contents.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                onClick={() => setShowSecurityModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
