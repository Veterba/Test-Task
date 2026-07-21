export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-accent-400" />
      <span className="text-white/80">{label}</span>
    </div>
  )
}
