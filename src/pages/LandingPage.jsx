import React from 'react';
import { useNavigate } from 'react-router-dom';
import CinematicThemeSwitcher from '../components/ui/cinematic-theme-switcher';
import { 
  Heart, 
  ShieldCheck, 
  Video,
  Pill, 
  User,
  Lock,
  Menu,
  Stethoscope,
  FolderOpen,
  Globe
} from 'lucide-react';

export default function LandingPage({ t, i18n, scrollToEntry, onPatientLogin }) {
  const navigate = useNavigate();
  const [portalRole, setPortalRole] = React.useState('patient');
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500">
      
      {/* 1. Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="text-[#1E40AF] dark:text-[#7C83FD]">
                <Heart fill="currentColor" size={28} />
              </div>
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                MediVault
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1E40AF] dark:hover:text-[#7C83FD] transition-colors">{t('nav_about')}</a>
              <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1E40AF] dark:hover:text-[#7C83FD] transition-colors">{t('nav_features')}</a>
              <a href="#security" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1E40AF] dark:hover:text-[#7C83FD] transition-colors">{t('nav_security')}</a>
              <a href="#contact" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1E40AF] dark:hover:text-[#7C83FD] transition-colors">{t('nav_contact')}</a>
              
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-100 dark:border-gray-800">
                <div className="scale-50 origin-center -mx-4">
                  <CinematicThemeSwitcher />
                </div>
                
                {/* Language Switcher */}
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-[#1E40AF] dark:text-[#7C83FD]" />
                  <select 
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    value={i18n.language}
                    className="bg-transparent text-sm font-medium text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer hover:text-[#1E40AF] dark:hover:text-[#7C83FD] transition-colors"
                  >
                    <option value="en" className="dark:bg-slate-800">English</option>
                    <option value="hi" className="dark:bg-slate-800">हिंदी</option>
                    <option value="mr" className="dark:bg-slate-800">मराठी</option>
                    <option value="ta" className="dark:bg-slate-800">தமிழ்</option>
                  </select>
                </div>

                <button 
                  onClick={scrollToEntry}
                  className="bg-[#1E40AF] dark:bg-[#7C83FD] hover:bg-blue-900 dark:hover:bg-indigo-600 text-white px-6 py-2.5 rounded-md text-sm font-medium shadow-sm transition-all"
                >
                  {t('nav_login')}
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
      <section id="home" className="relative overflow-hidden bg-white dark:bg-[#121212] pt-20 pb-16 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-5xl font-black tracking-tight text-slate-800 dark:text-slate-100 mb-6 leading-tight">
                {t('hero_title')}<span className="text-[#1E40AF] dark:text-[#7C83FD]">{t('hero_title_highlight')}</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                {t('hero_subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={scrollToEntry} 
                  className="flex items-center justify-center bg-[#1E40AF] dark:bg-[#7C83FD] hover:bg-blue-900 dark:hover:bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition-all hover:-translate-y-0.5"
                >
                  {t('hero_cta')}
                </button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="lg:ml-auto w-full max-w-lg">
              <img 
                src="/hero_illustration.png" 
                alt="Doctor with patient looking at digital clipboard" 
                className="w-full h-auto rounded-3xl object-cover mix-blend-multiply dark:mix-blend-normal drop-shadow-2xl" 
                style={{ filter: 'drop-shadow(0 10px 15px rgba(30, 64, 175, 0.2))' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white dark:bg-[#121212] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">About MediVault</h2>
              <div className="w-20 h-1 bg-[#1E40AF] dark:bg-[#7C83FD] mb-8 rounded-full"></div>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                MediVault is a comprehensive digital health platform designed to bridge the gap between patients, healthcare providers, and pharmacies. We believe that accessing and managing your medical history should be secure, intuitive, and universally accessible.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Our mission is to empower individuals with complete control over their health data while providing doctors with the insights they need to deliver better care. From securely storing medical records to facilitating online consultations and seamless pharmacy ordering, MediVault is your trusted partner in health management.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-slate-800 p-8 rounded-2xl text-center">
                <ShieldCheck size={40} className="text-[#1E40AF] dark:text-[#7C83FD] mx-auto mb-4" />
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Secure Storage</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Military-grade encryption for all your medical records.</p>
              </div>
              <div className="bg-teal-50 dark:bg-slate-800 p-8 rounded-2xl text-center mt-8">
                <Heart size={40} className="text-[#14B8A6] dark:text-teal-400 mx-auto mb-4" />
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Better Care</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Instant access to medical history enables precise diagnoses.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "How MediVault Helps You" Section (Features) */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-[#1a1a1a] border-y border-gray-100 dark:border-gray-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">{t('feat_title')}</h2>
            <div className="w-20 h-1 bg-[#14B8A6] dark:bg-teal-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-[#1E40AF]/20 dark:hover:border-[#7C83FD]/50 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700 text-[#1E40AF] dark:text-[#7C83FD] rounded-xl flex items-center justify-center mb-6">
                <FolderOpen size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('feat_1_title')}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('feat_1_desc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-[#14B8A6]/20 dark:hover:border-[#14B8A6]/50 transition-all duration-300">
              <div className="w-16 h-16 bg-teal-50 dark:bg-slate-700 text-[#14B8A6] dark:text-teal-400 rounded-xl flex items-center justify-center mb-6">
                <Video size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('feat_2_title')}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('feat_2_desc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-[#1E40AF]/20 dark:hover:border-[#7C83FD]/50 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700 text-[#1E40AF] dark:text-[#7C83FD] rounded-xl flex items-center justify-center mb-6">
                <Pill size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('feat_3_title')}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('feat_3_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dual-Entry Portal Section */}
      <section id="entry-section" className="py-24 bg-gray-50 dark:bg-[#121212] flex justify-center items-center transition-colors duration-500">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">{t('dash_title')}</h2>
            <div className="w-20 h-1 bg-[#1E40AF] dark:bg-[#7C83FD] mx-auto rounded-full"></div>
          </div>
          
          <div className="bg-white dark:bg-[#1e1e1e] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-gray-100 dark:border-gray-800 min-h-[600px] transition-colors duration-500">
            {/* ───── LEFT PANEL (from Patient Login UI) ───── */}
            <div
              className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden px-12 py-16"
              style={{ background: 'linear-gradient(135deg, #c7ccff 0%, #eef0ff 60%, #dce0ff 100%)' }}
            >
              <div className="w-72 h-72 mb-8 rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 25px 60px rgba(124,131,253,0.35)' }}>
                <img
                  src="/login_illustration.png"
                  alt="Medical digital vault illustration"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full flex items-center justify-center bg-indigo-100 rounded-3xl hidden">
                  <ShieldCheck size={100} className="text-indigo-400 opacity-60" />
                </div>
              </div>

              <div className="text-center max-w-xs">
                <h2 className="text-3xl font-black text-slate-800 mb-3 leading-snug">
                  Your medical history.<br />
                  <span style={{ color: '#7C83FD' }}>Secured. Always accessible.</span>
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  MediVault keeps all your reports, prescriptions, and health records in one encrypted, government-standard vault.
                </p>
              </div>

              <div className="absolute bottom-8 flex items-center gap-4 text-xs text-indigo-500 font-medium opacity-80">
                <span className="flex items-center gap-1"><ShieldCheck size={13} /> ABHA Ready</span>
                <span>·</span>
                <span>AES-256 Encrypted</span>
                <span>·</span>
                <span>HIPAA Compliant</span>
              </div>
            </div>

            {/* ───── RIGHT PANEL (Toggle & Access) ───── */}
            <div className="w-full lg:w-1/2 p-10 sm:p-16 flex flex-col justify-center relative bg-white dark:bg-[#1e1e1e] transition-colors duration-500">
              <div className="flex justify-center mb-10">
                <div className="bg-gray-50 dark:bg-slate-800 p-1.5 rounded-2xl inline-flex shadow-inner border border-gray-200 dark:border-gray-700 w-full max-w-md">
                  <button
                    onClick={() => setPortalRole('patient')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${portalRole === 'patient' ? 'bg-[#7C83FD] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    Patient
                  </button>
                  <button
                    onClick={() => setPortalRole('doctor')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${portalRole === 'doctor' ? 'bg-[#14B8A6] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    Doctor
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center">
                {portalRole === 'patient' ? (
                  <div className="w-full max-w-md transition-all duration-500 transform translate-y-0 opacity-100">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 text-[#7C83FD] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100 dark:border-indigo-800">
                      <User size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6">{t('dash_patient_title')}</h3>
                    <ul className="text-slate-600 dark:text-slate-300 mb-10 space-y-4 text-[16px] font-medium">
                      <li className="flex items-center justify-center gap-2">
                        <Lock size={18} className="text-[#7C83FD]" /> View Medical Records
                      </li>
                      <li className="flex items-center justify-center gap-2">
                        <Lock size={18} className="text-[#7C83FD]" /> Order Medicines
                      </li>
                      <li className="flex items-center justify-center gap-2">
                        <Lock size={18} className="text-[#7C83FD]" /> Book Tele-Consults
                      </li>
                    </ul>
                    <button onClick={onPatientLogin} className="w-full bg-[#7C83FD] hover:bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:-translate-y-1">
                      {t('dash_patient_btn')}
                    </button>
                  </div>
                ) : (
                  <div className="w-full max-w-md transition-all duration-500 transform translate-y-0 opacity-100">
                    <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/30 text-[#14B8A6] dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-teal-100 dark:border-teal-800">
                      <Stethoscope size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6">{t('dash_doctor_title')}</h3>
                    <ul className="text-slate-600 dark:text-slate-300 mb-10 space-y-4 text-[16px] font-medium">
                      <li className="flex items-center justify-center gap-2">
                        <Lock size={18} className="text-[#14B8A6] dark:text-teal-400" /> View Patient History
                      </li>
                      <li className="flex items-center justify-center gap-2">
                        <Lock size={18} className="text-[#14B8A6] dark:text-teal-400" /> Write Digital Prescriptions
                      </li>
                      <li className="flex items-center justify-center gap-2">
                        <Lock size={18} className="text-[#14B8A6] dark:text-teal-400" /> Schedule Appointments
                      </li>
                    </ul>
                    <button onClick={() => navigate('/auth', { state: { role: 'doctor' }})} className="w-full bg-[#14B8A6] hover:bg-teal-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-teal-200 dark:shadow-none transition-all hover:-translate-y-1">
                      {t('dash_doctor_btn')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-gray-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">Contact Customer Service</h2>
            <div className="w-20 h-1 bg-[#1E40AF] dark:bg-[#7C83FD] mx-auto rounded-full"></div>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-6">We're here to help! Reach out to us for any support, inquiries, or feedback.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Address */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-blue-100 dark:bg-slate-700 text-[#1E40AF] dark:text-[#7C83FD] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Office Address</h3>
              <p className="text-slate-600 dark:text-slate-400">123 HealthTech Avenue,<br/>Silicon Valley, CA 94025<br/>United States</p>
            </div>

            {/* Email */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-teal-100 dark:bg-slate-700 text-[#14B8A6] dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Email Support</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-2">For general queries:</p>
              <a href="mailto:support@medivault.com" className="text-[#1E40AF] dark:text-[#7C83FD] font-medium hover:underline">support@medivault.com</a>
            </div>

            {/* Phone */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-blue-100 dark:bg-slate-700 text-[#1E40AF] dark:text-[#7C83FD] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Phone Support</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-2">Mon-Fri from 8am to 5pm.</p>
              <a href="tel:+18001234567" className="text-[#1E40AF] dark:text-[#7C83FD] font-medium hover:underline">+1 (800) 123-4567</a>
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
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
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
