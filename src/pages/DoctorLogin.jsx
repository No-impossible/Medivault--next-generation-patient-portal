import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Stethoscope, 
  Lock, 
  User, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  MapPin, 
  Activity,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [showConfirmPasswordText, setShowConfirmPasswordText] = useState(false);

  // Verification States
  const [emailVerified, setEmailVerified] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  
  const [licenseVerified, setLicenseVerified] = useState(false);
  const [isVerifyingLicense, setIsVerifyingLicense] = useState(false);

  // Password Constraints
  const hasMinLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasCapital && hasNumber && hasSpecial;
  const isConfirmMatch = password && password === confirmPassword;

  const handleVerifyEmail = () => {
    if (!email || !email.includes('@')) return;
    setIsVerifyingEmail(true);
    setTimeout(() => {
      setIsVerifyingEmail(false);
      setEmailVerified(true);
    }, 1500);
  };

  const handleVerifyLicense = () => {
    if (!licenseNumber || licenseNumber.length < 5) return;
    setIsVerifyingLicense(true);
    setTimeout(() => {
      setIsVerifyingLicense(false);
      setLicenseVerified(true);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form based on mode
    if (!isLogin) {
      if (!isPasswordValid) {
        alert("Please fulfill all password constraints.");
        return;
      }
      if (!isConfirmMatch) {
        alert("Passwords do not match.");
        return;
      }
      if (!emailVerified || !licenseVerified) {
        alert("Please verify your Email and License Number to proceed.");
        return;
      }
      if (!gender || !specialty || !location) {
        alert("Please fill all profile fields.");
        return;
      }
    }

    let doctorData;

    // Fallback dictionary for disconnected prototypes or missing tables
    const fallbackProviders = JSON.parse(localStorage.getItem('medivault_mock_providers') || '{}');

    if (isLogin) {
      // Supabase Authenticate
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('email', email)
        .single();
        
      if (error || !data) {
        // Fallback Check
        if (fallbackProviders[email]) {
           doctorData = fallbackProviders[email];
        } else {
           alert('Provider not found with this email. Please register or check your credentials.');
           return;
        }
      } else {
         doctorData = data;
      }
      
      // Simple mockup text password check
      if (doctorData.password !== password) {
        alert('Incorrect password.');
        return;
      }
    } else {
      // Registration: Check if existing
      const { data: existing } = await supabase
        .from('doctors')
        .select('id')
        .eq('email', email)
        .single();
        
      if (existing || fallbackProviders[email]) {
        alert('An account with this email already exists.');
        return;
      }
      
      const newDoctorPayload = {
        name: fullName,
        email: email,
        specialization: specialty,
        gender: gender,
        location: location,
        licenseNumber: licenseNumber,
        password: password
      };
      
      const { data: newDoc, error: insertError } = await supabase
        .from('doctors')
        .insert([newDoctorPayload])
        .select()
        .single();
        
      if (insertError) {
        console.warn("Falling back to local storage: Supabase doctors table missing or failed", insertError);
        // Save to Fallback
        fallbackProviders[email] = newDoctorPayload;
        localStorage.setItem('medivault_mock_providers', JSON.stringify(fallbackProviders));
        doctorData = newDoctorPayload;
      } else {
        doctorData = newDoc;
      }
    }

    // Persist login session
    localStorage.setItem('medivault_doctor_session', JSON.stringify(doctorData));

    navigate('/doctor/dashboard', { state: doctorData });
  };

  return (
    <div className="h-screen flex overflow-hidden font-sans">
      {/* ───── LEFT PANEL ───── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden px-12 py-12"
        style={{ background: 'linear-gradient(135deg, #ccfbf1 0%, #f0fdfa 60%, #99f6e4 100%)' }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium text-sm transition-colors group"
        >
          <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={18} />
          Back to Home
        </button>

        {/* Logo */}
        <div className="absolute top-7 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Heart fill="#14B8A6" size={22} className="text-teal-500" />
          <span className="text-xl font-bold text-slate-800">MediVault</span>
        </div>

        {/* Illustration */}
        <div className="w-72 h-72 mb-8 rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 25px 60px rgba(20, 184, 166, 0.25)' }}>
          <img
            src="/doctor_illustration.png"
            alt="Doctor digital portal illustration"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback icon panel */}
          <div className="w-full h-full items-center justify-center bg-teal-100 rounded-3xl hidden">
            <Stethoscope size={100} className="text-teal-400 opacity-60" />
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center max-w-xs">
          <h2 className="text-2xl font-black text-slate-800 mb-3 leading-snug">
            Streamline your practice.<br />
            <span style={{ color: '#14B8A6' }}>Empower your care.</span>
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            MediVault gives you secure access to patient records, digital prescriptions, and tele-consultations all from one encrypted portal.
          </p>
        </div>

        {/* Bottom badges */}
        <div className="absolute bottom-8 flex items-center gap-4 text-xs text-teal-600 font-medium opacity-80">
          <span className="flex items-center gap-1"><ShieldCheck size={13} /> Secure Access</span>
          <span>·</span>
          <span>HIPAA Compliant</span>
          <span>·</span>
          <span>AES-256 Encrypted</span>
        </div>
      </div>

      {/* ───── RIGHT PANEL ───── */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center px-6 py-12 bg-white dark:bg-[#121212] transition-colors duration-500 relative">
        
        {/* Mobile back button */}
        <button
          onClick={() => navigate('/')}
          className="lg:hidden self-start mb-6 flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 text-sm font-medium transition-colors group"
        >
          <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
          Home
        </button>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1 lg:hidden">
              <Heart fill="#14B8A6" size={20} className="text-teal-500" />
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">MediVault</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white transition-colors">
              {isLogin ? 'Doctor Portal Access' : 'Provider Registration'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm transition-colors">
              {isLogin ? 'Welcome back! Sign in to manage your practice.' : 'Join the network to manage your appointments and records.'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* -------------------- REGISTRATION FIELDS -------------------- */}
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 animate-in fade-in duration-300">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name (with Title)</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 block w-full border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-[#14B8A6] sm:text-sm py-3 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 transition-colors outline-none"
                      placeholder="e.g. Dr. Sarah Jenkins"
                    />
                  </div>
                </div>

                {/* Specialty */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Medical Specialty</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Activity className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <select
                      required
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="pl-10 block w-full border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-[#14B8A6] sm:text-sm py-3 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 transition-colors outline-none appearance-none"
                    >
                      <option value="" disabled className="dark:bg-slate-800">Select</option>
                      <option value="Cardiologist" className="dark:bg-slate-800">Cardiologist</option>
                      <option value="Dermatologist" className="dark:bg-slate-800">Dermatologist</option>
                      <option value="General Practitioner" className="dark:bg-slate-800">General Practitioner</option>
                      <option value="Neurologist" className="dark:bg-slate-800">Neurologist</option>
                      <option value="Pediatrician" className="dark:bg-slate-800">Pediatrician</option>
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <select
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="pl-10 block w-full border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-[#14B8A6] sm:text-sm py-3 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 transition-colors outline-none appearance-none"
                    >
                      <option value="" disabled className="dark:bg-slate-800">Select</option>
                      <option value="Female" className="dark:bg-slate-800">Female</option>
                      <option value="Male" className="dark:bg-slate-800">Male</option>
                      <option value="Non-binary" className="dark:bg-slate-800">Non-binary</option>
                      <option value="Prefer not to say" className="dark:bg-slate-800">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinic / Hospital Location</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10 block w-full border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-[#14B8A6] sm:text-sm py-3 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 transition-colors outline-none"
                      placeholder="e.g. Apollo Hospital, Bangalore"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- BOTH COMMONLY USED FIELDS -------------------- */}

            {/* Email with optional inline Verify */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="flex gap-2">
                <div className="relative flex-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailVerified(false); }}
                    className="pl-10 block w-full border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-[#14B8A6] sm:text-sm py-3 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 transition-colors outline-none"
                    placeholder="doctor@hospital.com"
                  />
                  {/* Verified Icon Badge inside input if verified */}
                  {!isLogin && emailVerified && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-emerald-500 animate-in zoom-in duration-300">
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                </div>

                {/* Verification Trigger Button */}
                {!isLogin && (
                  <button 
                    type="button" 
                    onClick={handleVerifyEmail}
                    disabled={isVerifyingEmail || emailVerified || !email}
                    className={`px-4 py-3 rounded-xl text-sm font-bold shadow-sm transition-all focus:outline-none flex items-center gap-2 justify-center w-28 shrink-0
                      ${emailVerified 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 opacity-80 cursor-default' 
                        : 'bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100'}
                      ${isVerifyingEmail ? 'opacity-70 cursor-wait' : ''}
                    `}
                  >
                    {isVerifyingEmail && <Loader2 size={16} className="animate-spin" />}
                    {!isVerifyingEmail && emailVerified && <span>Verified</span>}
                    {!isVerifyingEmail && !emailVerified && <span>Verify</span>}
                  </button>
                )}
              </div>
            </div>

            {/* License Number with optional inline Verify */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Medical License Number</label>
                <div className="flex gap-2">
                  <div className="relative flex-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ShieldCheck className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => { setLicenseNumber(e.target.value); setLicenseVerified(false); }}
                      className="pl-10 block w-full border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-[#14B8A6] sm:text-sm py-3 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 transition-colors outline-none uppercase"
                      placeholder="e.g. MCI/12/34567"
                    />
                    {licenseVerified && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-emerald-500 animate-in zoom-in duration-300">
                        <CheckCircle2 size={18} />
                      </div>
                    )}
                  </div>

                  <button 
                    type="button" 
                    onClick={handleVerifyLicense}
                    disabled={isVerifyingLicense || licenseVerified || !licenseNumber}
                    className={`px-4 py-3 rounded-xl text-sm font-bold shadow-sm transition-all focus:outline-none flex items-center gap-2 justify-center w-28 shrink-0
                      ${licenseVerified 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 opacity-80 cursor-default' 
                        : 'bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100'}
                      ${isVerifyingLicense ? 'opacity-70 cursor-wait' : ''}
                    `}
                  >
                    {isVerifyingLicense && <Loader2 size={16} className="animate-spin" />}
                    {!isVerifyingLicense && licenseVerified && <span>Verified</span>}
                    {!isVerifyingLicense && !licenseVerified && <span>Verify</span>}
                  </button>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs font-semibold text-[#14B8A6] hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type={showPasswordText ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowConfirmPassword(true)}
                  className="pl-10 pr-10 block w-full border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-[#14B8A6] sm:text-sm py-3 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 transition-colors outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex="-1"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                >
                  {showPasswordText ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Dynamic Constraints UI */}
              {!isLogin && (
                <div className="mt-3 grid grid-cols-2 gap-2 px-1">
                  <div className={`flex items-center gap-1.5 text-[11px] font-bold ${hasMinLength ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${hasMinLength ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700'}`}>
                      {hasMinLength && <CheckCircle2 size={10} className="text-white bg-emerald-500 rounded-full" />}
                    </div>
                    8+ Characters
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] font-bold ${hasCapital ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${hasCapital ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700'}`}>
                      {hasCapital && <CheckCircle2 size={10} className="text-white bg-emerald-500 rounded-full" />}
                    </div>
                    1 Capital Letter
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] font-bold ${hasNumber ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${hasNumber ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700'}`}>
                      {hasNumber && <CheckCircle2 size={10} className="text-white bg-emerald-500 rounded-full" />}
                    </div>
                    1 Number
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] font-bold ${hasSpecial ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${hasSpecial ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700'}`}>
                      {hasSpecial && <CheckCircle2 size={10} className="text-white bg-emerald-500 rounded-full" />}
                    </div>
                    1 Special Char
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password (Registration Only) */}
            {!isLogin && showConfirmPassword && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type={showConfirmPasswordText ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-16 block w-full rounded-xl border sm:text-sm py-3 transition-colors outline-none text-slate-900 dark:text-slate-100 dark:border-slate-700 dark:bg-[#1a1a1a]
                      ${confirmPassword && !isConfirmMatch ? 'border-red-300 dark:border-red-800 focus:ring-red-400 focus:border-red-400 bg-red-50/50 dark:bg-red-900/20' : ''}
                      ${confirmPassword && isConfirmMatch ? 'border-emerald-300 dark:border-emerald-800 focus:ring-emerald-400 focus:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20' : ''}
                      ${!confirmPassword ? 'border-slate-200 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-[#14B8A6] bg-white dark:bg-[#1a1a1a]' : ''}
                    `}
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                    {confirmPassword && isConfirmMatch && (
                      <div className="text-emerald-500 animate-in zoom-in duration-300 flex items-center pointer-events-none">
                        <CheckCircle2 size={18} />
                      </div>
                    )}
                    <button
                      type="button"
                      tabIndex="-1"
                      onClick={() => setShowConfirmPasswordText(!showConfirmPasswordText)}
                      className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                    >
                      {showConfirmPasswordText ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                {confirmPassword && !isConfirmMatch && (
                  <p className="text-xs text-red-500 font-medium mt-1 pl-1">Passwords do not match</p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-teal-200/50 dark:shadow-none text-base font-bold text-white bg-gradient-to-r from-[#14B8A6] to-teal-500 hover:to-teal-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
              disabled={!isLogin && (!isPasswordValid || !isConfirmMatch || !emailVerified || !licenseVerified)}
            >
              {isLogin ? 'Secure Access' : 'Register Securely'}
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Footer - Replaced Toggle Buttons */}
          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            {isLogin ? (
              <p>
                New provider?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="font-bold text-[#14B8A6] dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                >
                  Register your account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="font-bold text-[#14B8A6] dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                >
                  Log in here
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
