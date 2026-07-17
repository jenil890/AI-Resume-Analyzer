import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Award, 
  History, 
  TrendingUp, 
  ArrowRight, 
  UploadCloud, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/resume/history');
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Compute stats
  const totalScans = history.length;
  const averageScore = totalScans > 0 
    ? Math.round(history.reduce((sum, item) => sum + item.atsScore, 0) / totalScans) 
    : 0;
  const maxScore = totalScans > 0 
    ? Math.max(...history.map(item => item.atsScore)) 
    : 0;

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
    if (score >= 60) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
    return 'text-rose-500 bg-rose-50 dark:bg-rose-950/20';
  };

  const getScoreBorderClass = (score) => {
    if (score >= 80) return 'border-emerald-200 dark:border-emerald-800/40';
    if (score >= 60) return 'border-amber-200 dark:border-amber-800/40';
    return 'border-rose-200 dark:border-rose-800/40';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white">
            {getGreeting()}, {user?.name || 'Candidate'}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Analyze your resume compatibility and track progress to your dream job.
          </p>
        </div>
        <Link
          to="/dashboard/upload"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/10 hover:shadow-brand-500/25 transition-all"
        >
          <UploadCloud className="h-5 w-5" />
          Upload New Resume
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900/60 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-brand-50 dark:bg-brand-950/30 rounded-2xl text-brand-500 dark:text-brand-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Total Resumes
            </span>
            <span className="text-2xl font-extrabold font-outfit text-slate-800 dark:text-white">
              {totalScans}
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900/60 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-indigo-500 dark:text-indigo-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Average ATS Score
            </span>
            <span className="text-2xl font-extrabold font-outfit text-slate-800 dark:text-white">
              {averageScore}%
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900/60 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl text-emerald-500 dark:text-emerald-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Highest Score
            </span>
            <span className="text-2xl font-extrabold font-outfit text-slate-800 dark:text-white">
              {maxScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Recent Audits */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-white">
            Recent Audits
          </h3>
          {totalScans > 5 && (
            <Link 
              to="/dashboard/history" 
              className="text-sm font-bold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="border border-slate-200 dark:border-dark-800 rounded-3xl bg-white dark:bg-dark-900/60 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading history...</div>
          ) : totalScans === 0 ? (
            <div className="p-12 text-center space-y-4">
              <FileText className="h-12 w-12 text-slate-300 dark:text-dark-800 mx-auto" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No resumes scanned yet.</p>
              <Link
                to="/dashboard/upload"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-600"
              >
                Scan your first resume
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-dark-800/60">
              {history.slice(0, 5).map((item) => (
                <div 
                  key={item._id}
                  className="p-5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-dark-800/25 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2.5 bg-slate-100 dark:bg-dark-800 rounded-xl text-slate-500 dark:text-slate-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs">
                        {item.resumeName}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Score Badge */}
                    <span className={`px-3 py-1.5 rounded-xl font-bold font-outfit text-sm border ${getScoreColorClass(item.atsScore)} ${getScoreBorderClass(item.atsScore)}`}>
                      {item.atsScore}%
                    </span>
                    <Link
                      to={`/dashboard/analysis/${item._id}`}
                      className="p-2 rounded-xl border border-slate-200 dark:border-dark-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800 transition-all"
                      title="View Report"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
