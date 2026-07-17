import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight, 
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Landing = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI ATS Scoring',
      description: 'Instant parsing and analysis of your resume matching keyword density and layout requirements.',
      color: 'from-amber-400 to-orange-500',
    },
    {
      icon: TrendingUp,
      title: 'Detailed Breakdown',
      description: 'Get separate marks for formatting, word impact, keywords, and structural hierarchy.',
      color: 'from-brand-500 to-indigo-500',
    },
    {
      icon: Briefcase,
      title: 'Job Description Matching',
      description: 'Paste any job description to evaluate how well your resume matches that specific job.',
      color: 'from-emerald-400 to-teal-500',
    },
    {
      icon: FileText,
      title: 'Multi-Format Support',
      description: 'Easily upload PDF or DOCX file formats with size validation up to 5MB.',
      color: 'from-cyan-400 to-blue-500',
    },
  ];



  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 flex-1">
        {/* Background glow designs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-10 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          {/* Tagline pill */}
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-subtle">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Resume Optimization
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold font-outfit tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Stop Getting Ghosted. Get{' '}
            <span className="bg-gradient-to-r from-brand-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent text-glow-brand">
              ATS Score & Audit
            </span>{' '}
            in Seconds.
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
            Upload your resume, analyze it against target job descriptions, discover missing industry keywords, and download a premium ATS report optimized to pass scanners.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 hover:-translate-y-0.5 transition-all duration-200"
            >
              Scan Your Resume
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 dark:border-dark-800 bg-white/60 dark:bg-dark-900/40 hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-700 dark:text-slate-200 font-semibold text-base transition-all duration-200"
            >
              See How It Works
            </a>
          </div>


        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-dark-900 transition-colors duration-300 relative border-t border-slate-200/50 dark:border-dark-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit tracking-tight mb-4">
              Unlock Your Resume's Potential
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              We leverage Gemini Generative AI to mimic professional corporate screeners, giving you immediate recommendations to stand out.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx}
                  className="group relative p-8 rounded-3xl border border-slate-100 dark:border-dark-800 bg-slate-50/50 dark:bg-dark-950/20 hover:bg-white dark:hover:bg-dark-900 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-slate-100 mb-3 group-hover:text-brand-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-dark-900 bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-500 rounded-xl text-white">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <span className="font-outfit text-lg font-bold">ATS Resume Analyzer</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; 2026 AI Resume Analyzer. Built for premium screening preparation. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors">Privacy</a>
            <a href="#features" className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors">Terms</a>
            <a href="#features" className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
