import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  HeartPulse, 
  BrainCircuit, 
  Eye, 
  Baby, 
  Bone, 
  Stethoscope, 
  ChevronLeft, 
  Star, 
  Clock, 
  CheckCircle, 
  Video, 
  Building
} from 'lucide-react';
import { fetchDoctors, seedMockDoctors } from '../services/healthService';
import { addConsultation } from '../supabaseClient';

const DEPARTMENTS = [
  { id: 'general', name: 'General Physician', icon: <Stethoscope size={32} />, exp: 'Fevers, Colds, General Health' },
  { id: 'cardio', name: 'Cardiology', icon: <HeartPulse size={32} />, exp: 'Heart, Blood Pressure' },
  { id: 'neuro', name: 'Neurology', icon: <BrainCircuit size={32} />, exp: 'Brain, Nerves, Migraines' },
  { id: 'ortho', name: 'Orthopedics', icon: <Bone size={32} />, exp: 'Bones, Joints, Muscles' },
  { id: 'pedia', name: 'Pediatrics', icon: <Baby size={32} />, exp: 'Child Specialist' },
  { id: 'opthalmo', name: 'Ophthalmology', icon: <Eye size={32} />, exp: 'Eye Care, Vision' },
];

// MOCK_DOCTORS replaced with Supabase data

