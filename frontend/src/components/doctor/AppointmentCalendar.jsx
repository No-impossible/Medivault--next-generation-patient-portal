import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function AppointmentCalendar({ onCancel, onBooked }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '11:30 AM', 
    '02:00 PM', '03:30 PM', '04:00 PM', '05:30 PM'
  ];

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedSlot || !patientName.trim()) return;
    
    setIsBooking(true);
    // Simulate booking API call
    setTimeout(() => {
      setIsBooking(false);
      setBooked(true);
      setTimeout(() => {
        if (onBooked) onBooked({ patientName, date: selectedDate, time: selectedSlot });
        else onCancel();
      }, 2000);
    }, 1500);
  };

  if (booked) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-emerald-100">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-lg">Appointment secured for {patientName}</p>
        <p className="text-emerald-700 dark:text-emerald-400 font-bold mt-2 bg-emerald-50 dark:bg-emerald-900/30 px-6 py-2 rounded-xl border border-emerald-200/50">
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedSlot}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onCancel}
          className="p-2 bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 dark:bg-emerald-900/20 transition-all cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Schedule New Appointment</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Select an available date, time slot, and patient to confirm the booking.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 flex-1">
        {/* Left Column: Calendar & Slots */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <CalendarIcon size={18} className="text-emerald-500" /> Select Date
            </h3>
            <div className="flex gap-2">
              <button className="p-1 rounded-md hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800"><ChevronLeft size={16} /></button>
              <button className="p-1 rounded-md hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800"><ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar mb-6">
            {dates.map((date, idx) => {
              const isSelected = selectedDate.getDate() === date.getDate();
              return (
                <button 
                  key={idx}
                  onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                  className={`flex flex-col items-center justify-center min-w-16 p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-105' 
                      : 'bg-white dark:bg-[#1e1e1e] border-gray-200 text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:border-emerald-300 hover:bg-emerald-50 dark:bg-emerald-900/20'
                  }`}
                >
                  <span className="text-xs font-semibold uppercase opacity-80 mb-1">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-lg font-bold">{date.getDate()}</span>
                </button>
              );
            })}
          </div>

          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            <Clock size={18} className="text-emerald-500" /> Available Slots
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`py-3 px-2 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                  selectedSlot === slot 
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm ring-2 ring-blue-600/20' 
                    : 'bg-slate-50 dark:bg-[#121212] border-gray-200 text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:border-blue-400 hover:bg-white dark:bg-[#1e1e1e]'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="bg-slate-900 rounded-3xl p-8 shadow-md border border-slate-800 text-white flex flex-col relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          
          <h3 className="text-xl font-bold text-white mb-6">Booking Details</h3>
          
          <form onSubmit={handleBooking} className="flex flex-col flex-1 relative z-10">
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 dark:text-slate-500 mb-2">Patient Search / Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter ABHA ID or Name..."
                  className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all placeholder-slate-500"
                />
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 mb-8">
              <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Summary</h4>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-300 text-sm">Date</span>
                <span className="font-medium text-white">{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-300 text-sm">Time</span>
                <span className="font-medium text-white">{selectedSlot || 'Not selected'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-300 text-sm">Consultation Type</span>
                <span className="font-medium text-emerald-400">In-Person Clinic</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={!selectedSlot || !patientName.trim() || isBooking}
              className={`mt-auto w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                (!selectedSlot || !patientName.trim()) 
                  ? 'bg-slate-800 text-slate-500 dark:text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-xl shadow-emerald-500/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isBooking ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Confirming...
                </span>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
