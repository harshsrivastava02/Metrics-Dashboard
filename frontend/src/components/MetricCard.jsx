export default function MetricCard({ title, value, interpretation, nextStep }) {
  return (
    <div className="bg-surface/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-700 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 group">
      <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mt-2">{value}</p>
      
      <div className="mt-8 space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Interpretation</h4>
          <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">{interpretation}</p>
        </div>
        
        <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50 group-hover:bg-slate-800 transition-colors duration-300">
          <h4 className="text-xs font-semibold text-accent uppercase flex items-center gap-2 tracking-wide">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Next Step
          </h4>
          <p className="text-sm text-slate-200 mt-1.5 leading-relaxed">{nextStep}</p>
        </div>
      </div>
    </div>
  );
}
