import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import {
  FaFilter,
  FaFilePdf,
  FaCalendarAlt,
  FaUserTie,
  FaDownload,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaFlask,
} from "react-icons/fa";

const CATEGORIES = [
  { value: "", label: "Barlıǵı" },
  { value: "maqalalar", label: "Maqalalar" },
  { value: "tezisler", label: "Tezisler" },
  { value: "dgular", label: "DGUlar" },
  { value: "patentler", label: "Patentler" },
  { value: "proyektler", label: "Proyektler" },
];

// Badge rang mapping
const BADGE_COLORS = {
  maqalalar: "bg-blue-100 text-blue-700",
  tezisler: "bg-purple-100 text-purple-700",
  dgular: "bg-green-100 text-green-700",
  patentler: "bg-amber-100 text-amber-700",
  proyektler: "bg-rose-100 text-rose-700",
  default: "bg-slate-100 text-slate-600",
};

const months = [
  { value: "01", label: "Yanvar" },
  { value: "02", label: "Fevral" },
  { value: "03", label: "Mart" },
  { value: "04", label: "Aprel" },
  { value: "05", label: "May" },
  { value: "06", label: "Iyun" },
  { value: "07", label: "Iyul" },
  { value: "08", label: "Avgust" },
  { value: "09", label: "Sentabr" },
  { value: "10", label: "Oktabr" },
  { value: "11", label: "Noyabr" },
  { value: "12", label: "Dekabr" },
];

const LIMIT = 9;

