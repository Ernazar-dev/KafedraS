import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, User } from "lucide-react";
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

export default function NewsSection() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [news, setNews] = useState([]);
  const [activeNews, setActiveNews] = useState(null);

  useEffect(() => {
    api
      .get("/news")
      .then((res) => setNews(res.data.data || res.data))
      .catch((err) => console.error("API xatosi:", err));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id) {
      setActiveNews(null);
      api
        .get(`/news/${id}`)
        .then((res) => setActiveNews(res.data))
        .catch((err) => console.error("Xatolik:", err));
    }
  }, [id]);

  if (!activeNews && !news.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-[#02135e] rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 text-sm">Júklenbekte...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-16 font-sans text-slate-900">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Klassik Orqaga qaytish tugmasi */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#02135e] font-bold text-xs uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft size={16} /> Artqa qaytıw
        </button>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ─── ASOSIY MAZMUN ─── */}
          <main className="flex-1 min-w-0 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            {activeNews ? (
              <article>
                {/* Rasm qismi */}
                <div className="w-full h-[250px] sm:h-[400px] bg-slate-100 border-b border-slate-200">
                  <img
                    src={getImageUrl(activeNews.file)}
                    alt={activeNews.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                <div className="p-6 sm:p-10">
                  {/* Meta ma'lumotlar */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-slate-400 text-[12px] font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                      <Clock size={14} className="text-[#02135e]" />
                      {formatDateTime(activeNews.date)}
                    </div>
                    {activeNews.authorName && (
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-[#02135e]" />
                        {activeNews.authorName}
                      </div>
                    )}
                  </div>

                  {/* Sarlavha */}
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#02135e] leading-tight mb-8">
                    {activeNews.title}
                  </h1>

                  {/* Matn mazmuni (whitespace-pre-line abzatslar uchun) */}
                  <div
                    className="text-[15px] sm:text-[16px] text-slate-700 leading-relaxed whitespace-pre-line prose max-w-none"
                    dangerouslySetInnerHTML={
                      activeNews.content && activeNews.content.includes("<")
                        ? { __html: activeNews.content }
                        : undefined
                    }
                  >
                    {activeNews.content && !activeNews.content.includes("<")
                      ? activeNews.content
                      : null}
                  </div>
                </div>
              </article>
            ) : (
              <div className="p-20 text-center">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-[#02135e] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400 text-sm">
                  Maǵlıwmat júklenbekte...
                </p>
              </div>
            )}
          </main>

          {/* ─── SIDEBAR (SO'NGGI YANGILIKLAR) ─── */}
          <aside className="w-full lg:w-[350px] shrink-0">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-sm font-bold text-[#02135e] uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#02135e]" />
                  Sońǵı jańalıqlar
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {news.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/news/${item.id}`)}
                    className={`flex gap-4 px-4 py-4 cursor-pointer transition-colors ${
                      Number(id) === item.id
                        ? "bg-slate-50 border-l-4 border-l-[#02135e]"
                        : "hover:bg-slate-50 border-l-4 border-l-transparent"
                    }`}
                  >
                    {/* Kichik rasm */}
                    <div className="w-20 h-16 rounded border border-slate-200 overflow-hidden shrink-0 bg-slate-50">
                      <img
                        src={getImageUrl(item.file)}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale-[30%]"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>

                    {/* Qisqacha ma'lumot */}
                    <div className="flex flex-col justify-center min-w-0">
                      <h4
                        className={`text-[13px] font-bold leading-snug line-clamp-2 mb-1 ${
                          Number(id) === item.id
                            ? "text-[#02135e]"
                            : "text-slate-700 hover:text-[#02135e]"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        {new Date(item.date)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, ".")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Qo'shimcha blok (Klassik uslubda) */}
            <div className="mt-6 p-6 bg-[#02135e] rounded-lg text-white">
              <h4 className="text-sm font-bold mb-2 uppercase tracking-wider">
                Kafedra Jańalıqları
              </h4>
              <p className="text-xs text-blue-100 leading-relaxed mb-4">
                Eń sońǵı maǵlıwmatlar hám járiyalawlardan xabardar bolıw ushın
                bólimdi baqlap barıń.
              </p>
              <button
                onClick={() => navigate("/news")}
                className="text-[11px] font-bold uppercase border border-blue-400 px-4 py-2 rounded hover:bg-white hover:text-[#02135e] transition-all"
              >
                Barlıq jańalıqlar
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
