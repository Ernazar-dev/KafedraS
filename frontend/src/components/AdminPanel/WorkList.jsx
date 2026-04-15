import React, { useEffect, useState } from "react";
import WorkForm from "./WorkForm.jsx";
import axios from "../../api/axios";
import { Edit3, Trash2, Eye } from "lucide-react";

const BADGE_COLORS = {
  maqalalar: "bg-blue-100 text-blue-700",
  tezisler: "bg-purple-100 text-purple-700",
  dgular: "bg-green-100 text-green-700",
  patentler: "bg-amber-100 text-amber-700",
  proyektler: "bg-rose-100 text-rose-700",
};

const WorkList = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDeleteId, setShowDeleteId] = useState(null);

  const loadWorks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/works/my");
      setWorks(res.data);
    } catch (error) {
      console.error(error);
      setWorks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWorks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/works/${id}`);
      setWorks((prev) => prev.filter((w) => w.id !== id));
      setShowDeleteId(null);
    } catch (error) {
      alert("Óshiriwde qátelik");
    }
  };

  return (
    <div>
      <WorkForm
        fetchWorks={loadWorks}
        editing={editing}
        setEditing={setEditing}
      />

      {/* ─── LIST CARD ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="w-1 h-5 bg-[#02135e] rounded-full inline-block" />
            <h2 className="text-[16px] font-extrabold text-[#02135e]">
            Meniń ilimiy islerim
            </h2>
          </div>
          <span className="bg-[#02135e]/10 text-[#02135e] text-[12px] font-bold px-3 py-1 rounded-full">
            {works.length} ta
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-3 border-[#02135e]/20 border-t-[#02135e] rounded-full animate-spin" />
            <span className="text-slate-400 text-sm">Júklenip atır...</span>
          </div>
        ) : works.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl select-none">📄</span>
            <p className="text-slate-400 text-sm">
              Házirshe hesh qanday jumıs joq.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-slate-100">
                  {["Tema", "Kategoriya", "Sáne", "Fayl", "Ámeller"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap ${i === 4 ? "text-right" : ""}`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {works.map((work) => (
                  <tr
                    key={work.id}
                    className="hover:bg-slate-50 transition-colors duration-100"
                  >
                    {/* Title */}
                    <td className="px-4 py-3 max-w-[240px]">
                      <p className="text-[13px] font-bold text-[#02135e] line-clamp-1">
                        {work.title}
                      </p>
                      {work.description && (
                        <p className="text-[12px] text-slate-400 line-clamp-1 mt-0.5">
                          {work.description.length > 50
                            ? work.description.substring(0, 50) + "..."
                            : work.description}
                        </p>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${BADGE_COLORS[work.category] || "bg-slate-100 text-slate-600"}`}
                      >
                        {work.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-[13px] text-slate-500 whitespace-nowrap">
                      {new Date(work.date).toLocaleDateString()}
                    </td>

                    {/* File */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {work.files ? (
                        <a
                          href={work.files}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-[12px] font-semibold text-[#02135e] hover:underline"
                        >
                          <Eye size={13} /> Kóriw
                        </a>
                      ) : (
                        <span className="text-[12px] text-slate-300 italic">
                          Fayl joq
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditing(work);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="w-8 h-8 rounded-xl border-2 border-[#02135e]/20 text-[#02135e] flex items-center justify-center hover:bg-[#02135e] hover:text-white hover:border-[#02135e] transition-all duration-150"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setShowDeleteId(work.id)}
                          className="w-8 h-8 rounded-xl border-2 border-red-200 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-150"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── DELETE MODAL ─── */}
      {showDeleteId && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDeleteId(null)}
          style={{ animation: "fadeIn 0.2s ease" }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[320px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideUp 0.25s ease" }}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-[#02135e] to-red-500" />
            <div className="px-6 py-6 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <Trash2 size={26} className="text-red-500" />
              </div>
              <h3 className="text-[17px] font-extrabold text-[#02135e] mb-1">
                Óshiriwdi tastıyıqlaw
              </h3>
              <p className="text-slate-400 text-[13px] text-center mb-6">
                Bul jumıs óshiriledi. Bul ámeldi qaytarıp bolmaydı.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-[14px] hover:bg-slate-50 transition-colors"
                >
                  Biykar etiw
                </button>
                <button
                  onClick={() => handleDelete(showDeleteId)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-[14px] active:scale-95 transition-all shadow-md shadow-red-500/20"
                >
                  Óshiriw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default WorkList;
