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
  Plus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PatientSearch from '../components/doctor/PatientSearch';
import AppointmentCalendar from '../components/doctor/AppointmentCalendar';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const doctorData = location.state || {
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
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 cursor-pointer" onClick={() => navigate('/')}>
            <Stethoscope size={28} />
            <span className="text-xl font-bold text-white tracking-wide">Medivault</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Main Menu</p>
          
          <button 
            onClick={() => { setActiveTab('patients'); setIsBooking(false); }}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'patients' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <Users size={20} />
              <span className="font-medium">Patient Records</span>
            </div>
            {activeTab === 'patients' && <ChevronRight size={16} />}
          </button>

          <button 
            onClick={() => { setActiveTab('appointments'); setIsBooking(false); }}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'appointments' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <Calendar size={20} />
              <span className="font-medium">Appointments</span>
            </div>
            {activeTab === 'appointments' && <ChevronRight size={16} />}
          </button>

          <button 
            onClick={() => { setActiveTab('prescriptions'); setIsBooking(false); }}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'prescriptions' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <FileText size={20} />
              <span className="font-medium">Prescriptions</span>
            </div>
            {activeTab === 'prescriptions' && <ChevronRight size={16} />}
          </button>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all mt-2"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {activeTab === 'patients' && 'Patient Records Library'}
              {activeTab === 'appointments' && "Today's Appointments"}
              {activeTab === 'prescriptions' && 'Manage Prescriptions'}
            </h1>
            <p className="text-sm text-slate-500">Welcome back, {doctorData.name}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/20 transition-all w-64"
              />
            </div>

            <button className="relative p-2 text-slate-400 hover:text-slate-800 transition-colors">
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border border-emerald-200">
                {initials}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-800">{doctorData.name}</p>
                <p className="text-xs text-slate-500">{doctorData.specialization}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 pointer-events-none -z-10"></div>
          
          {activeTab === 'patients' && <PatientSearch />}
          
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
        </div>

      </main>

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
