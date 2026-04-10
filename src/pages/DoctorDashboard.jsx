import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  Bell, 
  Search,
  LogOut,
  Stethoscope,
  ChevronRight,
  Plus,
  ShieldCheck,
  Clock,
  Loader2,
  QrCode,
  X,
  Save,
  UserCheck
} from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase, fetchPatientRecords } from '../supabaseClient';
import PatientSearch from '../components/doctor/PatientSearch';
import AppointmentCalendar from '../components/doctor/AppointmentCalendar';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const getStoredDoctor = () => {
    try {
       const str = localStorage.getItem('medivault_doctor_session');
       return str ? JSON.parse(str) : null;
    } catch { return null; }
  };

  const doctorData = location.state || getStoredDoctor() || {
    name: 'Dr. Sarah Jenkins',
    email: 'sarah@example.com',
    specialization: 'Cardiologist'
  };

  const getInitials = (name) => {
    if (!name) return 'DR';
    const cleanName = name.replace(/^Dr\.\s*/i, '').trim();
    if (!cleanName) return 'DR';
    const parts = cleanName.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return cleanName.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(doctorData.name);

  const [activeTab, setActiveTab] = useState('patients');
  const [isBooking, setIsBooking] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrInputValue, setQrInputValue] = useState("");
  
  // Public QR Access state
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [qrPatientData, setQrPatientData] = useState(null);
  const [qrRecords, setQrRecords] = useState([]);
  const [qrLoading, setQrLoading] = useState(!!token);
  const [qrError, setQrError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const handleSavePatient = () => {
    if (!qrPatientData) return;
    const existingSaved = JSON.parse(localStorage.getItem(`medivault_saved_${doctorData.email}`) || '[]');
    if (!existingSaved.some(p => p.abhaId === qrPatientData.abhaId)) {
        existingSaved.push({
            name: qrPatientData.name,
            abhaId: qrPatientData.abhaId,
            dob: qrPatientData.dob,
            gender: qrPatientData.gender,
            contact: qrPatientData.phone || qrPatientData.email,
            savedAt: new Date().toISOString()
        });
        localStorage.setItem(`medivault_saved_${doctorData.email}`, JSON.stringify(existingSaved));
    }
    // Simple visual feedback
    const btn = document.getElementById('save-patient-btn');
    if (btn) {
       btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg> Saved!`;
       btn.classList.add('bg-emerald-100', 'text-emerald-700');
       setTimeout(() => {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save w-4 h-4"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg> Save to Practice`;
          btn.classList.remove('bg-emerald-100', 'text-emerald-700');
       }, 3000);
    }
  };

  // Validate Token Hook
  React.useEffect(() => {
    if (!token) return;
    
    let interval;
    const verifyToken = async () => {
      try {
        setQrLoading(true);
        let tokenData;
        const { data, error: tokenError } = await supabase
          .from('share_tokens')
          .select('*')
          .eq('id', token)
          .single();
          
        if (tokenError || !data) {
          // If Supabase rejected the insert due to foreign key constraints, 
          // look for the token in LocalStorage where the Patient UI cached it
          const localFallback = localStorage.getItem(`mock_token_${token}`);
          if (localFallback) {
             tokenData = JSON.parse(localFallback);
          } else {
             throw new Error('This secure link has expired for your protection. Please ask the patient to generate a new QR code.');
          }
        } else {
          tokenData = data;
        }
        
        const expiresAt = new Date(tokenData.expires_at).getTime();
        if (Date.now() > expiresAt) {
          throw new Error('This secure link has expired for your protection. Please ask the patient to generate a new QR code.');
        }

        const patientId = tokenData.patient_id;
        let { data: profileData } = await supabase
          .from('mock_abha_users')
          .select('*')
          .eq('abhaId', patientId)
          .single();

        // Local prototype fallback for rich data when users are signed up via email/guest locally
        if (!profileData) {
            const pSessStr = localStorage.getItem('medivault_patient_session');
            if (pSessStr) {
               const pSess = JSON.parse(pSessStr);
               if (pSess.id === patientId || pSess.email === patientId || pSess.abhaId === patientId || patientId === 'guest') {
                  profileData = pSess;
               }
            }
        }

        const recs = await fetchPatientRecords(patientId);
        
        setQrPatientData(profileData || { abhaId: patientId, name: 'Secure Patient', bloodGroup: 'Not specified' });
        setQrRecords(recs.slice(0, 5));
        
        interval = setInterval(() => {
           const remain = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
           setTimeLeft(remain);
           if (remain <= 0) {
              setQrError('This secure link has expired for your protection. Please ask the patient to generate a new QR code.');
              clearInterval(interval);
           }
        }, 1000);

      } catch (err) {
        setQrError(err.message || 'Access Denied');
      } finally {
        setQrLoading(false);
      }
    };
    
    verifyToken();
    return () => clearInterval(interval);
  }, [token]);
  
  // Load appointments specific to this doctor
  const storageKey = `medivault_appointments_${doctorData.email}`;
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return JSON.parse(saved).map(apt => ({
        ...apt,
        date: new Date(apt.date)
      }));
    }
    // Default empty array for new doctors to manage their own schedules
    return [];
  });

  const handleAddAppointment = (newApt) => {
    const updated = [...appointments, newApt];
    setAppointments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setIsBooking(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar sidebar bg-white dark:bg-slate-900 */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 flex flex-col transition-all duration-300 shadow-2xl z-20 border-r border-slate-800">
        <div className="h-24 flex items-center px-8 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center gap-3 text-emerald-400 cursor-pointer relative z-10 group" onClick={() => navigate('/')}>
            <div className="p-2.5 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-all border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Stethoscope size={28} className="drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-2xl font-black text-white tracking-wide">Medi<span className="text-emerald-400">Vault</span></span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-8 flex flex-col gap-3 px-5 custom-scrollbar">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-3">Practice Management</p>
          
          <button 
            onClick={() => { setActiveTab('patients'); setIsBooking(false); setSearchParams({}); }}
            className={`flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm shadow-sm ${activeTab === 'patients' && !token ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20 border border-emerald-400/30' : 'hover:bg-slate-800 hover:text-white border border-transparent'}`}
          >
            <div className="flex items-center gap-3.5">
              <Users size={20} className={activeTab === 'patients' && !token ? 'text-emerald-100' : 'text-slate-400'} />
              <span>Patient Records</span>
            </div>
            {activeTab === 'patients' && !token && <ChevronRight size={16} className="text-emerald-100" />}
          </button>

          <button 
            onClick={() => { setActiveTab('appointments'); setIsBooking(false); setSearchParams({}); }}
            className={`flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm shadow-sm ${activeTab === 'appointments' && !token ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20 border border-emerald-400/30' : 'hover:bg-slate-800 hover:text-white border border-transparent'}`}
          >
            <div className="flex items-center gap-3.5">
              <Calendar size={20} className={activeTab === 'appointments' && !token ? 'text-emerald-100' : 'text-slate-400'} />
              <span>Appointments</span>
            </div>
            {activeTab === 'appointments' && !token && <ChevronRight size={16} className="text-emerald-100" />}
          </button>

          <button 
            onClick={() => { setActiveTab('prescriptions'); setIsBooking(false); setSearchParams({}); }}
            className={`flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm shadow-sm ${activeTab === 'prescriptions' && !token ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20 border border-emerald-400/30' : 'hover:bg-slate-800 hover:text-white border border-transparent'}`}
          >
            <div className="flex items-center gap-3.5">
              <FileText size={20} className={activeTab === 'prescriptions' && !token ? 'text-emerald-100' : 'text-slate-400'} />
              <span>Prescriptions</span>
            </div>
            {activeTab === 'prescriptions' && !token && <ChevronRight size={16} className="text-emerald-100" />}
          </button>
        </div>

        <div className="p-5 border-t border-slate-800/80 bg-slate-900/50 backdrop-blur-sm">
          <button className="flex items-center gap-3.5 px-5 py-3.5 w-full rounded-2xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white border border-transparent">
            <Settings size={20} />
            <span className="font-bold text-sm">Provider Settings</span>
          </button>
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3.5 px-5 py-3.5 w-full rounded-2xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all mt-2 border border-transparent group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
        
        {/* Top Header */}
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8 sm:px-12 z-10 sticky top-0 shadow-sm">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-800 drop-shadow-sm mb-1">
              {token ? 'Emergency Access View' : (
                activeTab === 'patients' ? 'Patient Vault & Records' :
                activeTab === 'appointments' ? "Today's Clinical Schedule" :
                'Manage Prescriptions'
              )}
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              {doctorData.name} / Provider Access
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <button 
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white px-5 py-2.5 rounded-xl font-black text-sm transition-all duration-300 shadow-sm hover:shadow-emerald-500/25 border border-emerald-100 hover:border-emerald-500 hover:-translate-y-0.5"
            >
              <QrCode size={18} />
              <span className="hidden sm:inline">Scan Patient QR</span>
            </button>

            <div className="relative hidden xl:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Global vault search..." 
                className="pl-12 pr-4 py-2.5 bg-slate-100 hover:bg-slate-200/50 border-transparent rounded-xl text-sm font-semibold focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-400/10 transition-all w-48 xl:w-72 outline-none text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-4 pl-4 sm:pl-8 border-l border-gray-200 h-10 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{doctorData.name}</p>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-0.5">{doctorData.specialization}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-600 font-black text-lg border-2 border-white shadow-md ring-2 ring-emerald-50 group-hover:ring-emerald-200 transition-all">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 relative custom-scrollbar">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-slate-50 pointer-events-none -z-10"></div>
          
          {token ? (
            qrLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
                <p className="font-bold uppercase tracking-widest text-sm">Decrypting Secure Link...</p>
              </div>
            ) : qrError ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 ring-4 ring-red-50 border border-red-100">
                  <ShieldCheck size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Access Denied</h2>
                <p className="text-slate-500 mb-8 leading-relaxed font-medium">{qrError}</p>
                <button 
                  onClick={() => setSearchParams({})} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Temporary Access Banner */}
                <div className="bg-emerald-500 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between shadow-lg shadow-emerald-200 border border-emerald-400 gap-4">
                  <div className="flex items-center gap-2 font-black tracking-wide"><ShieldCheck size={20} /> Temporary Emergency Access</div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      id="save-patient-btn"
                      onClick={handleSavePatient}
                      className="flex items-center justify-center gap-1.5 font-bold bg-white text-emerald-600 px-4 py-1.5 rounded-lg text-sm tracking-wide shadow-sm hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all outline-none"
                    >
                      <Save size={16} /> Save to Practice
                    </button>
                    <div className="flex items-center gap-2 font-bold bg-white/20 px-3 py-1.5 rounded-lg text-sm tracking-widest shadow-inner">
                      <Clock size={16} /> EXPIRES IN: {Math.floor(timeLeft/60).toString().padStart(2,'0')}:{(timeLeft%60).toString().padStart(2,'0')}
                    </div>
                  </div>
                </div>
                
                {/* Profile Header */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
                   <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
                   <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-black shrink-0 relative z-10 shadow-inner border border-emerald-200">{qrPatientData?.name?.[0] || 'P'}</div>
                   <div className="relative z-10 flex-1 w-full">
                     <h2 className="text-3xl font-black text-slate-800 mb-2">{qrPatientData?.name}</h2>
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-6 text-sm font-semibold text-slate-600 mt-4 border-t border-slate-100 pt-5">
                       <div>
                         <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5 flex items-center gap-1">ID / ABHA Number</span>
                         <span className="text-slate-700">{qrPatientData?.abhaId || qrPatientData?.email || 'Identity Masked'}</span>
                       </div>
                       <div>
                         <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5 flex items-center gap-1">Date of Birth / Age</span>
                         <span className="text-slate-700">{qrPatientData?.dob || 'Unknown'} {qrPatientData?.age ? `(${qrPatientData.age}y)` : ''}</span>
                       </div>
                       <div>
                         <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5 flex items-center gap-1">Blood Group</span>
                         <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-md inline-block border border-red-100">{qrPatientData?.bloodGroup || 'Not Typed'}</span>
                       </div>
                       <div>
                         <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5 flex items-center gap-1">Gender</span>
                         <span className="text-slate-700 capitalize">{qrPatientData?.gender || qrPatientData?.sex || 'Not Specified'}</span>
                       </div>
                       <div className="col-span-2">
                         <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5 flex items-center gap-1">Address / Location</span>
                         <span className="text-slate-700">{qrPatientData?.address || qrPatientData?.location || 'Location details restricted from vault'}</span>
                       </div>
                       <div className="col-span-2">
                         <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5 flex items-center gap-1">Contact Information</span>
                         <span className="text-slate-700">{qrPatientData?.mobile || qrPatientData?.phone || qrPatientData?.email || 'Contact details selectively hidden'}</span>
                       </div>
                     </div>
                   </div>
                   {qrPatientData?.emergencyContacts?.length > 0 && (
                     <div className="sm:text-right mt-6 sm:mt-0 relative z-10 w-full sm:w-auto bg-red-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:border-l border-slate-200 sm:pl-8 sm:ml-4 flex flex-col justify-center">
                        <span className="block text-[10px] uppercase font-black text-red-500 tracking-widest mb-1">Emergency SOS Contact</span>
                        <div className="font-bold text-slate-800 text-lg mb-0.5">{qrPatientData.emergencyContacts[0].name}</div>
                        <div className="text-sm font-bold text-slate-600 mb-1">{qrPatientData.emergencyContacts[0].phone}</div>
                        <div className="text-xs font-semibold text-slate-400 capitalize bg-white sm:bg-slate-50 px-2 py-0.5 rounded inline-block w-max sm:ml-auto">{qrPatientData.emergencyContacts[0].relation}</div>
                     </div>
                   )}
                </div>
                
                {/* Records Timeline */}
                <div>
                  <h3 className="font-black text-xl text-slate-800 flex items-center gap-2 mb-6 ml-2"><FileText className="text-emerald-500" /> Recent Medical History</h3>
                  <div className="space-y-4">
                     {qrRecords.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-500 shadow-sm font-medium">No records digitized in patient vault yet.</div>
                     ) : (
                        qrRecords.map(rec => (
                          <div key={rec.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 md:items-center justify-between hover:border-emerald-200 hover:shadow-md transition-all group">
                             <div className="flex items-start md:items-center gap-5">
                                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors"><FileText size={24} /></div>
                                <div>
                                  <h4 className="font-bold text-slate-800 text-base">{rec.name}</h4>
                                  <div className="flex gap-3 text-xs font-semibold text-slate-400 mt-1">
                                    <span>{rec.date}</span>
                                    <span>{rec.size}</span>
                                  </div>
                                  {rec.aiSummary && <p className="text-sm font-medium text-slate-600 mt-2 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">{rec.aiSummary.brief}</p>}
                                </div>
                             </div>
                             <button onClick={() => rec.fileURL && window.open(rec.fileURL, '_blank')} className="bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-100 hover:border-emerald-200 px-5 py-2.5 font-bold rounded-xl transition-all text-sm shrink-0 shadow-sm">
                               View Full Report
                             </button>
                          </div>
                        ))
                     )}
                  </div>
                </div>
              </div>
            )
          ) : (
            <>
              {activeTab === 'patients' && <PatientSearch onScanClick={() => setShowQrModal(true)} />}
          
          {activeTab === 'appointments' && !isBooking && (
            <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-5xl mx-auto w-full pt-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Scheduled Appointments</h2>
                  <p className="text-sm text-slate-500">View and manage your upcoming consultations.</p>
                </div>
                <button 
                  onClick={() => setIsBooking(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm"
                >
                  <Plus size={18} /> New Appointment
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-slate-400">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-500 border-4 border-emerald-100 shadow-sm">
                    <Calendar size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-3">No Appointments Yet</h2>
                  <p className="text-lg font-medium text-slate-500 mb-8 max-w-md text-center">Your schedule is clear. Book a new appointment to get started.</p>
                </div>
              ) : (
                <div className="grid gap-4 custom-scrollbar overflow-y-auto pb-8 pr-2">
                  {appointments.map((apt, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-emerald-200 hover:shadow-md transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl border border-blue-100">
                          {apt.patientName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">{apt.patientName}</h3>
                          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                            Follow-up Consultation
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-bold text-slate-800 flex items-center justify-end gap-1.5">
                            <Calendar size={16} className="text-emerald-500" />
                            {apt.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-sm text-slate-600 font-medium">at {apt.time}</p>
                        </div>
                        <button className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer border border-emerald-100/50">
                          View details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'appointments' && isBooking && (
            <AppointmentCalendar 
              onCancel={() => setIsBooking(false)} 
              onBooked={handleAddAppointment}
            />
          )}

          {activeTab === 'prescriptions' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FileText size={40} className="text-slate-300" />
              </div>
              <p className="text-lg font-medium text-slate-500">Feature in development</p>
            </div>
          )}
            </>
          )}
        </div>

      </main>

      {/* QR Input Modal */}
      {showQrModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 relative">
             <button onClick={() => setShowQrModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors">
               <X size={24} />
             </button>
             <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-50/50">
               <QrCode size={32} />
             </div>
             <h3 className="text-2xl font-black text-center text-slate-800 mb-2">Scan Patient Check-in</h3>
             <p className="text-center text-slate-500 mb-8 font-medium text-sm leading-relaxed px-2">Paste the secure emergency token or complete URL provided by the patient to decrypt their history.</p>
             
             <input 
                type="text" 
                autoFocus
                placeholder="https://medivault.app/share/..." 
                value={qrInputValue}
                onChange={e => setQrInputValue(e.target.value)}
                onKeyDown={e => {
                   if(e.key === 'Enter') {
                       const scanned = qrInputValue;
                       const extToken = scanned.includes('token=') ? scanned.split('token=')[1].split('&')[0] : 
                                       scanned.includes('/share/') ? scanned.split('/share/')[1] : scanned.trim();
                       setSearchParams({ token: extToken });
                       setShowQrModal(false);
                       setQrInputValue('');
                   }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm font-medium"
             />
             
             <button 
                onClick={() => {
                   if (!qrInputValue) return;
                   const scanned = qrInputValue;
                   const extToken = scanned.includes('token=') ? scanned.split('token=')[1].split('&')[0] : 
                                   scanned.includes('/share/') ? scanned.split('/share/')[1] : scanned.trim();
                   setSearchParams({ token: extToken });
                   setShowQrModal(false);
                   setQrInputValue('');
                }}
                className="w-full py-4 px-4 rounded-xl font-black text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 active:scale-95 text-base"
             >
                Decrypt & View Profile
             </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-red-50/50">
              <LogOut size={32} />
            </div>
            <h3 className="text-2xl font-black text-center text-slate-800 mb-2">Sign Out</h3>
            <p className="text-center text-slate-500 mb-8 font-medium">Are you sure you want to securely log out of your provider dashboard?</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3.5 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                Cancel
              </button>
              <button 
                onClick={() => navigate('/')}
                className="flex-1 py-3.5 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
