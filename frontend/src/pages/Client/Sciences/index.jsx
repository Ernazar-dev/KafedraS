import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import {
  FaSearch,
  FaTimes,
  FaPlayCircle,
  FaFileDownload,
  FaBookOpen,
} from "react-icons/fa";
import { getImageUrl } from "../../../api/imageUrl";

const DEFAULT_IMAGE = "https://tuit.uz/static/images/logo.png";

const Sciences = () => {
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects");
        setSubjects(res.data || []);
      } catch (err) {
        console.error("API Qatesi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter((subj) =>
    subj.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSubject = subjects.find((s) => s.id === openId);

  const fixUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `https://${url}`;
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-[#02135e] rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 text-sm">Júklenbekte...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20 font-sans text-slate-900">
      {/* ─── HEADER ─── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-[40]">
        <div className="max-w-[1200px] mx-auto px-4 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#02135e] tracking-tight">
              OQÍW PÁNLERI
            </h1>
            <div className="h-1 w-12 bg-[#02135e] mt-1" />
          </div>

          {/* Klassik Search Bar */}
          <div className="relative w-full md:w-[320px]">
            <input
              type="text"
              placeholder="Pándi izlew..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-4 pr-10 rounded border border-slate-300 bg-white text-sm focus:outline-none focus:border-[#02135e] transition-colors placeholder-slate-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-slate-400 hover:text-red-500"
                >
                  <FaTimes size={14} />
                </button>
              )}
              <FaSearch className="text-slate-400" size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── GRID ─── */}
      <div className="max-w-[1200px] mx-auto px-4 mt-10">
        {filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSubjects.map((subj) => (
              <div
                key={subj.id}
                onClick={() => setOpenId(subj.id)}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-[160px] bg-slate-100">
                  <img
                    src={getImageUrl(subj.images) || DEFAULT_IMAGE}
                    alt={subj.name}
                    className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-md font-bold text-[#02135e] mb-2 leading-tight line-clamp-2">
                    {subj.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                    {subj.description ||
                      "Bul pán haqqında maǵlıwmat kiritilmegen."}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center text-[#02135e] font-bold text-xs">
                    TOLÍQ MAǴLÍWMAT <FaBookOpen className="ml-2" size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-lg">
            <p className="text-slate-400">Hesh qanday maǵlıwmat tabılmadı.</p>
          </div>
        )}
      </div>

      {/* ─── MODAL (Klassik) ─── */}
      {openId && selectedSubject && (
        <div
          className="fixed inset-0 bg-black/60 z-[2000] flex items-center justify-center p-4"
          onClick={() => setOpenId(null)}
        >
          <div
            className="w-full max-w-[650px] bg-white rounded shadow-xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-[#02135e] uppercase truncate pr-4">
                {selectedSubject.name}
              </h2>
              <button
                onClick={() => setOpenId(null)}
                className="text-slate-400 hover:text-black transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-full md:w-1/3 h-[140px] bg-slate-100 rounded border border-slate-200 overflow-hidden">
                  <img
                    src={getImageUrl(selectedSubject.images) || DEFAULT_IMAGE}
                    alt={selectedSubject.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                    Túsindirme
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedSubject.description || "Maǵlıwmat joq."}
                  </p>
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Oqıw resursları
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Video */}
                  <a
                    href={fixUrl(selectedSubject.video)}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-3 p-3 border rounded transition-colors ${
                      selectedSubject.video
                        ? "border-slate-300 hover:bg-slate-50"
                        : "opacity-40 pointer-events-none border-slate-100"
                    }`}
                  >
                    <FaPlayCircle className="text-red-600" size={18} />
                    <span className="text-sm font-semibold text-slate-800">
                      Video sabaqlar
                    </span>
                  </a>

                  {/* File */}
                  <a
                    href={selectedSubject.file}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-3 p-3 border rounded transition-colors ${
                      selectedSubject.file
                        ? "border-slate-300 hover:bg-slate-50"
                        : "opacity-40 pointer-events-none border-slate-100"
                    }`}
                  >
                    <FaFileDownload className="text-[#02135e]" size={18} />
                    <span className="text-sm font-semibold text-slate-800">
                      Oqıw materialı (PDF)
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setOpenId(null)}
                className="px-4 py-1.5 border border-slate-300 rounded text-xs font-bold uppercase hover:bg-white transition-colors"
              >
                Jabıw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sciences;
