import React, { useEffect, useState } from 'react';

const ANALYSIS_STEPS = [
  'Extracting resume text...',
  'Parsing structures and contact info...',
  'Evaluating visual layout and formatting...',
  'Analyzing keyword optimization...',
  'Checking achievements and action verb impact...',
  'Running compatibility algorithms...',
  'Finalizing ATS score and recommendations...',
];

const Loader = ({ message = 'Analyzing Resume' }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prevIndex) => (prevIndex + 1) % ANALYSIS_STEPS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-md animate-pulse"></div>
        {/* Spinner */}
        <div className="h-16 w-16 rounded-full border-4 border-slate-200 dark:border-dark-800 border-t-brand-500 border-r-brand-400 animate-spin"></div>
      </div>
      
      <h3 className="text-xl font-semibold font-outfit text-slate-800 dark:text-slate-100 mb-2">
        {message}
      </h3>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium min-h-[20px] transition-all duration-300">
        {ANALYSIS_STEPS[stepIndex]}
      </p>

      <div className="w-48 bg-slate-200 dark:bg-dark-800 h-1.5 rounded-full overflow-hidden mt-4">
        <div className="h-full bg-brand-500 animate-[pulse-subtle_2s_infinite] rounded-full" style={{ width: '80%' }}></div>
      </div>
    </div>
  );
};

export default Loader;
