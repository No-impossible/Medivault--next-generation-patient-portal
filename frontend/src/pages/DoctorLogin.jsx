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
        style={{ background: 'linear-gradient(135deg, #a7f3d0 0%, #ecfdf5 60%, #d1fae5 100%)' }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-bold text-sm transition-all bg-white/20 hover:bg-white/40 px-4 py-2 rounded-full backdrop-blur-sm z-20 group"
        >
          <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
          Back to Home
        </button>

        {/* Logo */}
        <div className="absolute top-9 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <Heart className="h-5 w-5 text-primary-foreground animate-pulse" fill="currentColor" />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">MediVault</span>
        </div>

        {/* Interactive 3D Illustration Container */}
        <div className="relative w-80 h-80 mb-10 z-10 transition-all duration-700 ease-out hover:-translate-y-4 hover:scale-[1.02] cursor-pointer"
             onMouseMove={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const x = e.clientX - rect.left - rect.width / 2;
               const y = e.clientY - rect.top - rect.height / 2;
               e.currentTarget.style.transform = `perspective(1000px) rotateY(${x / 10}deg) rotateX(${-y / 10}deg) scale3d(1.05, 1.05, 1.05)`;
               e.currentTarget.style.transition = 'none';
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
               e.currentTarget.style.transition = 'transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
             }}>
          
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-emerald-300 rounded-[2.5rem] opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40"></div>
          
          <div className="absolute inset-0 rounded-[2.5rem] bg-white p-2 shadow-2xl transition-all duration-500 ring-1 ring-white/50" 
               style={{ boxShadow: '0 30px 60px -15px rgba(20, 184, 166, 0.4)' }}>
            <div className="w-full h-full rounded-[2rem] overflow-hidden bg-accent/10 relative group/img">
              <img
                src="/steth_hero.png"
                alt="Premium Medical Stethoscope"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 bg-teal-900/10 group-hover/img:bg-transparent transition-colors duration-500"></div>
              {/* Fallback pattern */}
              <div className="w-full h-full items-center justify-center hidden bg-gradient-to-br from-teal-50 to-emerald-100 relative overflow-hidden">
                <Stethoscope size={120} className="text-accent opacity-80 drop-shadow-lg transition-transform duration-500 hover:scale-110 hover:rotate-6" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_3s_infinite_linear] opacity-30 pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Floating UI Elements */}
          <div className="absolute -right-6 top-10 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white flex items-center gap-3 animate-bounce shadow-teal-500/20" style={{ animationDuration: '3s' }}>
             <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><CheckCircle2 size={16} /></div>
             <div className="text-xs font-bold text-slate-700">Verified</div>
          </div>
          <div className="absolute -left-6 bottom-16 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white flex items-center gap-3 animate-bounce shadow-teal-500/20" style={{ animationDuration: '4s', animationDelay: '1s' }}>
             <div className="bg-blue-100 p-2 rounded-full text-blue-600"><ShieldCheck size={16} /></div>
             <div className="text-xs font-bold text-slate-700">AES-256</div>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center max-w-sm z-10 transition-transform duration-500 group-hover:-translate-y-2">
          <h2 className="text-3xl font-black text-slate-800 mb-4 leading-[1.1]">
            Streamline your practice.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 filter drop-shadow-sm">Empower your care.</span>
          </h2>
          <p className="text-slate-600 font-medium text-sm leading-relaxed px-4">
            Join the most secure provider network. Manage patient records and tele-consultations directly from your encrypted portal.
          </p>
        </div>

        {/* Bottom badges */}
        <div className="absolute bottom-8 flex flex-wrap justify-center items-center gap-6 text-xs text-teal-800 font-bold opacity-80 bg-white/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/40 shadow-sm transition-transform duration-500 hover:scale-105">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-accent" /> Secure Gateway</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span>
          <span className="flex items-center gap-1.5"><Heart size={14} className="text-accent" /> Patient First</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span>
          <span className="flex items-center gap-1.5"><Lock size={14} className="text-accent" /> Zero-Knowledge</span>
        </div>
      </div>

      {/* ───── RIGHT PANEL ───── */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center px-6 py-12 bg-white dark:bg-[#121212] transition-colors duration-500 relative">
        
        {/* Mobile back button */}
        <button
          onClick={() => navigate('/')}
          className="lg:hidden self-start mb-6 flex items-center gap-2 text-accent dark:text-accent hover:text-teal-800 dark:hover:text-teal-300 text-sm font-medium transition-colors group"
        >
          <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
          Home
        </button>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 lg:hidden">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                <Heart className="h-4 w-4 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">MediVault</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white transition-colors">
              {isLogin ? 'Doctor Portal Access' : 'Provider Registration'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1 text-sm transition-colors">
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
                      <User className="h-5 w-5 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 block w-full border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-accent sm:text-sm py-3 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 transition-colors outline-none"
                      placeholder="e.g. Dr. Sarah Jenkins"
                    />
                  </div>
                </div>

                {/* Specialty */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Medical Specialty</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Activity className="h-5 w-5 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500" />
                    </div>
                    <select
                      required
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="pl-10 block w-full border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-accent sm:text-sm py-3 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 transition-colors outline-none appearance-none"
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
                      <Users className="h-5 w-5 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500" />
                    </div>
                    <select
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="pl-10 block w-full border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-accent sm:text-sm py-3 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 transition-colors outline-none appearance-none"
                    >
                      <option value="" disabled className="dark:bg-slate-800">Select</option>
                      <option value="Female" className="dark:bg-slate-800">Female</option>
                      <option value="Male" className="dark:bg-slate-800">Male</option>
                      <option value="Non-binary" className="dark:bg-slate-800">Non-binary</option>
                      <option value="Prefer not to say" className="dark:bg-slate-800">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* License Number (Moved here) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700">Medical License Number</label>
                  <div className="flex gap-2 mt-1">
                    <div className="relative flex-1 rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ShieldCheck className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={licenseNumber}
                        onChange={(e) => { setLicenseNumber(e.target.value); setLicenseVerified(false); }}
                        className="pl-10 block w-full border-slate-300 rounded-xl focus:ring-accent focus:border-accent sm:text-sm py-3 bg-slate-50 border transition-colors outline-none uppercase"
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
                      className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all focus:outline-none flex items-center gap-2 justify-center w-28 shrink-0
                        ${licenseVerified 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 opacity-80 cursor-default' 
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 active:bg-slate-100'}
                        ${isVerifyingLicense ? 'opacity-70 cursor-wait' : ''}
                      `}
                    >
                      {isVerifyingLicense && <Loader2 size={16} className="animate-spin" />}
                      {!isVerifyingLicense && licenseVerified && <span>Verified</span>}
                      {!isVerifyingLicense && !licenseVerified && <span>Verify</span>}
                    </button>

                  </div>

                  <button 
                    type="button" 
                    onClick={handleVerifyLicense}
                    disabled={isVerifyingLicense || licenseVerified || !licenseNumber}
                    className={`px-4 py-3 rounded-xl text-sm font-bold shadow-sm transition-all focus:outline-none flex items-center gap-2 justify-center w-28 shrink-0
                      ${licenseVerified 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 opacity-80 cursor-default' 
                        : 'bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-[#121212] dark:hover:bg-slate-800 active:bg-slate-100 dark:bg-slate-800'}
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

            {/* -------------------- BOTH COMMONLY USED FIELDS -------------------- */}

            {/* Email with optional inline Verify */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="flex gap-2">
                <div className="relative flex-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailVerified(false); }}
                    className="pl-10 block w-full border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-accent sm:text-sm py-3 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 transition-colors outline-none"
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
                        : 'bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-[#121212] dark:hover:bg-slate-800 active:bg-slate-100 dark:bg-slate-800'}
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

            {/* Clinic Location (Moved here) */}
            {!isLogin && (
              <div className="animate-in fade-in duration-300">
                <label className="block text-sm font-semibold text-slate-700">Clinic / Hospital Location</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />

                  </div>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 block w-full border-slate-300 rounded-xl focus:ring-accent focus:border-accent sm:text-sm py-3 bg-slate-50 border transition-colors outline-none"

                    placeholder="e.g. Apollo Hospital, Bangalore"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs font-semibold text-accent hover:text-teal-700 dark:hover:text-accent transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type={showPasswordText ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowConfirmPassword(true)}
                  className="pl-10 pr-10 block w-full border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-accent sm:text-sm py-3 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 transition-colors outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex="-1"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none"
                >
                  {showPasswordText ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Dynamic Constraints UI */}
              {!isLogin && showConfirmPassword && (
                <div className="mt-3 grid grid-cols-2 gap-2 px-1">
                  <div className={`flex items-center gap-1.5 text-[11px] font-bold ${hasMinLength ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500'} transition-colors`}>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${hasMinLength ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700'}`}>
                      {hasMinLength && <CheckCircle2 size={10} className="text-white bg-emerald-500 rounded-full" />}
                    </div>
                    8+ Characters
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] font-bold ${hasCapital ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500'} transition-colors`}>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${hasCapital ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700'}`}>
                      {hasCapital && <CheckCircle2 size={10} className="text-white bg-emerald-500 rounded-full" />}
                    </div>
                    1 Capital Letter
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] font-bold ${hasNumber ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500'} transition-colors`}>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${hasNumber ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700'}`}>
                      {hasNumber && <CheckCircle2 size={10} className="text-white bg-emerald-500 rounded-full" />}
                    </div>
                    1 Number
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] font-bold ${hasSpecial ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500'} transition-colors`}>
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
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type={showConfirmPasswordText ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-16 block w-full rounded-xl border sm:text-sm py-3 transition-colors outline-none text-slate-900 dark:text-slate-100 dark:border-slate-700 dark:bg-[#1a1a1a]
                      ${confirmPassword && !isConfirmMatch ? 'border-red-300 dark:border-red-800 focus:ring-red-400 focus:border-red-400 bg-red-50/50 dark:bg-red-900/20' : ''}
                      ${confirmPassword && isConfirmMatch ? 'border-emerald-300 dark:border-emerald-800 focus:ring-emerald-400 focus:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20/50 dark:bg-emerald-900/20' : ''}
                      ${!confirmPassword ? 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 focus:border-accent bg-white dark:bg-[#1a1a1a]' : ''}
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
                      className="text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none"
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
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-accent/30/50 dark:shadow-none text-base font-bold text-white bg-gradient-to-r from-[hsl(var(--accent))] to-teal-500 hover:to-teal-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
              disabled={!isLogin && (!isPasswordValid || !isConfirmMatch || !emailVerified || !licenseVerified)}
            >
              {isLogin ? 'Secure Access' : 'Register Securely'}
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Footer - Replaced Toggle Buttons */}
          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500">
            {isLogin ? (
              <p>
                New provider?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="font-bold text-accent dark:text-accent hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
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
                  className="font-bold text-accent dark:text-accent hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
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
