import React, { useState } from 'react';
import { Heart, Eye, EyeOff, ArrowLeft, ShieldCheck, CheckCircle, Loader, Info } from 'lucide-react';

// ── Mock ABHA data: simulates API response ──
const MOCK_ABHA_DATA = {
  '123456789012345': {
    name: 'Raghu Sharma',
    dob: '1990-05-14',
    gender: 'Male',
    bloodGroup: 'B+',
    mobile: '9876543210',
    address: 'Flat 4B, Sunrise Apartments, Pune, Maharashtra – 411001',
  },
  '987654321098765': {
    name: 'Priya Nair',
    dob: '1995-11-02',
    gender: 'Female',
    bloodGroup: 'O+',
    mobile: '9123456780',
    address: '22 MG Road, Bengaluru, Karnataka – 560001',
  },
};

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

// ── A reusable labeled input that shows a ✓ badge when auto-filled ──
function Field({ label, id, type = 'text', value, onChange, placeholder, autoFilled, required, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">{label}</label>
        {autoFilled && (
          <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
            <CheckCircle size={13} /> Auto-filled
          </span>
        )}
      </div>
      {children || (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full border rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-gray-400 focus:outline-none transition-all"
          style={{ borderColor: autoFilled ? '#6ee7b7' : '#e5e7eb', background: autoFilled ? '#f0fdf4' : 'white' }}
          onFocus={(e) => { if (!autoFilled) e.target.style.borderColor = '#7C83FD'; }}
          onBlur={(e) => { if (!autoFilled) e.target.style.borderColor = '#e5e7eb'; }}
        />
      )}
    </div>
  );
}

