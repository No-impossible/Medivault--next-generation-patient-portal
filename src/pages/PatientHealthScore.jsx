import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Activity, Beaker, HeartPulse, Droplets, Target, ShieldCheck, ChevronLeft, TrendingUp, ArrowDown } from 'lucide-react';

export default function PatientHealthScore() {
  const { fullBodyReport } = useOutletContext();
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'optimal':
      case 'normal': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200';
      case 'borderline': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getMetricIcon = (metric) => {
    switch(metric) {
      case 'bmi': return <Activity size={24} />;
      case 'bloodPressure': return <HeartPulse size={24} />;
      case 'fastingSugar': return <Droplets size={24} />;
      case 'cholesterol': return <Beaker size={24} />;
      default: return <Target size={24} />;
    }
  };

  const formatMetricName = (metric) => {
    const spaces = metric.replace(/([A-Z])/g, ' $1');
    return spaces.charAt(0).toUpperCase() + spaces.slice(1);
  };

  if (!fullBodyReport) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 flex flex-col items-center justify-center text-center mt-12">
        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-400 rounded-full flex items-center justify-center mb-6">
          <Activity size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">Unlock your Health Score</h2>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 max-w-md leading-relaxed">
          Upload a Full Body Checkup report to get an instant AI-driven health score calculation and a dynamic breakdown of your clinical metrics against global benchmarks.
        </p>
        <button 
          onClick={() => navigate('/dashboard/patient/records')}
          className="bg-indigo-600 text-white font-bold hover:bg-indigo-700 px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 mt-8"
        >
          Go to Records
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard/patient')}
          className="p-2 hover:bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 dark:text-slate-500 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Health Benchmarks</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm mt-1">Based on Full Body Checkup ({fullBodyReport.date})</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Main Score Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-indigo-200 mb-6">MediVault Overall Score</h2>
            <div className="text-7xl font-black mb-2 flex items-baseline justify-center gap-2">
              {fullBodyReport.score}
              <span className="text-2xl font-semibold text-indigo-400">/100</span>
            </div>
            <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mt-6 flex items-center justify-center gap-2">
              <ShieldCheck size={18} /> Safe & Optimal
            </p>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>

        {/* Global Overview */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-lg border-b border-slate-100 dark:border-slate-800 pb-4">
            <Target className="text-indigo-500"/>
            Risk Factors
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 leading-relaxed">
            Your results are compared against international WHO and healthcare guidelines for age/gender specific demographics. Follow up tightly on borderline values.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Optimal: Inside benchmark bounds</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Borderline: Monitor via diet & habits</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">High Risk: High priority medical check</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Trends Module */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-lg">
              <TrendingUp className="text-indigo-500" />
              Progress Trends: Fasting Sugar
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Tracking your 3-year historical uploads.</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-4 py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 w-max shadow-sm border border-emerald-100">
            <ArrowDown size={16} strokeWidth={3} /> 26% Improvement
          </div>
        </div>

        <div className="h-56 flex items-end justify-between gap-4 px-2 sm:px-12 relative w-full pt-6">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pt-6 pb-12 z-0">
             <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700 relative"><span className="absolute -top-3 -left-6 text-[10px] text-slate-400 dark:text-slate-500 font-bold">140</span></div>
             <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700 relative"><span className="absolute -top-3 -left-6 text-[10px] text-slate-400 dark:text-slate-500 font-bold">100</span></div>
             <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700 relative"><span className="absolute -top-3 -left-6 text-[10px] text-slate-400 dark:text-slate-500 font-bold">60</span></div>
          </div>
          
          {[
            { year: '2024', value: 125, label: 'High Risk', color: 'from-red-400 to-red-500' },
            { year: '2025', value: 108, label: 'Borderline', color: 'from-amber-400 to-amber-500' },
            { year: '2026', value: 92, label: 'Optimal', color: 'from-emerald-400 to-emerald-500' }
          ].map((trend) => {
            const heightPercent = (trend.value / 140) * 100;
            return (
              <div key={trend.year} className="flex flex-col items-center gap-3 relative z-10 w-full group">
                {/* Value Tooltip */}
                <div className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-10 whitespace-nowrap shadow-lg">
                  {trend.value} mg/dL
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                </div>
                
                {/* Bar */}
                <div 
                  className={`w-12 md:w-20 rounded-t-xl bg-gradient-to-t ${trend.color} shadow-md transition-all duration-500 hover:scale-105 hover:brightness-110 cursor-pointer`}
                  style={{ height: `${heightPercent}%` }}
                />
                
                {/* Label */}
                <div className="text-center absolute -bottom-12">
                  <span className="block text-sm font-black text-slate-800 dark:text-slate-100">{trend.year}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap">{trend.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metric Breakdown Table Grid */}
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 pt-8 border-t border-slate-200 dark:border-slate-700">Biometric Report Breakdown</h3>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(fullBodyReport.metrics).map(([key, data]) => (
          <div key={key} className="bg-white dark:bg-[#1e1e1e] border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-indigo-100 hover:shadow-md">
            
            <div className="flex items-center gap-5 md:w-1/3">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                {getMetricIcon(key)}
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">{formatMetricName(key)}</h4>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">Your Value:</span>
                <span className="font-black text-slate-800 dark:text-slate-100">{data.value}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getStatusColor(data.status).split(' ')[1]}`} 
                  style={{ width: data.status === 'Optimal' || data.status === 'Normal' ? '50%' : (data.status === 'Borderline' ? '85%' : '100%') }}
                />
              </div>
            </div>

            <div className="md:w-1/4 flex flex-col items-end gap-2 shrink-0">
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(data.status)}`}>
                {data.status.toUpperCase()}
              </div>
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                Benchmark: <br/>{data.benchmark}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
