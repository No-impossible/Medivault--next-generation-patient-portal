import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PatientLogin from './pages/PatientLogin';
import PatientSignUp from './pages/PatientSignUp';
import PatientDashboard from './pages/PatientDashboard';
import PatientSettings from './pages/PatientSettings';
import DashboardLayout from './layouts/DashboardLayout';
import { translations } from './translations';

export default function App() {
  const [language, setLanguage] = useState('English');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const languages = ['English', 'Hindi', 'Spanish', 'French'];
  const t = (key) => translations[language][key] || key;

  const scrollToEntry = (e) => {
    e.preventDefault();
    const target = document.getElementById('entry-section');
    if (!target) {
      navigate('/');
      setTimeout(() => {
        const newTarget = document.getElementById('entry-section');
        if (newTarget) newTarget.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    target.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    navigate('/dashboard/patient');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <Routes>
      {/* Public Pages */}
      <Route 
        path="/" 
        element={
          <LandingPage 
            t={t} 
            language={language} 
            languages={languages}
            setLanguage={setLanguage}
            showLangDropdown={showLangDropdown}
            setShowLangDropdown={setShowLangDropdown}
            scrollToEntry={scrollToEntry}
            onPatientLogin={() => navigate('/login/patient')}
          />
        } 
      />
      
      <Route 
        path="/login/patient" 
        element={
          <PatientLogin 
            onBack={() => navigate('/')}
            onSignUp={() => navigate('/signup/patient')}
            language={language}
            setLanguage={setLanguage}
            onLoginSuccess={handleLoginSuccess}
          />
        } 
      />

      <Route 
        path="/signup/patient" 
        element={
          <PatientSignUp 
            onBack={() => navigate('/')}
            onLogin={() => navigate('/login/patient')}
            onSignUpSuccess={handleLoginSuccess}
          />
        } 
      />

      {/* Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={<DashboardLayout role="patient" onLogout={handleLogout} user={user} />}
      >
        <Route path="patient" element={<PatientDashboard user={user} />} />
        <Route path="patient/records" element={<div className="p-8"><h2 className="text-2xl font-bold">My Medical Records</h2><p className="text-slate-500 mt-2">No records found yet.</p></div>} />
        <Route path="patient/consultations" element={<div className="p-8"><h2 className="text-2xl font-bold">My Consultations</h2><p className="text-slate-500 mt-2">No upcoming consultations.</p></div>} />
        <Route path="patient/settings" element={<PatientSettings user={user} />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
