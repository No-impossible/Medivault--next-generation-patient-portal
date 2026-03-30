import React, { useState } from 'react';
import { Search, Loader2, User, CheckCircle } from 'lucide-react';

const AbhaSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setPatientData(null);

    // Mock API call to simulate network delay
    setTimeout(() => {
      setLoading(false);
      
      const cleanDigits = searchQuery.replace(/\D/g, '');
      // If the user entered the exact example ID, or any 14 digit string, we simulate a successful match
      if (searchQuery === '91-1122-3344-5566' || cleanDigits.length === 14) {
        setPatientData({
          fullName: 'John Doe',
          age: 45,
          gender: 'Male',
          abhaId: searchQuery
        });
      } else {
        // Otherwise, error state
        setError('No record found for this ABHA ID. Please check the number and try again.');
      }
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8 transition-all">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">ABHA Registry Search</h2>
        
        <form onSubmit={handleSearch} className="relative flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 text-base border-gray-300 border rounded-xl focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF] bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-shadow shadow-sm"
              placeholder="Enter 14-digit ABHA ID (e.g., 91-1122-3344-5566)"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-xl shadow-sm text-white bg-[#1E40AF] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E40AF] disabled:opacity-75 disabled:cursor-wait transition-all min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2.5 h-5 w-5 text-white" />
                Verifying with ABDM Gateway...
              </>
            ) : (
              'Search Patient'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start animate-in fade-in slide-in-from-top-2">
            <p className="text-sm text-red-600 font-medium">
              {error}
            </p>
          </div>
        )}

        {patientData && !loading && !error && (
          <div className="mt-8 bg-white border border-gray-100 rounded-xl shadow-md p-6 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Accent left border */}
             <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1E40AF]"></div>
             
             <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8 ml-2">
                <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center border-4 border-white shadow-sm flex-shrink-0">
                  <User className="h-12 w-12 text-[#1E40AF]" />
                </div>
                
                <div className="flex-grow space-y-3 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold text-gray-900">{patientData.fullName}</h3>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-500 block text-xs uppercase tracking-wider mb-1">ABHA ID</span>
                      <span className="text-gray-900 font-medium">{patientData.abhaId}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500 block text-xs uppercase tracking-wider mb-1">Age</span>
                      <span className="text-gray-900 font-medium">{patientData.age} years</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500 block text-xs uppercase tracking-wider mb-1">Gender</span>
                      <span className="text-gray-900 font-medium">{patientData.gender}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                  <button className="w-full lg:w-auto px-6 py-3 bg-[#1E40AF] text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:ring-offset-2 transition-all">
                    Request Consent to View Records
                  </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbhaSearch;
