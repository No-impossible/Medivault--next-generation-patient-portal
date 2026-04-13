import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Lock, 
  Globe, 
  CreditCard, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check,
  HeartPulse,
  Phone,
  X
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { updatePatient } from '../supabaseClient';

const Toggle = ({ enabled, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
  >
    <div className={`absolute top-1 left-1 w-4 h-4 bg-white dark:bg-[#1e1e1e] rounded-full transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export default function PatientSettings({ user }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(`medivault_settings_${user?.id || 'guest'}`);
      return saved ? JSON.parse(saved).notifications : { email: true, sms: false, app: true };
    } catch {
      return { email: true, sms: false, app: true };
    }
  });

  const { setUser } = useOutletContext();
  const [showContactModal, setShowContactModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) return alert('Name and Phone are required.');
    
    const updatedContacts = [...(user?.emergencyContacts || []), newContact];
    const updatedUser = { ...user, emergencyContacts: updatedContacts };
    
    // Attempt DB Update if abhaid is linked
    if (user?.isAbhaLinked && user?.abhaId) {
       await updatePatient(user.abhaId, { emergencyContacts: updatedContacts });
    }
    
    // Update local context/session
    setUser(updatedUser);
    localStorage.setItem('medivault_patient_session', JSON.stringify(updatedUser));
    
    setShowContactModal(false);
    setNewContact({ name: '', relation: '', phone: '' });
  };

  const handleSave = () => {
    localStorage.setItem(`medivault_settings_${user?.id || 'guest'}`, JSON.stringify({ notifications }));
    alert('Preferences saved successfully!');
  };

  const isAbhaLinked = !!user?.isAbhaLinked;
  const abhaId = user?.abhaId || 'Not Linked';


  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm mt-1">Manage your account, privacy, and health vault settings.</p>
      </div>

      {/* Account Section */}
      <section id="account" className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <User size={20} className="text-indigo-500" />
            Account Information
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-black">
              {user?.name?.[0] || 'P'}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user?.name || 'Patient'}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 italic">Patient Profile</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
              <div className="p-3 bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-100">
                {user?.name || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Date of Birth</label>
              <div className="p-3 bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-100">
                {user?.dob || 'Oct 24, 1995'}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
              <div className="p-3 bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-100">
                {user?.email || 'test@example.com'}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Mobile</label>
              <div className="p-3 bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-100">
                {user?.mobile || '+91 98765 43210'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABHA Wallet Section */}
      <section className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4 max-w-md">
            <div className="w-12 h-12 bg-white dark:bg-[#1e1e1e]/10 backdrop-blur-md rounded-xl flex items-center justify-center">
              <ShieldCheck size={24} className="text-indigo-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">ABHA Health ID</h2>
              <p className="text-indigo-200 text-sm leading-relaxed">
                {isAbhaLinked 
                  ? 'Your MediVault account is securely linked to the ABDM ecosystem.' 
                  : 'Link your Ayushman Bharat Health Account to securely sync and store your medical records.'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col justify-center gap-3">
            <div className={`px-4 py-3 rounded-2xl flex items-center gap-3 ${isAbhaLinked ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white dark:bg-[#1e1e1e]/10 border border-white/20'}`}>
              <div className={`w-2 h-2 rounded-full ${isAbhaLinked ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-sm font-bold">{isAbhaLinked ? 'ABHA Connected' : 'Connection Pending'}</span>
            </div>
            {isAbhaLinked && (
              <div className="text-center font-mono text-indigo-200 text-sm tracking-widest">
                {abhaId}
              </div>
            )}
            {!isAbhaLinked && (
              <button onClick={() => alert('Please contact MediVault support to link an ABHA ID after registration.')} className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all">
                Connect ABHA ID
              </button>
            )}
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
      </section>

      {/* Emergency Contacts Section */}
      <section className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-red-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-red-50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <HeartPulse size={20} className="text-red-500" />
            Emergency Contacts
          </h2>
          <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider">Linked to SOS</span>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 leading-relaxed mb-4">
            These contacts will be instantly notified with your medical profile and location when you trigger the <strong>dashboard SOS button</strong>.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {user?.emergencyContacts?.length > 0 ? (
              user.emergencyContacts.map((contact, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-[#121212] border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group hover:border-red-200 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${idx === 0 ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'} rounded-full flex items-center justify-center`}>
                      {idx === 0 ? <User size={18} /> : <Phone size={18} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{contact.name} ({contact.relation})</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{contact.phone}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 italic col-span-2">No emergency contacts configured.</p>
            )}
          </div>
          <button onClick={() => setShowContactModal(true)} className="text-sm font-bold text-red-600 hover:text-red-700 mt-2 px-1">+ Add New Contact</button>
        </div>
      </section>

      {/* Preferences Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Bell size={20} className="text-indigo-500" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Notifications</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Reports and consultation reminders</p>
              </div>
              <Toggle enabled={notifications.email} onClick={() => setNotifications({...notifications, email: !notifications.email})} />
            </div>
            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">SMS Alerts</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">OTP and security updates</p>
              </div>
              <Toggle enabled={notifications.sms} onClick={() => setNotifications({...notifications, sms: !notifications.sms})} />
            </div>
            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">App Push</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Instant updates on reports</p>
              </div>
              <Toggle enabled={notifications.app} onClick={() => setNotifications({...notifications, app: !notifications.app})} />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Lock size={20} className="text-indigo-500" />
            Security & Privacy
          </h3>
          <div className="space-y-2">
            <button onClick={() => alert('2FA Setup requires email verification. Link sent.')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-[#121212] transition-colors group">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Two-Factor Authentication</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">On</span>
                <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button onClick={() => alert('FaceID/TouchID prompt initiated (simulated).')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-[#121212] transition-colors group">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Biometric Login</span>
              <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => alert('Opening data sharing center...')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-[#121212] transition-colors group">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Data Sharing Permissions</span>
              <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-[#121212] transition-all">
          Cancel Changes
        </button>
        <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all">
          Save Settings
        </button>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowContactModal(false)} />
          <div className="relative bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <button onClick={() => setShowContactModal(false)} className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:text-slate-500 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-[#121212]">
              <X size={24} />
            </button>
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-6">Add Emergency Contact</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input type="text" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm" placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Relation</label>
                <input type="text" value={newContact.relation} onChange={e => setNewContact({...newContact, relation: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm" placeholder="e.g. Sister" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input type="tel" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm" placeholder="e.g. +91 9876543210" />
              </div>
              <button onClick={handleAddContact} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl mt-4 transition-colors">
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
