import React from 'react';
import { 
  ShieldCheck, 
  Stethoscope, 
  Pill, 
  Upload, 
  Activity, 
  Lock, 
  Smartphone, 
  FileText, 
  CheckCircle2, 
  ChevronRight,
  Menu
} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <Activity size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                MediVault
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#records" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">My Records</a>
              <a href="#consult" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Consult Doctor</a>
              <a href="#pharmacy" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pharmacy</a>
              
              <div className="flex items-center space-x-4 ml-4">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Login
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30">
                  Sign Up
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium mb-6 border border-teal-100">
                <ShieldCheck size={16} />
                <span>ABHA Compliant & Secure</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Your Entire <span className="text-blue-600">Medical History</span>, 
                <br />Now in Your Pocket.
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Securely digitize, manage, and share your health records. 
                Seamlessly integrated with ABHA and protected by bank-level encryption.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5">
                  <Upload size={20} />
                  Upload First Report
                </button>
                <button className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-4 rounded-full text-lg font-semibold transition-all">
                  How it Works
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative lg:ml-auto w-full max-w-lg aspect-square">
              {/* Abstract decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-50 to-teal-50 rounded-full blur-3xl -z-10" />
              
              {/* Mockup Card */}
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden absolute inset-0 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <div className="bg-blue-600 p-6 flex items-center justify-between text-white">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Digital Health Card</p>
                    <p className="text-xl font-bold">Ayushman Bharat ID</p>
                  </div>
                  <Activity size={32} className="opacity-80" />
                </div>
                <div className="p-6">
                  <div className="w-full h-32 bg-slate-50 rounded-xl mb-4 border border-dashed border-slate-200 flex items-center justify-center">
                    <Smartphone className="text-slate-400" size={48} />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <div className="flex-1 bg-teal-50 text-teal-700 py-2 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2">
                      <Lock size={14} /> encrypted
                    </div>
                    <div className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg text-center text-sm font-medium">Verify</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust/Security Banner */}
      <div className="bg-slate-900 overflow-hidden transform skew-y-1 my-[-4rem] relative z-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transform -skew-y-1">
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 text-white/80">
            <div className="flex items-center gap-3">
              <Lock className="text-teal-400" size={28} />
              <div>
                <p className="font-bold text-white text-lg">AES-256 Encryption</p>
                <p className="text-sm">Bank-grade security</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10"></div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-400" size={28} />
              <div>
                <p className="font-bold text-white text-lg">ABHA Ready</p>
                <p className="text-sm">Govt. compliant health locker</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10"></div>
            <div className="flex items-center gap-3">
              <FileText className="text-purple-400" size={28} />
              <div>
                <p className="font-bold text-white text-lg">HIPAA Standards</p>
                <p className="text-sm">Privacy guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <section className="py-24 bg-slate-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Complete Healthcare Ecosystem</h2>
            <p className="text-slate-600 text-lg">Everything you need to manage your health, connected in one secure platform.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Digital Vault</h3>
              <p className="text-slate-600 leading-relaxed">
                Smart OCR automatically reads and categorizes your physical lab reports, prescriptions, and scans into a searchable digital archive.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-teal-100 transition-all duration-300 group">
              <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-white transition-all">
                <Stethoscope size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Doctor Connect</h3>
              <p className="text-slate-600 leading-relaxed">
                24/7 online video consultations with top specialists. Share your digital records instantly and securely with a single tap.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-purple-100 transition-all duration-300 group">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Pill size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Pharmacy</h3>
              <p className="text-slate-600 leading-relaxed">
                Seamlessly convert prescriptions into orders via integrations with PharmEasy and Apollo. Get medicines delivered to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How it Works</h2>
            <p className="text-slate-600 text-lg">Digitizing your wellness journey is as easy as 1-2-3.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-100 via-teal-100 to-blue-100" />
            
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-20 h-20 mx-auto bg-white border-4 border-slate-50 flex items-center justify-center rounded-full shadow-lg relative z-10 mb-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <Upload size={28} />
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-3 mt-3 w-8 h-8 bg-slate-900 text-white font-bold rounded-full flex items-center justify-center shadow-md">1</div>
              <h4 className="text-xl font-bold mb-3">Upload Records</h4>
              <p className="text-slate-500">Snap a photo of your prescription or upload PDF reports directly.</p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-20 h-20 mx-auto bg-white border-4 border-slate-50 flex items-center justify-center rounded-full shadow-lg relative z-10 mb-6">
                <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center">
                  <Activity size={28} />
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-3 mt-3 w-8 h-8 bg-slate-900 text-white font-bold rounded-full flex items-center justify-center shadow-md">2</div>
              <h4 className="text-xl font-bold mb-3">AI Analysis</h4>
              <p className="text-slate-500">Our medical OCR algorithms extract and structure your health data automatically.</p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="w-20 h-20 mx-auto bg-white border-4 border-slate-50 flex items-center justify-center rounded-full shadow-lg relative z-10 mb-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-3 mt-3 w-8 h-8 bg-slate-900 text-white font-bold rounded-full flex items-center justify-center shadow-md">3</div>
              <h4 className="text-xl font-bold mb-3">Instant Sharing</h4>
              <p className="text-slate-500">Share securely with doctors, pharmacies, and family via timed access links.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                  <Activity size={20} />
                </div>
                <span className="text-xl font-bold text-slate-900">MediVault</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Your trusted partner in digital health management. Empowering patients and connecting the healthcare ecosystem.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Digital Locker</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Teleconsultation</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pharmacy Sync</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Health Pass</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">HIPAA Compliance</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm font-medium">
              Made with <span className="text-red-500 mx-1">❤️</span> for Digital Health
            </p>
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} MediVault Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
