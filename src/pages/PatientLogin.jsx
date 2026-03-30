import React, { useState } from 'react';
import { Heart, Eye, EyeOff, ArrowLeft, ShieldCheck, Languages, Globe } from 'lucide-react';

// Google & Facebook icon SVGs (inline)
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.528-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

export default function PatientLogin({ onBack, onSignUp, t, i18n, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login for demonstration
    onLoginSuccess({ 
      name: email.split('@')[0], 
      email: email,
      dob: '1990-01-01',
      mobile: '+91-9876543210',
      isAbhaLinked: false 
    });
  };

  return (
    <div className="h-screen flex overflow-hidden font-sans">

      {/* ───── LEFT PANEL ───── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden px-12 py-12"
        style={{ background: 'linear-gradient(135deg, #c7ccff 0%, #eef0ff 60%, #dce0ff 100%)' }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {t('login_back')}
        </button>

        {/* Logo */}
        <div className="absolute top-7 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Heart fill="#7C83FD" size={22} className="text-indigo-500" />
          <span className="text-xl font-bold text-slate-800">MediVault</span>
        </div>

        {/* Illustration */}
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
          {/* Fallback icon panel */}
          <div className="w-full h-full items-center justify-center bg-indigo-100 rounded-3xl hidden">
            <ShieldCheck size={100} className="text-indigo-400 opacity-60" />
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center max-w-xs">
          <h2 className="text-2xl font-black text-slate-800 mb-3 leading-snug">
            Your medical history.<br />
            <span style={{ color: '#7C83FD' }}>Secured. Always accessible.</span>
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            MediVault keeps all your reports, prescriptions, and health records in one encrypted, government-standard vault.
          </p>
        </div>

        {/* Bottom badges */}
        <div className="absolute bottom-8 flex items-center gap-4 text-xs text-indigo-400 font-medium">
          <span className="flex items-center gap-1"><ShieldCheck size={13} /> ABHA Ready</span>
          <span>·</span>
          <span>AES-256 Encrypted</span>
          <span>·</span>
          <span>HIPAA Compliant</span>
        </div>
      </div>

      {/* ───── RIGHT PANEL ───── */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center px-6 py-12 bg-white relative">
        
        {/* Language Switcher */}
        <div className="absolute top-8 right-8 z-10 flex items-center gap-2">
          <Globe size={18} className="text-indigo-600" />
          <select 
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            value={i18n.language}
            className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer hover:text-indigo-600 transition-colors"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>
        
        {/* Mobile back button */}
        <button
          onClick={onBack}
          className="lg:hidden self-start mb-6 flex items-center gap-2 text-indigo-500 hover:text-indigo-700 text-sm font-medium transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Home
        </button>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1 lg:hidden">
              <Heart fill="#7C83FD" size={20} />
              <span className="text-lg font-bold text-slate-800">MediVault</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">{t('login_welcome')}</h1>
            <p className="text-slate-500 mt-1 text-sm">{t('login_subtitle')}</p>
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-3 text-sm font-medium text-slate-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              <GoogleIcon /> {t('login_google')}
            </button>
            <button className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-3 text-sm font-medium text-slate-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              <FacebookIcon /> {t('login_facebook')}
            </button>
          </div>

          {/* ABHA Login */}
          <div className="bg-indigo-50/50 rounded-2xl p-5 mb-6 border border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className="text-indigo-500" />
              <p className="text-sm font-bold text-slate-800">Login with ABHA Account</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="14-digit ABHA ID"
                className="flex-1 border border-indigo-200 bg-white rounded-xl px-4 py-2.5 text-sm transition-all focus:border-indigo-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onLoginSuccess({ 
                  name: 'Raghu Sharma', 
                  email: 'raghu@sharma.in',
                  dob: '1982-05-14',
                  mobile: '+91-9988776655',
                  isAbhaLinked: true, 
                  abhaId: '1234 5678 9012 34' 
                })}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:translate-y-[-1px] transition-all"
                style={{ background: 'linear-gradient(135deg, #7C83FD, #6366f1)' }}
              >
                Login
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">🧪 Demo: Use any 14 digits</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR USE EMAIL</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('login_email')}</label>
              <input
                id="patient-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
                style={{ focusRingColor: '#7C83FD' }}
                onFocus={(e) => e.target.style.borderColor = '#7C83FD'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">{t('login_password')}</label>
                <button type="button" className="text-xs font-medium" style={{ color: '#7C83FD' }}>
                  {t('login_forgot')}
                </button>
              </div>
              <div className="relative">
                <input
                  id="patient-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 placeholder-gray-400 focus:outline-none transition-all"
                  onFocus={(e) => e.target.style.borderColor = '#7C83FD'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all mt-2"
              style={{ background: 'linear-gradient(135deg, #7C83FD, #6366f1)' }}
            >
              {t('login_submit')}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-6">
            {t('login_new')}{' '}
            <button
              onClick={onSignUp}
              className="font-semibold hover:underline transition-colors"
              style={{ color: '#7C83FD' }}
            >
              {t('login_create')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
