import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, AlertCircle, Trash2, HelpCircle } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    
    const allowedExtensions = ['pdf', 'docx'];
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(extension)) {
      setError('Invalid file type. Only PDF and DOCX files are allowed.');
      return false;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit. Please upload a smaller file.');
      return false;
    }

    setError('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drag a resume file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const response = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/dashboard/analysis/${response.data._id}`);
    } catch (err) {
      console.error('Upload & analysis failed:', err);
      setError(err.response?.data?.message || 'Failed to complete resume analysis. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center border border-slate-200 dark:border-dark-800 rounded-3xl bg-white dark:bg-dark-900/60 shadow-sm p-10">
        <Loader message="Analyzing your resume..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white">
          Upload and Scan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
          Scan your resume individually or match it against a specific job role description.
        </p>
      </div>

      <div className="max-w-3xl">
        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Drag & Drop Container */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
              dragActive
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/10'
                : 'border-slate-300 dark:border-dark-800 bg-white dark:bg-dark-900/40 hover:border-brand-400 dark:hover:border-dark-700 hover:bg-slate-50/50 dark:hover:bg-dark-900/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.docx"
            />

            {!file ? (
              <div className="text-center space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-slate-50 dark:bg-dark-800 text-slate-400 dark:text-slate-500 transition-colors">
                  <UploadCloud className="h-8 w-8 text-brand-500 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                    Drag and drop your resume file here
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
                    Supports PDF and DOCX files up to 5MB
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 rounded-xl"
                >
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 w-full max-w-sm p-4 rounded-2xl bg-slate-50 dark:bg-dark-950/60 border border-slate-100 dark:border-dark-850">
                <div className="p-3 bg-brand-500 text-white rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200 dark:hover:bg-dark-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Job Description Paste Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Target Job Description (Optional)
              </label>
              <div className="group relative flex items-center text-slate-400 hover:text-brand-500">
                <HelpCircle className="h-4.5 w-4.5 cursor-pointer" />
                <span className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all leading-relaxed z-20">
                  Paste the JD requirements exactly to get a customized compatibility score mapping match keywords.
                </span>
              </div>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description or requirement bullet points here..."
              rows={6}
              className="w-full p-4 rounded-3xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-md shadow-brand-500/10 hover:shadow-brand-500/25 transition-all"
          >
            Start AI Analysis
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
