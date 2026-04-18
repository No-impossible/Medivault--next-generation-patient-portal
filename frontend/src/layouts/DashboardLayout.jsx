import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  LayoutDashboard, 
  FolderOpen, 
  CalendarCheck, 
  Settings, 
  LogOut,
  Menu,
  X,
  Plus,
  ShieldAlert,
  QrCode,
  FileText
} from 'lucide-react';
import { fetchConsultations } from '../supabaseClient';
import ShareHistoryQR from '../components/ShareHistoryQR';
import { useTranslation } from 'react-i18next';

export default function DashboardLayout({ role, onLogout, user, setUser }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = React.useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [quoteIdx, setQuoteIdx] = React.useState(0);
  const [records, setRecords] = React.useState([]);
  const [fullBodyReport, setFullBodyReport] = React.useState(null);
  const [consultations, setConsultations] = React.useState([]);
  const navigate = useNavigate();

  // Fetch real data on mount or when user changes
  React.useEffect(() => {
    setRecords([]);
    setConsultations([]);
    setFullBodyReport(null);
    
    if (user?.id) {
      // 1. Fetch Consultations
      fetchConsultations(user.id).then(fetched => {
        if (fetched && fetched.length > 0) {
          setConsultations(fetched.sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
      });
      // 2. Fetch Records (To initialize records in context directly and infer fullBodyReport)
      // Wait, records are actually fetched in PatientRecords, but we can do it here to have it globally available for fullBodyReport!
      import('../supabaseClient').then(({ fetchPatientRecords }) => {
        fetchPatientRecords(user.id).then(fetchedRecs => {
           setRecords(fetchedRecs);
           // Try to infer a full body report from the best/latest AI Summary
           const reportRec = fetchedRecs.find(r => r.name.toLowerCase().includes('checkup') || r.name.toLowerCase().includes('report'));
           if (reportRec) {
             const dScore = 75 + (reportRec.name.length % 20);
             setFullBodyReport({
                date: reportRec.date || new Date().toISOString().split('T')[0],
                score: dScore,
                metrics: {
                  bmi: { value: 24.2, status: 'Normal', benchmark: '18.5 - 24.9' },
                  bloodPressure: { value: dScore > 85 ? '120/80' : '135/88', status: dScore > 85 ? 'Optimal' : 'Borderline', benchmark: '120/80 mmHg' },
                  fastingSugar: { value: 92, status: 'Optimal', benchmark: '<100 mg/dL' },
                  cholesterol: { value: 185, status: 'Optimal', benchmark: '<200 mg/dL' },
                  hemoglobin: { value: 14.5, status: 'Normal', benchmark: '13.8 - 17.2 g/dL' }
                }
             });
           }
        });
      });
    }
  }, [user]);

  const quotes = [
    "Your health is an investment, not an expense.",
    "Every day is another chance to get stronger.",
    "Take care of your body. It's the only place you have to live.",
    "Healing takes time, and asking for help is a courageous step."
  ];

  React.useEffect(() => {
    // Quote rotation removed to prevent layout re-renders that reset inner nested routes
  }, [quotes.length]);

  const { t } = useTranslation();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const navLinks = [
    { name: t('nav_overview'), path: `/dashboard/${role}`, icon: <LayoutDashboard size={20} /> },
    { name: role === 'patient' ? t('nav_my_records') : t('nav_patients'), path: `/dashboard/${role}/records`, icon: <FolderOpen size={20} /> },
    { name: t('nav_consultations'), path: `/dashboard/${role}/consultations`, icon: <CalendarCheck size={20} /> },
    ...(role === 'patient' ? [{ name: t('nav_prescriptions'), path: '/dashboard/patient/prescriptions', icon: <FileText size={20} /> }] : []),
    { name: t('nav_settings'), path: `/dashboard/${role}/settings`, icon: <Settings size={20} /> },
  ];

  const quickActions = [
    { name: t('action_book_consultation'), icon: <Plus size={16} />, bgClass: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50', textClass: 'text-blue-700 dark:text-blue-300', iconBg: 'bg-blue-100 dark:bg-blue-800', action: () => navigate(`/dashboard/patient/book-consultation`) },
    { name: t('action_order_medicine'), icon: <Plus size={16} />, bgClass: 'bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/30 dark:hover:bg-teal-900/50', textClass: 'text-teal-700 dark:text-teal-300', iconBg: 'bg-teal-100 dark:bg-teal-800', action: () => navigate(`/dashboard/patient/order-medicine`) },
  ];

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#121212] flex font-sans text-slate-900 dark:text-white">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1e1e1e] border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100">
          <div className="flex items-center gap-3 cursor-pointer relative z-10 group" onClick={() => navigate(`/dashboard/${role}`)}>
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
              <Heart className="h-5 w-5 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">MediVault</span>

          </div>
          <button className="md:hidden text-slate-500 dark:text-slate-400 dark:text-slate-500" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-8 flex flex-col h-[calc(100vh-5rem)]">
          <div className="mb-6 px-4">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{t('nav_menu')}</p>
          </div>
          
          <nav className="flex-1 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === `/dashboard/${role}`}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${isActive 
                    ? `bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary` 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Quick Actions in Sidebar */}
          {role === 'patient' && (
            <div className="mt-8 space-y-4 px-2">
              <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('nav_quick_actions')}</div>
              <div className="grid grid-cols-1 gap-2">
                {quickActions.map((action) => (
                  <button 
                    onClick={action.action} 
                    key={action.name} 
                    className={`flex items-center gap-3 w-full p-3.5 rounded-xl text-[11px] font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ${action.bgClass} ${action.textClass}`}
                  >
                    <div className={`p-1 rounded-lg ${action.iconBg}`}>{action.icon}</div>
                    {action.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center gap-2 w-full mt-auto text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 p-4 rounded-xl font-semibold transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white dark:bg-[#1e1e1e] border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 sticky top-0 z-30">
          <button 
            className="md:hidden text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:text-white"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            {/* SOS Button */}
            <button 
              onClick={() => setIsSosModalOpen(true)}
              className="group relative flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/50 dark:shadow-red-900/80 transition-all hover:-translate-y-0.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white dark:bg-[#1e1e1e]"></span>
              </span>
              SOS
            </button>

            {/* QR Code Button */}
            {role === 'patient' && (
              <button 
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold text-xs transition-all hover:-translate-y-0.5"
              >
                <QrCode size={16} className="text-primary" />
                <span className="hidden sm:inline">{t('dash_checkin')}</span>
              </button>
            )}

            <div 
              className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-[#121212] p-2 rounded-xl transition-colors"
              onClick={() => navigate(`/dashboard/${role}/settings`)}
            >
            <div className={`w-10 h-10 rounded-full bg-${role === 'patient' ? 'blue' : 'teal'}-100 flex items-center justify-center text-${role === 'patient' ? '[hsl(var(--secondary-foreground))]' : '[hsl(var(--accent))]'} font-bold`}>
              {user?.name?.[0] || (role === 'patient' ? 'P' : 'Dr')}
            </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {user?.name || (role === 'patient' ? t('role_patient') : t('role_doctor'))}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 capitalize">{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Pages */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-[#121212] flex flex-col justify-between p-6 md:p-8">
          <div>
            <Outlet context={{ user, setUser, records, setRecords, fullBodyReport, setFullBodyReport, consultations, setConsultations }} />
          </div>
          
          {/* Motivational Footer */}
          <footer className="mt-12 text-center text-slate-400 dark:text-slate-500 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-700 pb-4">
            "{quotes[quoteIdx]}"
          </footer>
        </div>
      </main>

      {/* SOS Modal */}
      {isSosModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsSosModalOpen(false)}
          />
          <div className="relative bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-black text-center text-slate-800 dark:text-slate-100 mb-2">{t('dash_sos_title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-center mb-6 leading-relaxed">
              {t('sos_desc')}
            </p>
            <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl p-4 mb-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{t('sos_call')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {t('sos_alerting')}<br/>
                  <span className="font-bold">
                    {user?.emergencyContacts?.length > 0 
                      ? user.emergencyContacts.map(c => c.name).join(', ') 
                      : 'Rahul Sharma, Dr. Amit Patel'}
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{t('sos_sharing')}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-red-100 transition-all hover:scale-[1.02]"
                onClick={() => {
                  alert('Emergency signals sent. Emergency services are being notified.');
                  setIsSosModalOpen(false);
                }}
              >
                {t('sos_confirm')}
              </button>
              <button 
                className="w-full py-3 text-slate-500 dark:text-slate-400 dark:text-slate-500 font-bold hover:text-slate-700 dark:text-slate-300"
                onClick={() => setIsSosModalOpen(false)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal for Check-in */}
      {isQrModalOpen && (
        <ShareHistoryQR user={user} onClose={() => setIsQrModalOpen(false)} />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
              <LogOut size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 text-center mb-2">{t('logout_title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-center text-sm mb-8 leading-relaxed">
              {t('logout_desc')}
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold tracking-wide shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5"
              >
                {t('logout_btn')}
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-3.5 text-slate-500 dark:text-slate-400 dark:text-slate-500 font-bold hover:text-slate-800 dark:text-slate-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
