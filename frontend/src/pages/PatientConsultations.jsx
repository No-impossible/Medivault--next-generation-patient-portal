import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, VideoOff, ChevronRight, Activity, CalendarPlus, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PatientConsultations() {
  const { t } = useTranslation();

  const { consultations } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl w-full mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">{t('consultations_title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm mt-1">Manage your upcoming and past medical appointments.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/patient/book-consultation')}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
        >
          <CalendarPlus size={20} />
          {t('consultations_book_new')} Consult
        </button>
      </div>

      {!consultations || consultations.length === 0 ? (
        <div className="bg-white dark:bg-[#1e1e1e] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-primary/10 dark:bg-indigo-900/30 text-indigo-300 rounded-full flex items-center justify-center mb-6">
            <Calendar size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No active consultations</h3>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 max-w-sm mb-8 leading-relaxed">
            You don't have any upcoming or past appointments in your record. Book a specialist to get started.
          </p>
          <button 
            onClick={() => navigate('/dashboard/patient/book-consultation')}
            className="text-slate-700 dark:text-slate-300 font-bold bg-white dark:bg-[#1e1e1e] border-2 border-slate-200 dark:border-slate-700 hover:border-primary/30 hover:bg-primary/10 dark:bg-indigo-900/30 px-8 py-3 rounded-xl transition-all"
          >
            Find a Doctor
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Activity className="text-primary" /> Upcoming Appointments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultations.map(consult => (
              <div key={consult.id} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all">
                
                {/* Status Badge */}
                <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Upcoming
                </div>
                
                <div className="flex items-center gap-4 mb-6 pr-24">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xl font-black text-slate-400 dark:text-slate-500">
                    {consult.doctorName[4]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{consult.doctorName}</h4>
                    <p className="text-primary text-sm font-semibold">{consult.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl p-4 flex items-center gap-3">
                    <Calendar size={20} className="text-slate-400 dark:text-slate-500" />
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Date</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{consult.date}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl p-4 flex items-center gap-3">
                    <Clock size={20} className="text-slate-400 dark:text-slate-500" />
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Time</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{consult.time}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-500">
                     {consult.type === 'Online Video Consult' ? <Video size={16} className="text-blue-500" /> : <Building size={16} className="text-emerald-500" />}
                     {consult.type}
                  </div>
                  <button 
                    onClick={() => alert(`Opening details for ${consult.doctorName}`)}
                    className="text-primary font-bold text-sm bg-primary/10 dark:bg-indigo-900/30 hover:bg-primary/90 hover:text-white px-5 py-2 rounded-xl transition-all flex items-center gap-1 group-hover:shadow-md"
                  >
                    {consult.type === 'Online Video Consult' ? t('consultations_join') : 'View Details'} <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
