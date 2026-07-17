import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Trash2, ArrowRight, AlertCircle, FileSearch } from 'lucide-react';
import api from '../services/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/resume/history');
        setHistory(response.data);
      } catch (err) {
        console.error('Fetch history error:', err);
        setError('Failed to fetch your scanning history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    setDeleteId(id);
    setDeleting(true);
    try {
      await api.delete(`/resume/history/${id}`);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Delete history error:', err);
      alert('Failed to delete report.');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 dark:border-emerald-800/40';
    if (score >= 60) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-250 dark:border-amber-800/40';
    return 'text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-250 dark:border-rose-800/40';
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 rounded-full border-4 border-slate-200 dark:border-dark-800 border-t-brand-500 animate-spin mx-auto"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading history list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white">
          Scan History
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
          Review and compare all your previously generated AI resume analysis reports.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {history.length === 0 ? (
        <div className="p-16 border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900/60 rounded-3xl text-center space-y-6 shadow-sm">
          <FileSearch className="h-16 w-16 text-slate-300 dark:text-dark-800 mx-auto" />
          <div>
            <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-slate-200">
              No Scans Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm mx-auto font-medium">
              You haven't analyzed any resumes yet. Start by uploading a file to scan.
            </p>
          </div>
          <Link
            to="/dashboard/upload"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md"
          >
            Upload Resume
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div
              key={item._id}
              className="group relative p-6 border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900/60 hover:bg-white dark:hover:bg-dark-900 rounded-3xl shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="p-3 bg-slate-100 dark:bg-dark-955 rounded-2xl text-slate-500 dark:text-slate-400">
                    <FileText className="h-6 w-6" />
                  </div>

                  <span className={`px-3 py-1 rounded-xl font-bold font-outfit text-sm border ${getScoreColorClass(item.atsScore)}`}>
                    {item.atsScore}%
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-805 dark:text-white group-hover:text-brand-500 transition-colors truncate">
                    {item.resumeName}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-450 dark:text-slate-500 mt-1 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-dark-800/80">
                <Link
                  to={`/dashboard/analysis/${item._id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-dark-950/80 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 text-xs font-bold transition-all border border-slate-200/60 dark:border-dark-800/60"
                >
                  View Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deleting && deleteId === item._id}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-dark-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                  title="Delete Report"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
