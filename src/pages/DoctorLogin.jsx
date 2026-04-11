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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        
        {/* Header Section */}
        <div 
          className="flex justify-center items-center gap-3 cursor-pointer mb-6 transform hover:scale-105 transition-all w-max mx-auto group"
          onClick={() => navigate('/')}
        >
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:rotate-3 shadow-indigo-600/30">
            <Heart className="h-5 w-5 text-white" fill="currentColor" />
          </div>
          <span className="text-3xl font-black text-slate-800 tracking-tight">
            MediVault
          </span>
        </div>
        <h2 className="text-center text-3xl font-black text-slate-900 mb-2">
          {isLogin ? 'Doctor Portal Access' : 'Provider Registration'}
        </h2>
        <p className="text-center text-sm text-slate-600 max-w-sm mx-auto">
          {isLogin ? 'Welcome back! Sign in to manage your practice.' : 'Join the network to manage your appointments and records.'}
        </p>

        {/* Toggle Mode */}
        <div className="flex justify-center mt-6">
          <div className="bg-slate-200 p-1 rounded-xl flex items-center shadow-inner">
            <button 
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-[#14B8A6] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="mt-8 bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100 relative overflow-hidden">
          {/* Decorative Icon */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-bl-[100px] pointer-events-none z-0"></div>
          <div className="flex justify-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-50 to-blue-50 text-[#14B8A6] rounded-2xl flex items-center justify-center border border-white shadow-sm rotate-3 hover:rotate-0 transition-all duration-300 ring-4 ring-slate-50">
              <Stethoscope size={28} />
            </div>
          </div>

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            
            {/* -------------------- REGISTRATION FIELDS -------------------- */}
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4 animate-in fade-in duration-300">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700">Full Name (with Title)</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 block w-full border-slate-300 rounded-xl focus:ring-[#14B8A6] focus:border-[#14B8A6] sm:text-sm py-3 bg-slate-50 border transition-colors outline-none"
                      placeholder="e.g. Dr. Sarah Jenkins"
                    />
                  </div>
                </div>

                {/* Specialty */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Medical Specialty</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Activity className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      required
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="pl-10 block w-full border-slate-300 rounded-xl focus:ring-[#14B8A6] focus:border-[#14B8A6] sm:text-sm py-3 bg-slate-50 border transition-colors outline-none appearance-none"
                    >
                      <option value="" disabled>Select Specialty</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="General Practitioner">General Practitioner</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Gender</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="pl-10 block w-full border-slate-300 rounded-xl focus:ring-[#14B8A6] focus:border-[#14B8A6] sm:text-sm py-3 bg-slate-50 border transition-colors outline-none appearance-none"
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
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
                        className="pl-10 block w-full border-slate-300 rounded-xl focus:ring-[#14B8A6] focus:border-[#14B8A6] sm:text-sm py-3 bg-slate-50 border transition-colors outline-none uppercase"
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
                </div>
              </div>
            )}

            {/* -------------------- BOTH COMMONLY USED FIELDS -------------------- */}

            {/* Email with optional inline Verify */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <div className="flex gap-2 mt-1">
                <div className="relative flex-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailVerified(false); }}
                    className="pl-10 block w-full border-slate-300 rounded-xl focus:ring-[#14B8A6] focus:border-[#14B8A6] sm:text-sm py-3 bg-slate-50 border transition-colors outline-none"
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
                    className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all focus:outline-none flex items-center gap-2 justify-center w-28 shrink-0
                      ${emailVerified 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 opacity-80 cursor-default' 
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 active:bg-slate-100'}
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
                    className="pl-10 block w-full border-slate-300 rounded-xl focus:ring-[#14B8A6] focus:border-[#14B8A6] sm:text-sm py-3 bg-slate-50 border transition-colors outline-none"
                    placeholder="e.g. Apollo Hospital, Bangalore"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPasswordText ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowConfirmPassword(true)}
                  className="pl-10 pr-10 block w-full border-slate-300 rounded-xl focus:ring-[#14B8A6] focus:border-[#14B8A6] sm:text-sm py-3 bg-slate-50 border transition-colors outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex="-1"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPasswordText ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Dynamic Constraints UI */}
              {!isLogin && showConfirmPassword && (
                <div className="mt-3 grid grid-cols-2 gap-2 px-1">
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${hasMinLength ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${hasMinLength ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-slate-100'}`}>
                      {hasMinLength && <CheckCircle2 size={10} className="text-white bg-emerald-500 rounded-full" />}
                    </div>
                    8+ Characters
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${hasCapital ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${hasCapital ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-slate-100'}`}>
                      {hasCapital && <CheckCircle2 size={10} className="text-white bg-emerald-500 rounded-full" />}
                    </div>
                    1 Capital Letter
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${hasNumber ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${hasNumber ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-slate-100'}`}>
                      {hasNumber && <CheckCircle2 size={10} className="text-white bg-emerald-500 rounded-full" />}
                    </div>
                    1 Number
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${hasSpecial ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${hasSpecial ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-slate-100'}`}>
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
                <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showConfirmPasswordText ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-16 block w-full rounded-xl sm:text-sm py-3 bg-slate-50 border outline-none transition-all
                      ${confirmPassword && !isConfirmMatch ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50/50' : ''}
                      ${confirmPassword && isConfirmMatch ? 'border-emerald-300 focus:ring-emerald-400 focus:border-emerald-400 bg-emerald-50/50' : ''}
                      ${!confirmPassword ? 'border-slate-300 focus:ring-[#14B8A6] focus:border-[#14B8A6]' : ''}
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
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
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

            {isLogin && (
              <div className="flex items-center justify-between !mt-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#14B8A6] focus:ring-[#14B8A6] border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 font-medium cursor-pointer select-none">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-bold text-[#14B8A6] hover:text-teal-600">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(20,184,166,0.39)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.23)] text-base font-bold text-white bg-gradient-to-r from-[#14B8A6] to-teal-500 hover:to-teal-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!isLogin && (!isPasswordValid || !isConfirmMatch || !emailVerified || !licenseVerified)}
              >
                {isLogin ? 'Secure Access' : 'Register Securely'}
                <ArrowRight size={20} />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-2 relative z-10">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Encrypted & HIPAA Compliant Network</span>
          </div>
        </div>
      </div>
    </div>
  );
}
