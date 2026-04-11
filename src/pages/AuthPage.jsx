import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PatientLogin from './PatientLogin';
import DoctorLogin from './DoctorLogin';

export default function AuthPage({ onPatientBack, onPatientSignUp, t, i18n, onPatientLoginSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();
  // Default to what was passed in state, or patient
  const [role, setRole] = useState(location.state?.role || 'patient');

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#121212] transition-colors duration-500 overflow-hidden">
      {/* Renders the appropriate dashboard */}
      <div className="w-full h-full">
        {role === 'patient' ? (
          <div className="h-screen w-full">
            <PatientLogin 
              onBack={() => navigate('/')} 
              onSignUp={onPatientSignUp} 
              t={t} 
              i18n={i18n} 
              onLoginSuccess={onPatientLoginSuccess} 
            />
          </div>
        ) : (
          <div className="w-full h-full pt-8">
            <DoctorLogin />
          </div>
        )}
      </div>
    </div>
  );
}
