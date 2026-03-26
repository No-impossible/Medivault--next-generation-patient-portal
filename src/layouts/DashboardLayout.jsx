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
  X
} from 'lucide-react';

export default function DashboardLayout({ role, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Overview', path: `/dashboard/${role}`, icon: <LayoutDashboard size={20} /> },
    { name: role === 'patient' ? 'My Records' : 'Patients', path: `/dashboard/${role}/records`, icon: <FolderOpen size={20} /> },
    { name: 'Consultations', path: `/dashboard/${role}/consultations`, icon: <CalendarCheck size={20} /> },
    { name: 'Settings', path: `/dashboard/${role}/settings`, icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className={`text-${role === 'patient' ? '[#1E40AF]' : '[#14B8A6]'}`}>
              <Heart fill="currentColor" size={28} />
            </div>
            <span className="text-xl font-bold text-slate-800">MediVault</span>
          </div>
          <button className="md:hidden text-slate-500" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-8 flex flex-col h-[calc(100vh-5rem)]">
          <div className="mb-6 px-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
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
                    ? `bg-${role === 'patient' ? 'blue' : 'teal'}-50 text-${role === 'patient' ? '[#1E40AF]' : '[#14B8A6]'}` 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </nav>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full mt-auto text-slate-500 hover:text-red-600 hover:bg-red-50 p-4 rounded-xl font-semibold transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <button 
            className="md:hidden text-slate-600 hover:text-slate-900"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full bg-${role === 'patient' ? 'blue' : 'teal'}-100 flex items-center justify-center text-${role === 'patient' ? '[#1E40AF]' : '[#14B8A6]'} font-bold`}>
              {role === 'patient' ? 'P' : 'Dr'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-tight">
                {role === 'patient' ? 'Patient Profile' : 'Dr. Dashboard'}
              </p>
              <p className="text-xs text-slate-500 capitalize">{role}</p>
            </div>
          </div>
        </header>

        {/* Dashboard Pages */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
