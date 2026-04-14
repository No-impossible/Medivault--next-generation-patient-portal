import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorLogin from './pages/DoctorLogin';
import { seedMockAbhaUsers } from './services/healthService';

import LandingPage from './pages/LandingPage';
import PatientSignUp from './pages/PatientSignUp';
import AuthPage from './pages/AuthPage';
import PatientDashboard from './pages/PatientDashboard';
import PatientSettings from './pages/PatientSettings';
import PatientRecords from './pages/PatientRecords';
import PatientHealthScore from './pages/PatientHealthScore';
import HospitalView from './pages/HospitalView';
import PatientConsultations from './pages/PatientConsultations';
import PatientBookConsultation from './pages/PatientBookConsultation';
import PatientOrderMedicine from './pages/PatientOrderMedicine';
import PatientPrescriptions from './pages/PatientPrescriptions';
import DashboardLayout from './layouts/DashboardLayout';

// Add the import here
import { createPortal } from 'react-dom';
import CinematicThemeSwitcher from './components/ui/cinematic-theme-switcher';

export default function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('medivault_patient_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Graceful optional chaining incase healthService hasn't been merged fully from main
    if (typeof seedMockAbhaUsers === 'function') {
      seedMockAbhaUsers().then(() => console.log('Seeding attempted on load')).catch(()=>console.log('Seed error'));
    }
  }, []);

  const scrollToEntry = (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    
    // Clear URL hash to ensure native router mechanics do not lock the viewport
    if (window.location.hash) {
      window.history.replaceState(null, null, ' ');
    }

    const target = document.getElementById('login-portal');
    if (!target) {
      navigate('/');
      setTimeout(() => {
        const newTarget = document.getElementById('login-portal');
        if (newTarget) newTarget.scrollIntoView();
      }, 150);
      return;
    }
    target.scrollIntoView();
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('medivault_patient_session', JSON.stringify(userData));
    navigate('/dashboard/patient');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medivault_patient_session');
    navigate('/');
  };

  return (
    <>
      {mounted && createPortal(
        <div className="fixed bottom-6 right-6 z-[99999] scale-[0.6] sm:scale-75 origin-bottom-right" style={{ zIndex: 99999 }}>
          <CinematicThemeSwitcher />
        </div>,
        document.body
      )}
      <Routes>
        {/* Public Share Route */}
        <Route path="/share/:token" element={<HospitalView />} />

        {/* Public Pages */}
        <Route 
          path="/" 
          element={
            <LandingPage 
              t={t} 
              i18n={i18n}
              scrollToEntry={scrollToEntry}
              onPatientLogin={() => navigate('/auth', { state: { role: 'patient' } })}
            />
          } 
        />
        
        <Route 
          path="/auth" 
          element={
            <AuthPage 
              onPatientBack={() => navigate('/')}
              onPatientSignUp={() => navigate('/signup/patient')}
              t={t}
              i18n={i18n}
              onPatientLoginSuccess={handleLoginSuccess}
            />
          } 
        />

        <Route 
          path="/signup/patient" 
          element={
            <PatientSignUp 
              onBack={() => navigate('/')}
              onLogin={() => navigate('/auth', { state: { role: 'patient' } })}
              onSignUpSuccess={handleLoginSuccess}
            />
          } 
        />

        {/* Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={<DashboardLayout role="patient" onLogout={handleLogout} user={user} setUser={setUser} />}
        >
          <Route path="patient" element={<PatientDashboard user={user} />} />
          <Route path="patient/records" element={<PatientRecords />} />
          <Route path="patient/health-score" element={<PatientHealthScore />} />
          <Route path="patient/prescriptions" element={<PatientPrescriptions />} />
          <Route path="patient/consultations" element={<PatientConsultations />} />
          <Route path="patient/book-consultation" element={<PatientBookConsultation />} />
          <Route path="patient/order-medicine" element={<PatientOrderMedicine />} />
          <Route path="patient/settings" element={<PatientSettings user={user} />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor/login" element={<Navigate to="/auth" state={{ role: 'doctor' }} replace />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
