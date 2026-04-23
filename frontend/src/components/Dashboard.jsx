import { useState, useEffect } from 'react';
import MetricCard from './MetricCard';

export default function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/metrics')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load metrics", err);
        setError("Unable to connect to the backend server. Please ensure it's running on port 3000.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
          <p className="mt-4 text-slate-400 font-medium tracking-wide">Calculating metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-surface p-8 rounded-2xl border border-red-500/30 text-center max-w-md">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Developer Velocity <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Insights</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Going beyond raw numbers. Understand what your metrics mean and the exact next steps to improve your team's performance.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {metrics.map((metric, index) => (
          <div key={metric.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: \`\${index * 100}ms\` }}>
            <MetricCard 
              title={metric.title}
              value={metric.value}
              interpretation={metric.interpretation}
              nextStep={metric.nextStep}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
