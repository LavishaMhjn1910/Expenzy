export default function StatCard({ label, value, accent = 'mint', hint }) {
  const accentClass = {
    mint: 'text-mint',
    gold: 'text-gold',
    rust: 'text-rust',
    paper: 'text-paper',
  }[accent];

  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-wider text-muted mb-2">{label}</p>
      <p className={`amount text-2xl font-medium ${accentClass}`}>{value}</p>
      {hint && <p className="text-xs text-muted mt-1.5">{hint}</p>}
    </div>
  );
}