export default function PatientSignUp({ onBack, onLogin }) {
  // ABHA
  const [abhaId, setAbhaId] = useState('');
  const [abhaFetching, setAbhaFetching] = useState(false);
  const [abhaError, setAbhaError] = useState('');
  const [abhaFetched, setAbhaFetched] = useState(false);

  // Form fields
  const [form, setForm] = useState({
    name: '', dob: '', gender: '', bloodGroup: '', mobile: '', address: '',
    email: '', password: '', confirmPassword: '', emergencyContact: '',
  });
  const [autoFilledFields, setAutoFilledFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // ── ABHA ID fetch (simulated) ──
  const handleAbhaFetch = () => {
    const trimmed = abhaId.replace(/\s|-/g, '');
    if (trimmed.length !== 14 && trimmed.length !== 15) {
      setAbhaError('Please enter a valid 14-digit ABHA ID.');
      return;
    }
    setAbhaError('');
    setAbhaFetching(true);
    setTimeout(() => {
      setAbhaFetching(false);
      const data = MOCK_ABHA_DATA[trimmed];
      if (data) {
        setForm((prev) => ({ ...prev, ...data }));
        setAutoFilledFields({ name: true, dob: true, gender: true, bloodGroup: true, mobile: true, address: true });
        setAbhaFetched(true);
        setAbhaError('');
      } else {
        setAbhaError('No ABHA record found for this ID. Please fill details manually.');
        setAbhaFetched(false);
      }
    }, 1800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    alert('Account creation will be connected to the backend. Details collected successfully!');
  };

  return (
    <div className="min-h-screen flex font-sans">

      {/* ───── LEFT PANEL ───── */}
      <div
        className="hidden lg:flex lg:w-[42%] flex-col items-center justify-center relative overflow-hidden px-10 py-12"
        style={{ background: 'linear-gradient(135deg, #c7ccff 0%, #eef0ff 60%, #dce0ff 100%)' }}
      >
        <button
          onClick={onBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="absolute top-7 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Heart fill="#7C83FD" size={22} className="text-indigo-500" />
          <span className="text-xl font-bold text-slate-800">MediVault</span>
        </div>

        <div className="w-64 h-64 mb-8 rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 25px 60px rgba(124,131,253,0.35)' }}>
          <img
            src="/login_illustration.png"
            alt="Medical digital vault"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        <div className="text-center max-w-xs">
          <h2 className="text-2xl font-black text-slate-800 mb-3 leading-snug">
            Begin your health<br />
            <span style={{ color: '#7C83FD' }}>digital journey.</span>
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Use your ABHA ID to instantly populate your profile, or fill in your details manually.
          </p>
        </div>

        {/* ABHA info blurb on left panel */}
        <div className="mt-8 bg-white/60 backdrop-blur rounded-2xl p-5 text-xs text-slate-600 max-w-xs border border-white/80">
          <p className="font-bold text-indigo-600 mb-1 flex items-center gap-1"><Info size={13}/> What is ABHA?</p>
          <p>ABHA (Ayushman Bharat Health Account) is your 14-digit government health ID under India's Ayushman Bharat Digital Mission. It securely links all your medical records across providers.</p>
        </div>

        <div className="absolute bottom-8 flex items-center gap-4 text-xs text-indigo-400 font-medium">
          <span className="flex items-center gap-1"><ShieldCheck size={13} /> ABHA Ready</span>
          <span>·</span>
          <span>AES-256 Encrypted</span>
          <span>·</span>
          <span>HIPAA Compliant</span>
        </div>
      </div>

      {/* ───── RIGHT PANEL ───── */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 py-10 bg-white">
        <button
          onClick={onBack}
          className="lg:hidden self-start mb-4 flex items-center gap-2 text-indigo-500 hover:text-indigo-700 text-sm font-medium transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Home
        </button>

        <div className="w-full max-w-lg">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1 lg:hidden">
              <Heart fill="#7C83FD" size={20} />
              <span className="text-lg font-bold text-slate-800">MediVault</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">Create Account</h1>
            <p className="text-slate-500 mt-1 text-sm">Join MediVault to manage your health digitally.</p>
          </div>

          {/* Social sign-up */}
          <button className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-3 text-sm font-medium text-slate-700 hover:bg-gray-50 transition-all shadow-sm mb-4">
            <GoogleIcon /> Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR FILL IN DETAILS</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ── ABHA ID SECTION ── */}
            <div
              className="rounded-2xl p-5 mb-2 border"
              style={{ background: abhaFetched ? '#f0fdf4' : '#f5f6ff', borderColor: abhaFetched ? '#6ee7b7' : '#c7ccff' }}
            >
              <div className="flex items-start gap-2 mb-3">
                <ShieldCheck size={18} className={abhaFetched ? 'text-emerald-500 mt-0.5' : 'text-indigo-400 mt-0.5'} />
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {abhaFetched ? '✅ ABHA details fetched!' : 'Have an ABHA ID? Auto-fill your details'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {abhaFetched
                      ? 'Your profile has been pre-filled. You can still edit any field below.'
                      : 'Enter your 14-digit Ayushman Bharat Health Account number to auto-fill your profile. This is optional.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  id="abha-id"
                  type="text"
                  value={abhaId}
                  onChange={(e) => { setAbhaId(e.target.value); setAbhaError(''); }}
                  placeholder="e.g. 1234 5678 9012 34"
                  maxLength={18}
                  className="flex-1 border border-indigo-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAbhaFetch}
                  disabled={abhaFetching || !abhaId.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #7C83FD, #6366f1)' }}
                >
                  {abhaFetching ? <Loader size={16} className="animate-spin" /> : null}
                  {abhaFetching ? 'Fetching…' : 'Fetch My Details'}
                </button>
              </div>
              {abhaError && <p className="text-red-500 text-xs mt-2">{abhaError}</p>}

              {/* Demo hint */}
              <p className="text-[11px] text-slate-400 mt-2">
                🧪 Demo IDs: <code className="bg-white px-1 rounded">123456789012345</code> or <code className="bg-white px-1 rounded">987654321098765</code>
              </p>
            </div>

            {/* ── Auto-fillable fields ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" id="full-name" value={form.name} onChange={setField('name')} placeholder="As per health records" autoFilled={autoFilledFields.name} required />
              <Field label="Date of Birth" id="dob" type="date" value={form.dob} onChange={setField('dob')} autoFilled={autoFilledFields.dob} required />
              <Field label="Gender" id="gender" autoFilled={autoFilledFields.gender} required>
                <select
                  id="gender" value={form.gender} onChange={setField('gender')} required
                  className="w-full border rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none transition-all"
                  style={{ borderColor: autoFilledFields.gender ? '#6ee7b7' : '#e5e7eb', background: autoFilledFields.gender ? '#f0fdf4' : 'white' }}
                >
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </Field>
              <Field label="Blood Group" id="blood-group" autoFilled={autoFilledFields.bloodGroup} required>
                <select
                  id="blood-group" value={form.bloodGroup} onChange={setField('bloodGroup')} required
                  className="w-full border rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none transition-all"
                  style={{ borderColor: autoFilledFields.bloodGroup ? '#6ee7b7' : '#e5e7eb', background: autoFilledFields.bloodGroup ? '#f0fdf4' : 'white' }}
                >
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg}>{bg}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Mobile Number" id="mobile" type="tel" value={form.mobile} onChange={setField('mobile')} placeholder="10-digit mobile number" autoFilled={autoFilledFields.mobile} required />
            <Field label="Address" id="address" value={form.address} onChange={setField('address')} placeholder="City, State, PIN" autoFilled={autoFilledFields.address} />

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">ACCOUNT CREDENTIALS</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* ── Manual-fill only fields ── */}
            <Field label="Email Address" id="signup-email" type="email" value={form.email} onChange={setField('email')} placeholder="you@example.com" required />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input id="signup-password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={setField('password')} placeholder="Min. 8 characters" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-12 text-sm text-slate-800 focus:outline-none transition-all"
                  onFocus={(e) => e.target.style.borderColor='#7C83FD'} onBlur={(e) => e.target.style.borderColor='#e5e7eb'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input id="confirm-password" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={setField('confirmPassword')} placeholder="Repeat password" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-12 text-sm text-slate-800 focus:outline-none transition-all"
                  onFocus={(e) => e.target.style.borderColor='#7C83FD'} onBlur={(e) => e.target.style.borderColor='#e5e7eb'}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600 transition-colors">
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <Field label="Emergency Contact (optional)" id="emergency" type="tel" value={form.emergencyContact} onChange={setField('emergencyContact')} placeholder="Name & phone number" />

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all mt-2"
              style={{ background: 'linear-gradient(135deg, #7C83FD, #6366f1)' }}
            >
              Create My Patient Account
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <button onClick={onLogin} className="font-semibold hover:underline" style={{ color: '#7C83FD' }}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
