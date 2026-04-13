import React from 'react';
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
  Plus
} from 'lucide-react';

export default function PatientRecordView({ patient }) {
  if (!patient) return null;

  return (
    <div className="h-full flex flex-col gap-6 md:flex-row bg-transparent">
      
      {/* Left Column: Demographics & Quick Info */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{patient.name}</h2>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 rounded-lg text-xs font-semibold mt-2 border border-emerald-100">
                <HeartPulse size={14} /> Active ABDM Link
              </div>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
              <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Age / Gender</span>
              <span className="font-medium text-slate-800 dark:text-slate-100">{patient.age} yrs, {patient.gender}</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
              <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Blood Group</span>
              <span className="font-bold text-red-500">{patient.bloodGroup}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 mt-4">
              <Phone size={16} className="text-slate-400 dark:text-slate-500" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500">
              <Mail size={16} className="text-slate-400 dark:text-slate-500" />
              <span>{patient.email}</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500">
              <MapPin size={16} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
              <span>{patient.address}</span>
            </div>
          </div>
        </div>

        {/* Medical Alerts / Conditions */}
        <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-red-800 flex items-center gap-2 mb-4">
            <AlertTriangle size={18} /> Critical Alerts
          </h3>
          
          <div className="mb-4">
            <p className="text-xs font-semibold text-red-700 mb-2">ALLERGIES</p>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map(allergy => (
                <span key={allergy} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">
                  {allergy}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-red-700 mb-2">CHRONIC CONDITIONS</p>
            <div className="flex flex-wrap gap-2">
              {patient.chronicConditions.map(condition => (
                <span key={condition} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium border border-orange-200">
                  {condition}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: History & Actions */}
      <div className="w-full md:w-2/3 flex flex-col gap-6 h-[calc(100vh-200px)] overflow-y-auto pr-2 pb-10 custom-scrollbar">
        
        {/* Actions & Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="bg-emerald-500 p-4 rounded-2xl shadow-sm border border-emerald-600 text-white flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-emerald-600 transition-colors">
            <div className="w-12 h-12 bg-white dark:bg-[#1e1e1e]/20 rounded-full flex items-center justify-center">
              <Plus size={24} />
            </div>
            <span className="text-sm font-medium">New Consult</span>
          </div>
        </div>

        {/* Timeline / Recent Records */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Medical History</h3>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View All</button>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            
            {/* Record 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-100 text-emerald-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 mx-auto">
                <Calendar size={18} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 dark:bg-[#121212] hover:bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-emerald-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100/50 px-2 py-1 rounded-md">12 Nov 2025</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">Apollo Hospital</span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">Cardiology Consult</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 limit-lines-2 mb-3">Routine checkup for Hypertension. BP recorded 135/85. Continued current medications.</p>
                
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                    <FileText size={14} /> View Rx
                  </button>
                </div>
              </div>
            </div>

            {/* Record 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 mx-auto">
                <Activity size={18} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 dark:bg-[#121212] hover:bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-100/50 px-2 py-1 rounded-md">28 Oct 2025</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">Lal PathLabs</span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">Lipid Profile & HbA1c</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-3">HbA1c: 6.8%. LDL: 110 mg/dL.</p>
                
                <div className="flex items-center gap-2">
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-emerald-100 hover:text-emerald-700 transition-colors tooltip" title="Preview Report">
                    <Eye size={16} />
                  </button>
                  <button className="flex items-center text-xs gap-1 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:text-slate-100 font-medium">
                    <Download size={14} /> Download PDF
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
