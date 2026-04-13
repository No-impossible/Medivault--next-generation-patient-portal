import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CinematicThemeSwitcher from '../components/ui/cinematic-theme-switcher';
import { motion } from 'framer-motion';
import {
  Heart,
  ShieldCheck,
  Video,
  Pill,
  User,
  Lock,
  Menu,
  X,
  Stethoscope,
  FolderOpen,
  Globe,
  ArrowRight,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function LandingPage({ t, i18n, scrollToEntry, onPatientLogin }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [portalRole, setPortalRole] = useState('patient');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">

      {/* ═══════════════════ STICKY NAVIGATION ═══════════════════ */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${scrollY > 50 ? 'shadow-md' : ''}`}
      >
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center"
              >
                <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
              </motion.div>
              <span className="font-bold text-xl text-foreground">MediVault</span>
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{t('nav_about')}</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{t('nav_features')}</a>
            <a href="#security" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{t('nav_security')}</a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{t('nav_contact')}</a>

            <div className="flex items-center space-x-4 pl-4 border-l border-border ml-2">
              {/* Theme toggle moved to global App.jsx layout */}

              {/* Language Switcher */}
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-primary" />
                <select
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  value={i18n.language}
                  className="bg-transparent text-sm font-medium text-muted-foreground focus:outline-none cursor-pointer hover:text-primary transition-colors"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="mr">मराठी</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>
            </div>

            <Button onClick={scrollToEntry} size="sm" className="rounded-xl ml-2 text-primary-foreground">
              {t('nav_login')}
            </Button>
          </nav>

          {/* Mobile menu toggle */}
          <button className="flex md:hidden" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </motion.header>

      {/* ═══════════════ MOBILE MENU ════════════════ */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background md:hidden"
        >
          <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
            <a href="#" className="flex items-center space-x-2">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="font-bold text-xl">MediVault</span>
            </a>
            <button onClick={toggleMenu}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <motion.nav
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto grid gap-2 pb-8 pt-6 px-4"
          >
            {[
              { label: t('nav_about'), href: '#about' },
              { label: t('nav_features'), href: '#features' },
              { label: t('nav_security'), href: '#security' },
              { label: t('nav_contact'), href: '#contact' },
            ].map((item, index) => (
              <motion.div key={index} variants={itemFadeIn}>
                <a
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-lg font-medium hover:bg-accent"
                  onClick={toggleMenu}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4" />
                </a>
              </motion.div>
            ))}
            <motion.div variants={itemFadeIn} className="flex flex-col gap-3 pt-4 px-4">
              {/* Mobile Language Switcher */}
              <div className="flex items-center gap-2 mb-2">
                <Globe size={16} className="text-primary" />
                <select
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  value={i18n.language}
                  className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="mr">मराठी</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>
              <Button onClick={() => { toggleMenu(); scrollToEntry(new Event('click')); }} className="w-full rounded-xl">
                {t('nav_login')}
              </Button>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}

      <main className="flex-1">

        {/* ═══════════════════ HERO SECTION ═══════════════════ */}
        <section id="home" className="w-full py-12 md:py-20 lg:py-28 xl:py-36 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-muted rounded-3xl bg-gradient-to-br from-background to-muted/30">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="flex flex-col justify-center space-y-6 py-10 px-2 lg:px-6"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center rounded-full bg-muted px-4 py-1.5 text-sm font-medium"
                  >
                    <Zap className="mr-2 h-3.5 w-3.5 text-primary" />
                    Secure Health Platform
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl leading-tight"
                  >
                    {t('hero_title')}
                    <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                      {t('hero_title_highlight')}
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="max-w-[600px] text-muted-foreground text-lg md:text-xl leading-relaxed"
                  >
                    {t('hero_subtitle')}
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <Button size="lg" onClick={scrollToEntry} className="rounded-xl group text-base">
                    {t('hero_cta')}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-center py-6"
              >
                <div className="relative w-full max-w-lg overflow-hidden rounded-3xl">
                  <img
                    src="/hero_illustration.png"
                    alt="Doctor with patient looking at digital clipboard"
                    className="w-full h-auto object-cover drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ ABOUT SECTION ═══════════════════ */}
        <section id="about" className="w-full py-16 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-muted rounded-3xl"
          >
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center py-10 px-2 lg:px-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-5"
              >
                <div className="inline-block rounded-full bg-muted px-4 py-1.5 text-sm font-medium">About Us</div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">About MediVault</h2>
                <div className="w-20 h-1 bg-primary rounded-full"></div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  MediVault is a comprehensive digital health platform designed to bridge the gap between patients, healthcare providers, and pharmacies. We believe that accessing and managing your medical history should be secure, intuitive, and universally accessible.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our mission is to empower individuals with complete control over their health data while providing doctors with the insights they need to deliver better care. From securely storing medical records to facilitating online consultations and seamless pharmacy ordering, MediVault is your trusted partner in health management.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                variants={staggerContainer}
                className="grid grid-cols-2 gap-4"
              >
                <motion.div
                  variants={itemFadeIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-primary/5 border border-primary/10 p-8 rounded-2xl text-center hover:shadow-lg transition-all"
                >
                  <ShieldCheck size={40} className="text-primary mx-auto mb-4" />
                  <h4 className="font-bold text-foreground">Secure Storage</h4>
                  <p className="text-sm text-muted-foreground mt-2">Military-grade encryption for all your medical records.</p>
                </motion.div>
                <motion.div
                  variants={itemFadeIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 p-8 rounded-2xl text-center mt-8 hover:shadow-lg transition-all"
                >
                  <Heart size={40} className="text-teal-500 mx-auto mb-4" />
                  <h4 className="font-bold text-foreground">Better Care</h4>
                  <p className="text-sm text-muted-foreground mt-2">Instant access to medical history enables precise diagnoses.</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════ FEATURES SECTION ═══════════════════ */}
        <section id="features" className="w-full py-16 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-muted rounded-3xl bg-muted/10"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-full bg-muted px-4 py-1.5 text-sm font-medium"
                >
                  Features
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
                >
                  {t('feat_title')}
                </motion.h2>
                <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
              </div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3"
            >
              {[
                {
                  icon: <FolderOpen size={32} />,
                  title: t('feat_1_title'),
                  desc: t('feat_1_desc'),
                  color: 'text-primary',
                  bgColor: 'bg-primary/10',
                  borderHover: 'hover:border-primary/30',
                },
                {
                  icon: <Video size={32} />,
                  title: t('feat_2_title'),
                  desc: t('feat_2_desc'),
                  color: 'text-teal-500',
                  bgColor: 'bg-teal-50 dark:bg-teal-900/20',
                  borderHover: 'hover:border-teal-300',
                },
                {
                  icon: <Pill size={32} />,
                  title: t('feat_3_title'),
                  desc: t('feat_3_desc'),
                  color: 'text-primary',
                  bgColor: 'bg-primary/10',
                  borderHover: 'hover:border-primary/30',
                },
              ].map((feat, idx) => (
                <motion.div
                  key={idx}
                  variants={itemFadeIn}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className={`group relative overflow-hidden rounded-2xl border bg-background p-10 shadow-sm transition-all hover:shadow-xl ${feat.borderHover}`}
                >
                  <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-all duration-300"></div>
                  <div className="relative space-y-4">
                    <div className={`w-16 h-16 ${feat.bgColor} ${feat.color} rounded-xl flex items-center justify-center mb-6`}>
                      {feat.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{feat.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════ DUAL-ENTRY PORTAL ═══════════════════ */}
      <section id="entry-section" className="py-24 bg-gray-50 dark:bg-[#121212] flex justify-center items-center transition-colors duration-500">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">{t('dash_title')}</h2>
            <div className="w-20 h-1 bg-[#1E40AF] dark:bg-[#7C83FD] mx-auto rounded-full"></div>
          </div>
          
          <div className="bg-white dark:bg-[#1e1e1e] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-gray-100 dark:border-gray-800 min-h-[600px] transition-colors duration-500">
            {/* ───── LEFT PANEL (Dynamic based on Role) ───── */}
            <div
              className={`hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden px-12 py-16 transition-all duration-700`}
              style={{ 
                background: portalRole === 'patient' 
                  ? 'linear-gradient(135deg, #c7ccff 0%, #eef0ff 60%, #dce0ff 100%)'
                  : 'linear-gradient(135deg, #a7f3d0 0%, #ecfdf5 60%, #d1fae5 100%)'
              }}
            >
              <div className="w-72 h-72 mb-8 rounded-3xl overflow-hidden shadow-2xl transition-all duration-700" style={{ boxShadow: portalRole === 'patient' ? '0 25px 60px rgba(124,131,253,0.35)' : '0 25px 60px rgba(16,185,129,0.35)' }}>
                <img
                  src={portalRole === 'patient' ? "/login_illustration.png" : "/steth_hero.png"}
                  alt="Medical digital vault illustration"
                  className="w-full h-full object-cover transition-opacity duration-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full flex items-center justify-center bg-indigo-100 rounded-3xl hidden">
                  {portalRole === 'patient' ? <ShieldCheck size={100} className="text-indigo-400 opacity-60" /> : <Stethoscope size={100} className="text-emerald-400 opacity-60" />}
                </div>
              </div>

              <div className="text-center max-w-xs animate-in fade-in duration-500 key={portalRole}">
                <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-3 leading-snug">
                  {portalRole === 'patient' ? (
                    <>Your medical history.<br /><span style={{ color: '#7C83FD' }}>Secured. Always accessible.</span></>
                  ) : (
                    <>Practice Management.<br /><span style={{ color: '#059669' }}>Streamlined and Intuitive.</span></>
                  )}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {portalRole === 'patient' 
                    ? "MediVault keeps all your reports, prescriptions, and health records in one encrypted, government-standard vault."
                    : "Manage patient records, write prescriptions, and seamlessly sync with the global ABHA network natively."}
                </p>
              </div>

              <div className={`absolute bottom-8 flex items-center gap-4 text-xs font-medium opacity-80 ${portalRole === 'patient' ? 'text-indigo-500' : 'text-emerald-700'}`}>
                {portalRole === 'patient' ? (
                  <><span className="flex items-center gap-1"><ShieldCheck size={13} /> ABHA Ready</span><span>·</span><span>AES-256 Encrypted</span><span>·</span><span>HIPAA</span></>
                ) : (
                  <><span className="flex items-center gap-1"><Stethoscope size={13} /> Clinical Grade</span><span>·</span><span>Verified Doctors</span><span>·</span><span>NMC Approved</span></>
                )}
              </div>
            </div>

            {/* ───── RIGHT PANEL (Toggle & Access) ───── */}
            <div className="w-full lg:w-1/2 p-10 sm:p-16 flex flex-col justify-center relative bg-white dark:bg-[#1e1e1e] transition-colors duration-500">
              <div className="flex justify-center mb-10">
                <div className="bg-gray-50 dark:bg-slate-800 p-1.5 rounded-2xl inline-flex shadow-inner border border-gray-200 dark:border-gray-700 w-full max-w-md">
                  <button
                    onClick={() => setPortalRole('patient')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${portalRole === 'patient' ? 'bg-[#7C83FD] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:text-slate-100 dark:hover:text-slate-200'}`}
                  >
                    Patient
                  </button>
                  <button
                    onClick={() => setPortalRole('doctor')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${portalRole === 'doctor' ? 'bg-[#14B8A6] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:text-slate-100 dark:hover:text-slate-200'}`}
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

        {/* ═══════════════════ CONTACT SECTION ═══════════════════ */}
        <section id="contact" className="w-full py-16 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-muted rounded-3xl"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-full bg-muted px-4 py-1.5 text-sm font-medium"
                >
                  Support
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
                >
                  Contact Customer Service
                </motion.h2>
                <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto max-w-[700px] text-muted-foreground text-lg"
                >
                  We're here to help! Reach out to us for any support, inquiries, or feedback.
                </motion.p>
              </div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6 py-12 px-2 lg:px-6"
            >
              {[
                {
                  icon: <MapPin size={32} />,
                  title: 'Office Address',
                  content: <>123 HealthTech Avenue,<br />Silicon Valley, CA 94025<br />United States</>,
                  color: 'text-primary',
                  bgColor: 'bg-primary/10',
                },
                {
                  icon: <Mail size={32} />,
                  title: 'Email Support',
                  content: (
                    <>
                      <span className="block text-muted-foreground mb-1">For general queries:</span>
                      <a href="mailto:support@medivault.com" className="text-primary font-medium hover:underline">support@medivault.com</a>
                    </>
                  ),
                  color: 'text-teal-500',
                  bgColor: 'bg-teal-50 dark:bg-teal-900/20',
                },
                {
                  icon: <Phone size={32} />,
                  title: 'Phone Support',
                  content: (
                    <>
                      <span className="block text-muted-foreground mb-1">Mon-Fri from 8am to 5pm.</span>
                      <a href="tel:+18001234567" className="text-primary font-medium hover:underline">+1 (800) 123-4567</a>
                    </>
                  ),
                  color: 'text-primary',
                  bgColor: 'bg-primary/10',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemFadeIn}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="bg-muted/30 rounded-2xl p-10 text-center shadow-sm border border-muted hover:shadow-lg transition-all"
                >
                  <div className={`w-16 h-16 ${item.bgColor} ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <div className="text-muted-foreground">{item.content}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* ═══════════════════ SECURITY BANNER ═══════════════════ */}
      <motion.div
        id="security"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-900 py-6 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-emerald-400 font-semibold flex flex-col sm:flex-row items-center justify-center gap-4 text-sm md:text-base">
          <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-2 justify-center">
            <Lock size={18} />
            AES-256 Encrypted
          </motion.span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/50"></span>
          <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-2 justify-center">
            <ShieldCheck size={18} />
            ABHA (ABDM) Integration Sandbox Ready
          </motion.span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/50"></span>
          <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-2 justify-center">
            <FolderOpen size={18} />
            HIPAA Compliant Architecture
          </motion.span>
        </div>
      </motion.div>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="bg-slate-900 pt-16 pb-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2 text-white">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Heart fill="currentColor" size={24} className="text-teal-400" />
              </motion.div>
              <span className="text-xl font-bold">MediVault</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-400 dark:text-slate-500 font-medium">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>

          <div className="text-center md:text-left border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              © {new Date().getFullYear()} MediVault Inc. All rights reserved.
            </p>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm">
              Designed for Secure Health Management
            </p>
          </div>
        </motion.div>
      </footer>

    </div>
  );
}
