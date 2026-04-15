import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaUserTie,
  FaFileAlt,
} from "react-icons/fa";

const CATEGORY_STYLES = {
  maqalalar: "bg-blue-100 text-blue-700",
  tezisler: "bg-violet-100 text-violet-700",
  dgular: "bg-emerald-100 text-emerald-700",
  patentler: "bg-amber-100 text-amber-700",
  proyektler: "bg-rose-100 text-rose-700",
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function HomeWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/works", { params: { page: 1, limit: 3 } })
      .then((res) => setWorks(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1300px] mx-auto px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-7 bg-[#02135e] rounded-full" />
              <h2 className="text-2xl font-extrabold text-[#02135e] m-0 tracking-tight">
                Sońǵı ilimiy jumıslar
              </h2>
            </div>
            <p className="text-slate-500 text-sm ml-3.5">
              Kafedra professor-oqıtıwshıları hám studentleriniń jumısları
            </p>
          </div>
          <Link
            to="/works"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#02135e] hover:gap-2.5 transition-all no-underline whitespace-nowrap mt-1"
          >
            Barlıǵın kóriw <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#02135e] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : works.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {works.map((item) => (
              <div
                key={item.id}
                className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md hover:border-slate-200 transition-all duration-200 group"
              >
                {/* Top: category + date */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-lg capitalize ${
                      CATEGORY_STYLES[item.category] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <FaCalendarAlt className="text-[10px]" />
                    {formatDate(item.date)}
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-2 flex-1">
                  <Link
                    to="/works"
                    className="text-sm font-bold text-[#02135e] group-hover:text-blue-700 line-clamp-2 no-underline leading-snug transition-colors"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {item.description
                      ? item.description.slice(0, 120) + "..."
                      : "Qosımsha maǵlıwmat joq."}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <FaUserTie className="text-[#02135e]/50" />
                    <span className="font-medium">
                      {item.authorName || "Admin"}
                    </span>
                  </div>
                  <Link
                    to="/works"
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#02135e] bg-[#02135e]/8 hover:bg-[#02135e] hover:text-white px-3 py-1.5 rounded-lg transition-all no-underline"
                  >
                    To'liq <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-[#f8fafc] rounded-2xl">
            <FaFileAlt size={36} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">Házirshe maǵlıwmat joq</p>
          </div>
        )}

        {/* Mobile "view all" button */}
        <div className="flex justify-center mt-8 sm:hidden">
          <Link
            to="/works"
            className="flex items-center gap-2 bg-[#02135e] text-white text-sm font-semibold px-6 py-2.5 rounded-xl no-underline hover:bg-[#03197a] transition-colors"
          >
            Barlıǵın kóriw <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
}
