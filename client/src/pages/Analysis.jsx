import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award,
  ChevronRight,
  Printer
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import api from '../services/api';
import confetti from 'canvas-confetti';

const Analysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/resume/history/${id}`);
        setReport(response.data);
        
        // Trigger celebratory confetti if score is excellent (>= 80)
        if (response.data.atsScore >= 80) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (err) {
        console.error('Error fetching analysis details:', err);
        setError('Failed to load the analysis report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 rounded-full border-4 border-slate-200 dark:border-dark-800 border-t-brand-500 animate-spin mx-auto"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading report analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-8 border border-rose-200 dark:border-rose-950/20 bg-rose-50 dark:bg-rose-950/10 rounded-3xl text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-800 dark:text-rose-400">Report Error</h3>
        <p className="text-sm text-rose-600 dark:text-rose-500">{error || 'Could not find the requested report.'}</p>
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-bold text-brand-500 hover:text-brand-600">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { atsScore, resumeName, createdAt, analysisResult } = report;
  const { resumeDetails, atsScoreBreakdown, strengths, suggestions, skillsDistribution, recommendations } = analysisResult;

  // Formatting chart data
  const chartData = [
    { name: 'Formatting', score: atsScoreBreakdown.formatting, fill: '#85a3ff' },
    { name: 'Impact', score: atsScoreBreakdown.impact, fill: '#3852e6' },
    { name: 'Keywords', score: atsScoreBreakdown.keywords, fill: '#5275ff' },
    { name: 'Structure', score: atsScoreBreakdown.structure, fill: '#212c8c' },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-500 dark:text-amber-400';
    return 'text-rose-500 dark:text-rose-400';
  };

  const getPriorityBadgeColor = (priority) => {
    if (priority === 'high') return 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/35';
    if (priority === 'medium') return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/35';
    return 'bg-slate-50 dark:bg-dark-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-dark-750';
  };

  // SVG Circular Gauge Setup
  const radius = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  return (
    <div className="space-y-8 print:space-y-6 print:p-0">
      {/* Top action bar - Hidden during PDF Print */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link 
          to="/dashboard/history" 
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-brand-500 transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Back to History
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-800 font-bold text-sm transition-all"
        >
          <Printer className="h-4.5 w-4.5" />
          Print / Download PDF
        </button>
      </div>

      {/* Hero Summary Grid */}
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {/* Circular Gauge Card */}
        <div className="p-8 border border-slate-200 dark:border-dark-800 rounded-3xl bg-white dark:bg-dark-900/60 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">
            Overall ATS Compatibility
          </span>

          <div className="relative mb-6">
            <svg className="h-44 w-44 transform -rotate-95">
              <circle
                r={radius}
                cx="88"
                cy="88"
                fill="transparent"
                strokeWidth={strokeWidth}
                className="stroke-slate-100 dark:stroke-dark-800"
              />
              <circle
                r={radius}
                cx="88"
                cy="88"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="stroke-brand-500 dark:stroke-brand-400 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-outfit text-slate-800 dark:text-white">
                {atsScore}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">
                out of 100
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {atsScore >= 80 ? 'Excellent Match' : atsScore >= 60 ? 'Competitive Match' : 'Requires Optimization'}
            </h4>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Report Generated: {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Info & Metadata Card */}
        <div className="p-8 border border-slate-200 dark:border-dark-800 rounded-3xl bg-white dark:bg-dark-900/60 shadow-sm md:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Audited Document
              </span>
              <h2 className="text-xl font-bold font-outfit text-slate-850 dark:text-white mt-0.5 truncate">
                {resumeName}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-450">
                <User className="h-4.5 w-4.5 text-slate-400" />
                <span className="font-medium truncate">{resumeDetails.name || 'Name not detected'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-450">
                <Mail className="h-4.5 w-4.5 text-slate-400" />
                <span className="font-medium truncate">{resumeDetails.email || 'Email not detected'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-450">
                <Phone className="h-4.5 w-4.5 text-slate-400" />
                <span className="font-medium truncate">{resumeDetails.phone || 'Phone not detected'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-450">
                <Award className="h-4.5 w-4.5 text-slate-400" />
                <span className="font-medium truncate">Candidate Verified</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-dark-800">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              AI Recruiter Conclusion
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {recommendations}
            </p>
          </div>
        </div>
      </div>

      {/* Score Breakdown Chart & Skill Distribution Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Metric Bar Chart */}
        <div className="p-8 border border-slate-200 dark:border-dark-800 rounded-3xl bg-white dark:bg-dark-900/60 shadow-sm space-y-4">
          <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-white">
            ATS Metric Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => [`${value}%`, 'Score']} />
                <Bar dataKey="score" radius={6} barSize={14}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Rating Distribution */}
        <div className="p-8 border border-slate-200 dark:border-dark-800 rounded-3xl bg-white dark:bg-dark-900/60 shadow-sm space-y-4">
          <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-white">
            Parsed Skills Proficiency
          </h3>
          <div className="space-y-4 overflow-y-auto max-h-64 pr-2">
            {skillsDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-350">{item.skill}</span>
                  <span className="text-brand-500">{item.rating}/10</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-dark-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full" 
                    style={{ width: `${item.rating * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Actionable Improvements List */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="p-8 border border-slate-200 dark:border-dark-800 rounded-3xl bg-white dark:bg-dark-900/60 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl">
              <CheckCircle className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-white">
              Identified Strengths
            </h3>
          </div>
          
          <ul className="space-y-4">
            {strengths.map((strength, sidx) => (
              <li key={sidx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-650 dark:text-slate-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-2"></span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="p-8 border border-slate-200 dark:border-dark-800 rounded-3xl bg-white dark:bg-dark-900/60 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-50 dark:bg-brand-950/20 text-brand-500 rounded-xl">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-white">
              Required Improvements
            </h3>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {suggestions.map((sugg, suidx) => (
              <div 
                key={suidx}
                className="p-4 border border-slate-100 dark:border-dark-800/80 rounded-2xl bg-slate-50/50 dark:bg-dark-950/20 space-y-2"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 capitalize">
                    {sugg.category}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border tracking-wider ${getPriorityBadgeColor(sugg.priority)}`}>
                    {sugg.priority}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {sugg.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