export default function PatientBookConsultation() {
  const navigate = useNavigate();
  const { user, setConsultations } = useOutletContext();
  const [step, setStep] = useState('department'); // department -> doctors -> confirm
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMode, setSelectedMode] = useState('Online Video Consult');
  const [doctorsList, setDoctorsList] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // OPTIONAL: Auto-seed on component mount (for development only, you can remove later)
  useEffect(() => {
    // seedMockDoctors();
  }, []);

  const generateAvailableDates = () => {
    const dates = ['Today', 'Tomorrow'];
    const today = new Date();
    const getSuffix = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
      }
    };
    for (let i = 2; i < 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      dates.push(`${days[d.getDay()]}, ${d.getDate()}${getSuffix(d.getDate())} ${months[d.getMonth()]}`);
    }
    return dates;
  };

  const availableDates = generateAvailableDates();
  const availableTimes = ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '6:00 PM'];

  const handleDeptSelect = async (deptId) => {
    setSelectedDept(deptId);
    setLoadingDoctors(true);
    setStep('doctors');
    try {
      const docs = await fetchDoctors(deptId);
      setDoctorsList(docs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleDoctorSelect = (doc) => {
    setSelectedDoctor(doc);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedMode('Online Video Consult');
    setStep('confirm');
  };

  const confirmBooking = async () => {
    try {
      const newConsultation = {
        doctorName: selectedDoctor.name,
        department: DEPARTMENTS.find(d => d.id === selectedDept).name,
        date: selectedDate,
        time: selectedTime,
        type: selectedMode,
        status: 'upcoming'
      };
      
      let savedConsultation = newConsultation;
      if (user?.id) {
        savedConsultation = await addConsultation(user.id, newConsultation);
      } else {
        savedConsultation.id = Date.now().toString();
      }
      
      setConsultations(prev => [savedConsultation, ...prev]);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert('Failed to book. Please try again or refresh.');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/dashboard/patient/consultations');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            if (step === 'confirm') setStep('doctors');
            else if (step === 'doctors') setStep('department');
            else navigate('/dashboard/patient');
          }}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            {step === 'department' && 'What are you feeling today?'}
            {step === 'doctors' && `Choose your ${DEPARTMENTS.find(d=>d.id===selectedDept)?.name} Expert`}
            {step === 'confirm' && 'Confirm Your Appointment'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {step === 'department' && 'Select a medical department to find the right doctor.'}
            {step === 'doctors' && 'Select from verified specialists available in the network.'}
            {step === 'confirm' && 'Review your details and finalize the booking.'}
          </p>
        </div>
      </div>

      {step === 'department' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEPARTMENTS.map((dept) => (
            <div 
              key={dept.id} 
              onClick={() => handleDeptSelect(dept.id)}
              className="bg-white border text-center border-slate-200 rounded-3xl p-8 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 mx-auto bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                {dept.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{dept.name}</h3>
              <p className="text-sm text-slate-500">{dept.exp}</p>
            </div>
          ))}
        </div>
      )}

      {step === 'doctors' && (
        <div className="grid md:grid-cols-2 gap-6">
          {loadingDoctors ? (
            <div className="col-span-2 text-center py-10 text-slate-500 font-bold">Loading specialists...</div>
          ) : doctorsList.length === 0 ? (
            <div className="col-span-2 text-center py-10 text-slate-500 font-bold">No specialists found for this department. Please ensure the 'doctors' table is populated in Supabase.</div>
          ) : doctorsList.map((doc) => (
            <div key={doc.id} className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center md:items-start group hover:shadow-lg transition-all">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-black text-slate-300 shrink-0 border-4 border-white shadow-sm">
                {doc.img}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{doc.name}</h3>
                    <p className="text-sm font-semibold text-indigo-600 mb-3">{DEPARTMENTS.find(d=>d.id===selectedDept)?.name}</p>
                  </div>
                  <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 mx-auto md:mx-0">
                    <Star size={14} fill="currentColor" /> {doc.rating}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-slate-500 mb-6">
                  <span className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{doc.exp} Exp</span>
                  <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                    <Clock size={14}/> {doc.nextSlot}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                  <div className="text-left">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Consult Fee</p>
                    <p className="text-lg font-black text-slate-800">{doc.fee}</p>
                  </div>
                  <button 
                    onClick={() => handleDoctorSelect(doc)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 'confirm' && selectedDoctor && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="bg-indigo-600 p-8 text-center text-white relative">
            <CheckCircle size={48} className="mx-auto text-indigo-300 mb-4" />
            <h2 className="text-2xl font-black mb-2">Review Appointment</h2>
            <p className="text-indigo-200">Please confirm your booking details below.</p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-2xl font-black text-slate-400">
                 {selectedDoctor.img}
               </div>
               <div>
                 <h3 className="font-bold text-slate-800 text-lg">{selectedDoctor.name}</h3>
                 <p className="text-sm text-slate-500">{DEPARTMENTS.find(d=>d.id===selectedDept)?.name}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2 border border-slate-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-slate-800">Select Date</p>
                  <p className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-lg">Available Slots</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableDates.map(date => (
                    <button 
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        selectedDate === date 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6 mb-4 pt-4 border-t border-slate-100">
                  <p className="text-sm font-bold text-slate-800">Select Time</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableTimes.map(time => (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        selectedTime === time 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-slate-100 rounded-2xl p-4 flex flex-col justify-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Consultation Fee</p>
                <p className="font-black text-2xl text-slate-800">{selectedDoctor.fee}</p>
                <p className="text-xs text-emerald-500 font-bold mt-1">No hidden charges</p>
              </div>

              <div className="border border-slate-100 rounded-2xl p-4 flex flex-col justify-center gap-2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Mode</p>
                <div 
                  onClick={() => setSelectedMode('Online Video Consult')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer font-semibold text-sm w-full transition-all ${selectedMode === 'Online Video Consult' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200'}`}
                >
                  <Video size={18} /> Online Video
                  {selectedMode === 'Online Video Consult' && <div className="ml-auto w-4 h-4 rounded-full border-4 border-blue-600 bg-white" />}
                </div>
                {selectedDoctor.clinic ? (
                  <div 
                    onClick={() => setSelectedMode('Clinic Visit')}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer font-semibold text-sm w-full transition-all ${selectedMode === 'Clinic Visit' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200'}`}
                  >
                    <Building size={18} /> Clinic Visit
                    {selectedMode === 'Clinic Visit' && <div className="ml-auto w-4 h-4 rounded-full border-4 border-blue-600 bg-white" />}
                  </div>
                ) : (
                  <div className="bg-slate-50 text-slate-400 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2 cursor-not-allowed font-semibold text-sm w-full opacity-60">
                    <Building size={18} /> Clinic Visit (Not Available)
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={confirmBooking}
              disabled={!selectedDate || !selectedTime}
              className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all mt-6 ${
                selectedDate && selectedTime 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:-translate-y-1' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {selectedDate && selectedTime ? 'Confirm & Book Appointment' : 'Select Date & Time to Proceed'}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={handleModalClose}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Appointment Confirmed!</h3>
            <p className="text-slate-500 mb-8">
              Your consultation with <span className="font-bold text-indigo-600">{selectedDoctor?.name}</span> is confirmed for {selectedDate} at {selectedTime}.
            </p>
            <button 
              onClick={handleModalClose}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md shadow-indigo-200"
            >
              Okay, View Consultations
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
