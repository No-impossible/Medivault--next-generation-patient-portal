import React, { useState } from 'react';
import PatientLogin from './pages/PatientLogin';
import PatientSignUp from './pages/PatientSignUp';
import { 
  Heart, 
  ShieldCheck, 
  Video,
  Pill, 
  User,
  Lock,
  Menu,
  Stethoscope,
  FolderOpen
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');

  // Slow smooth scroll with custom duration (1200ms)
  const scrollToEntry = (e) => {
    e.preventDefault();
    const target = document.getElementById('entry-section');
    if (!target) return;
    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + window.scrollY - 20; // small offset so section fits fully
    const distance = targetY - startY;
    const duration = 1200; // ms — adjust for slower/faster
    let startTime = null;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (currentView === 'patientLogin') {
    return (
      <PatientLogin
        onBack={() => setCurrentView('landing')}
        onSignUp={() => setCurrentView('patientSignUp')}
      />
    );
  }

  if (currentView === 'patientSignUp') {
    return (
      <PatientSignUp
        onBack={() => setCurrentView('landing')}
        onLogin={() => setCurrentView('patientLogin')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* 1. Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="text-[#1E40AF]">
                <Heart fill="currentColor" size={28} />
              </div>
              <span className="text-2xl font-bold text-slate-800">
                MediVault
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              <a href="#about" className="text-sm font-medium text-slate-600 hover:text-[#1E40AF] transition-colors">About</a>
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-[#1E40AF] transition-colors">Features</a>
              <a href="#security" className="text-sm font-medium text-slate-600 hover:text-[#1E40AF] transition-colors">Security</a>
              
              <div className="flex items-center space-x-4 ml-4">
                <button 
                  onClick={scrollToEntry}
                  className="bg-[#1E40AF] hover:bg-blue-900 text-white px-6 py-2.5 rounded-md text-sm font-medium shadow-sm transition-all"
                >
                  Login
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button className="text-slate-600 hover:text-slate-900">
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section (The Hook) */}
      <section id="about" className="relative overflow-hidden bg-white pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-5xl font-black tracking-tight text-slate-800 mb-6 leading-tight">
                Your Complete Medical History, <span className="text-[#1E40AF]">Secured Digitally.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                The central vault for your medical reports, connecting you instantly to doctors and pharmacies using national standards like ABHA.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={scrollToEntry} 
                  className="flex items-center justify-center bg-[#1E40AF] hover:bg-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Learn How It Works
                </button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="lg:ml-auto w-full max-w-lg">
              <img 
                src="/hero_illustration.png" 
                alt="Doctor with patient looking at digital clipboard" 
                className="w-full h-auto rounded-3xl object-cover mix-blend-multiply drop-shadow-2xl" 
                style={{ filter: 'drop-shadow(0 10px 15px rgba(30, 64, 175, 0.2))' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. "How MediVault Helps You" Section (Features) */}
      <section id="features" className="py-24 bg-slate-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">How MediVault Helps You</h2>
            <div className="w-20 h-1 bg-[#14B8A6] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#1E40AF]/20 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-50 text-[#1E40AF] rounded-xl flex items-center justify-center mb-6">
                <FolderOpen size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Secure Digital Wallet</h3>
              <p className="text-slate-600 leading-relaxed">
                Upload PDFs or photos of old reports. Our AI organizes them for instant access.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#14B8A6]/20 transition-all duration-300">
              <div className="w-16 h-16 bg-teal-50 text-[#14B8A6] rounded-xl flex items-center justify-center mb-6">
                <Video size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Online Consultations</h3>
              <p className="text-slate-600 leading-relaxed">
                Connect with verified doctors anywhere, anytime, using secure video calls.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#1E40AF]/20 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-50 text-[#1E40AF] rounded-xl flex items-center justify-center mb-6">
                <Pill size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Smart Pharmacy Ordering</h3>
              <p className="text-slate-600 leading-relaxed">
                Get digital prescriptions fulfilled directly via PharmEasy or Apollo with deep-linking technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dual-Entry Portal Section (The Core of Phase 1) */}
      <section id="entry-section" className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Access Your Dashboard</h2>
            <div className="w-20 h-1 bg-[#1E40AF] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Card A (Patient) */}
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 text-[#1E40AF] rounded-full flex items-center justify-center mb-8">
                <User size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-6">For Patients</h3>
              <ul className="text-slate-600 mb-10 space-y-4 text-[17px]">
                <li className="flex items-center justify-center gap-2">
                  <Lock size={18} className="text-[#1E40AF]" /> View Medical Records
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Lock size={18} className="text-[#1E40AF]" /> Order Medicines
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Lock size={18} className="text-[#1E40AF]" /> Book Tele-Consults
                </li>
              </ul>
              <button onClick={() => setCurrentView('patientLogin')} className="w-full mt-auto bg-[#1E40AF] hover:bg-blue-900 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-md transition-all">
                Patient Login / Sign Up
              </button>
            </div>

            {/* Card B (Doctor) */}
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-teal-50 text-[#14B8A6] rounded-full flex items-center justify-center mb-8">
                <Stethoscope size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-6">For Healthcare Providers</h3>
              <ul className="text-slate-600 mb-10 space-y-4 text-[17px]">
                <li className="flex items-center justify-center gap-2">
                  <Lock size={18} className="text-[#14B8A6]" /> View Patient History (Consent-Based)
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Lock size={18} className="text-[#14B8A6]" /> Write Digital Prescriptions
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Lock size={18} className="text-[#14B8A6]" /> Schedule Appointments
                </li>
              </ul>
              <button className="w-full mt-auto bg-[#14B8A6] hover:bg-teal-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-md transition-all">
                Doctor Login / Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Security Footer (Crucial for Medical Sites) */}
      <div id="security" className="bg-slate-900 py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-emerald-400 font-semibold flex flex-col sm:flex-row items-center justify-center gap-4 text-sm md:text-base">
          <span className="flex items-center gap-2 justify-center">
            <Lock size={18} />
            AES-256 Encrypted
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/50"></span>
          <span className="flex items-center gap-2 justify-center">
            <ShieldCheck size={18} />
            ABHA (ABDM) Integration Sandbox Ready
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/50"></span>
          <span className="flex items-center gap-2 justify-center">
            <FolderOpen size={18} />
            HIPAA Compliant Architecture
          </span>
        </div>
      </div>

      {/* 6. Final Footer */}
      <footer className="bg-slate-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2 text-white">
              <Heart fill="currentColor" size={24} className="text-[#14B8A6]" />
              <span className="text-xl font-bold">MediVault</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-400 font-medium">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="text-center md:text-left border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} MediVault Inc. All rights reserved.
            </p>
            <p className="text-slate-500 text-sm">
              Designed for Secure Health Management
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
