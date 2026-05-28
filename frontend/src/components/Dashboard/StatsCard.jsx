export default function StatsCard({ title, value, icon, color }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 px-5 py-4 transition-shadow duration-200 hover:shadow-md"
      style={{ borderLeft: `5px solid ${color}` }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: `${color}18`, color: color }}
      >
        {icon}
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-0">
        <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide truncate">
          {title}
        </p>
        <h2 className="text-[24px] font-extrabold text-[#02135e] leading-tight">
          {value}
        </h2>
      </div>
    </div>
  );
}