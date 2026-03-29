import React, { useState } from 'react';
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
  const userName = user?.name || 'Patient';
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const stats = [
    { label: 'Medical Records', value: '0', icon: <FileText size={20} />, color: 'blue' },
    { label: 'Consultations', value: '0', icon: <Calendar size={20} />, color: 'teal' },
    { label: 'Upcoming', value: '0', icon: <Clock size={20} />, color: 'indigo' },
    { label: 'Health Score', value: '--', icon: <TrendingUp size={20} />, color: 'emerald' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Welcome, {userName}</h1>
          <p className="text-slate-500">Here's what's happening with your health today.</p>
        </div>
        <button className="bg-[#1E40AF] hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 transition-all">
          <Plus size={20} />
          Upload New Record
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {/* Recent Records (Empty State) */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Records</h2>
          </div>
          
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No records found</h3>
            <p className="text-slate-500 text-sm max-w-xs mb-6">
              You haven't uploaded any medical records yet. Your vault is empty.
            </p>
            <button className="text-indigo-600 font-bold text-sm bg-indigo-50 hover:bg-indigo-100 px-6 py-2 rounded-xl transition-all">
              Upload Your First Record
            </button>
          </div>
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
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
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
          <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowSecurityModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Shield size={32} />
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 mb-2">Military-Grade Protection</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We take the privacy and security of your medical data very seriously. Here is how we protect your health records.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">End-to-End Encryption</h4>
                  <p className="text-sm text-slate-500 mt-1">All data is encrypted using AES-256 before it leaves your device. Only you hold the keys to access your medical records.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                  <Server size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">HIPAA Compliant Storage</h4>
                  <p className="text-sm text-slate-500 mt-1">Our servers meet and exceed national health data protection standards. Your data is distributed across secure, isolated networks.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                  <Key size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Zero-Knowledge Architecture</h4>
                  <p className="text-sm text-slate-500 mt-1">We cannot read, scan, or sell your health data. The architecture guarantees that only you and your authorized doctors can see your file contents.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
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

