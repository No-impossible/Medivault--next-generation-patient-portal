import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DoctorDashboard from './pages/DoctorDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
