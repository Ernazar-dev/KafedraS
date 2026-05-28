import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import { BsSearch, BsX } from "react-icons/bs";
import { getImageUrl } from "../../../api/imageUrl";

// Sanani formatlash uchun yordamchi funksiya
const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}`;
};

export default function PremiumNews({ heading = "JAŃALÍQLAR" }) {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/news")
      .then((res) => {
        const data = res.data.data || res.data;
        setNews(data);
      })
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredNews = news.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-[#02135e] rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 text-sm">Júklenbekte...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20 font-sans text-slate-900">
      {/* ─── HEADER (Klassik uslubda) ─── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-[40]">
        <div className="max-w-[1200px] mx-auto px-4 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#02135e] tracking-tight uppercase">
              {heading}
            </h1>
            <div className="h-1 w-12 bg-[#02135e] mt-1" />
          </div>

          {/* Tartibli Search Bar */}
          <div className="relative w-full md:w-[320px]">
            <input
              type="text"
              placeholder="Jańalıqlardan izlew..."
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
                  <BsX size={18} />
                </button>
              )}
              <BsSearch className="text-slate-400" size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── NEWS GRID ─── */}
      <div className="max-w-[1200px] mx-auto px-4 mt-10">
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredNews.map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative h-[160px] bg-slate-100 overflow-hidden">
                  <img
                    src={getImageUrl(item.file)}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  {/* Klassik sana badge'i */}
                  <div className="absolute top-2 left-2 bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-[#02135e] uppercase">
                    {new Date(item.date)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, ".")}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col flex-1">
                  {/* To'liq sana */}
                  <span className="text-[11px] text-slate-400 mb-2 font-medium">
                    {formatDateTime(item.date)}
                  </span>

                  <h3 className="text-md font-bold text-[#02135e] mb-2 leading-tight line-clamp-2 group-hover:text-blue-800 transition-colors">
                    {item.title}
                  </h3>

                  {/* Tavsif - whitespace-pre-line abzatslarni saqlaydi */}
                  <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3 mb-4 flex-1 whitespace-pre-line">
                    {item.content
                      ? item.content
                          .replace(/<[^>]*>?/gm, "")
                          .substring(0, 100) + "..."
                      : "Batafsil maǵlıwmat..."}
                  </p>

                  {/* Footer Link */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#02135e] uppercase tracking-wider">
                      Oqıw
                    </span>
                    <span className="text-[#02135e] text-lg group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed border-slate-200 rounded-lg">
            <p className="text-slate-400 font-medium">Hesh nárse tabılmadı.</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-sm text-[#02135e] font-bold underline"
              >
                Izlewdi tazalaw
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