const Works = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState(null);
  const [filters, setFilters] = useState({ category: "", month: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchWorks = async () => {
      setLoading(true);
      try {
        const params = { page, limit: LIMIT };
        if (filters.category) params.category = filters.category;
        if (filters.month) {
          const [y, m] = filters.month.split("-");
          params.year = y;
          params.month = m;
        }
        const res = await api.get("/works", { params });
        setWorks(res.data.data);
        setTotalPages(Math.ceil(res.data.total / LIMIT));
      } catch (error) {
        console.error("Qatelik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, [filters, page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getBadgeClass = (category) =>
    BADGE_COLORS[category] || BADGE_COLORS.default;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      {/* ─── HERO ─── */}
      <div className="bg-white shadow-sm mb-8">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1 h-6 bg-[#02135e] rounded-full inline-block" />
                <span className="text-[12px] font-semibold text-[#02135e]/50 uppercase tracking-widest">
                  <h1 className="text-[22px] sm:text-[20px] font-extrabold text-[#02135e] leading-tight">
                    Ilimiy jumıslar
                  </h1>
                </span>
              </div>

              <p className="text-[13px] sm:text-[14px] text-slate-500 mt-1 max-w-[480px] leading-relaxed">
                Kafedra professor-oqıtıwshıları hám studentleriniń ilimiy
                jumısları
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Category */}
              <div className="flex items-center gap-2 bg-[#f0f4ff] border border-[#02135e]/10 rounded-xl px-3 py-2">
                <FaFilter className="text-[#02135e] text-xs shrink-0" />
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="bg-transparent text-[13px] font-semibold text-[#02135e] focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div className="flex items-center gap-2 bg-[#f0f4ff] border border-[#02135e]/10 rounded-xl px-3 py-2">
                <FaCalendarAlt className="text-[#02135e] text-xs shrink-0" />
                <select
                  name="month"
                  value={filters.month}
                  onChange={handleFilterChange}
                  className="bg-transparent text-[13px] font-semibold text-[#02135e] focus:outline-none cursor-pointer"
                >
                  <option value="">Barlıǵı</option>
                  {years.map((y) => (
                    <optgroup key={y} label={String(y)}>
                      {months.map((m) => (
                        <option key={m.value} value={`${y}-${m.value}`}>
                          {m.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="max-w-[1200px] mx-auto px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-[#02135e]/20 border-t-[#02135e] rounded-full animate-spin" />
            <p className="text-[#02135e]/50 text-sm font-medium tracking-widest uppercase">
              Júklenip atır...
            </p>
          </div>
        ) : works.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {works.map((work) => (
                <div
                  key={work.id}
                  onClick={() => setSelectedWork(work)}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#02135e]/20 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
                >
                  {/* Card top accent */}
                  <div className="h-1 w-full bg-gradient-to-r from-[#02135e] to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="p-5 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${getBadgeClass(
                          work.category
                        )}`}
                      >
                        {work.category}
                      </span>
                      <span className="text-[12px] text-slate-400 font-medium">
                        {new Date(work.date).getFullYear()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] font-bold text-[#02135e] leading-snug mb-3 line-clamp-2 flex-1">
                      {work.title}
                    </h3>

                    {/* Author */}
                    <div className="flex items-center gap-2 text-[12px] text-slate-500 mb-3">
                      <FaUserTie className="text-[#02135e]/40 shrink-0" />
                      <span className="line-clamp-1">
                        {work.authorName || "Avtor kórsetilmegen"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 mb-4">
                      {work.description
                        ? work.description.substring(0, 80) + "..."
                        : "Táriypleme joq"}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                      <span className="text-[12px] font-semibold text-[#02135e] group-hover:underline">
                        Tolıq →
                      </span>
                      {work.files && (
                        <FaFilePdf className="text-red-400 text-base" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── PAGINATION ─── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="w-9 h-9 rounded-xl border-2 border-[#02135e]/20 flex items-center justify-center text-[#02135e] hover:bg-[#02135e] hover:text-white hover:border-[#02135e] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="text-xs" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-[13px] font-bold transition-all duration-200 ${
                          page === p
                            ? "bg-[#02135e] text-white shadow-md"
                            : "border-2 border-[#02135e]/20 text-[#02135e] hover:border-[#02135e]/50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="w-9 h-9 rounded-xl border-2 border-[#02135e]/20 flex items-center justify-center text-[#02135e] hover:bg-[#02135e] hover:text-white hover:border-[#02135e] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <FaFlask className="text-5xl text-slate-200" />
            <h3 className="text-[#02135e]/50 text-base font-semibold">
              Házirshe maǵlıwmat tabılmadı
            </h3>
            <p className="text-slate-400 text-sm">Filtrlerdi ózgertip kóriń</p>
          </div>
        )}
      </div>

      {/* ─── MODAL ─── */}
      {selectedWork && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedWork(null)}
          style={{ animation: "fadeIn 0.2s ease" }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[560px] overflow-hidden max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideUp 0.25s ease" }}
          >
            {/* Modal top bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#02135e] to-blue-500" />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${getBadgeClass(
                      selectedWork.category
                    )}`}
                  >
                    {selectedWork.category}
                  </span>
                  <span className="text-[12px] text-slate-400 font-medium">
                    {formatDate(selectedWork.date)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedWork(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-500 hover:text-white text-slate-500 flex items-center justify-center transition-colors duration-200 shrink-0"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              {/* Title */}
              <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#02135e] leading-snug mb-5">
                {selectedWork.title}
              </h2>

              {/* Divider */}
              <div className="h-px bg-slate-100 mb-4" />

              {/* Info rows */}
              <div className="flex flex-col gap-2.5 mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-24 text-[12px] font-semibold text-slate-400 uppercase tracking-wide shrink-0">
                    Avtor
                  </span>
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-[#02135e]">
                    <FaUserTie className="text-[#02135e]/40" />
                    {selectedWork.authorName || "Belgisiz"}
                  </div>
                </div>
                {selectedWork.authorPosition && (
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-[12px] font-semibold text-slate-400 uppercase tracking-wide shrink-0">
                      Lawazım
                    </span>
                    <span className="text-[13px] text-slate-700">
                      {selectedWork.authorPosition}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedWork.description && (
                <div className="bg-[#f8fafc] rounded-xl p-4 mb-5 border border-slate-100">
                  <p className="text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                    {selectedWork.description}
                  </p>
                </div>
              )}

              {/* Download */}
              {selectedWork.files && (
                <a
                  href={selectedWork.files}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#02135e] text-white font-semibold text-[14px] hover:bg-blue-700 transition-colors duration-200"
                >
                  <FaDownload className="text-sm" />
                  Fayldı júklep alıw
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Works;
