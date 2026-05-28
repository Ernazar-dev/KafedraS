import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { getImageUrl, imgFallback } from "../../../api/imageUrl";
import { FaPhoneAlt, FaTimes, FaUserTie, FaChevronRight } from "react-icons/fa";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/teachers")
      .then((r) => setTeachers(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleImgError = (e) => {
    imgFallback(e);
    if (!e.target.src.includes("localhost")) e.target.src = DEFAULT_AVATAR;
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-[#02135e] rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans text-slate-900">
      {/* ─── PROFESSIONAL HEADER ─── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-1 h-8 bg-[#02135e]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[#02135e] tracking-tight">
              KAFEDRA USTAZLARÍ
            </h1>
          </div>
          <p className="text-slate-500 text-sm sm:text-base ml-5">
            Kafedramızdıń tájiriybeli professor-oqıtıwshıları hám xızmetkerleri
          </p>
        </div>
      </div>

      {/* ─── TEACHERS GRID ─── */}
      <div className="max-w-[1200px] mx-auto px-4 mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              onClick={() => setSelected(teacher)}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#02135e]/30 transition-all duration-300 cursor-pointer flex flex-col group"
            >
              {/* Photo */}
              <div className="aspect-[4/5] bg-slate-50 overflow-hidden relative">
                <img
                  src={getImageUrl(teacher.photo) || DEFAULT_AVATAR}
                  alt={teacher.fullname}
                  onError={handleImgError}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-[#02135e]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1 bg-white">
                <h3 className="font-bold text-[#02135e] text-[13px] sm:text-[14px] leading-tight mb-2 line-clamp-2 uppercase">
                  {teacher.fullname}
                </h3>
                <div className="mt-auto flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {teacher.position}
                  </p>
                  <FaChevronRight
                    className="text-slate-300 group-hover:text-[#02135e] transition-colors"
                    size={10}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CLEAN MODAL ─── */}
      {selected && (
        <div
          className="fixed inset-0 bg-[#02135e]/20 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-[550px] bg-white rounded-2xl shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-black text-[#02135e] uppercase tracking-[2px]">
                Maǵlıwmat
              </span>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-8">
                {/* Photo */}
                <div className="w-full sm:w-44 aspect-[3/4] rounded-lg border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                  <img
                    src={getImageUrl(selected.photo) || DEFAULT_AVATAR}
                    alt={selected.fullname}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#02135e] leading-tight mb-1">
                    {selected.fullname}
                  </h2>
                  <p className="text-sm font-bold text-blue-600 mb-6 uppercase tracking-wide">
                    {selected.position}
                  </p>

                  <div className="space-y-4">
                    <div className="text-left">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Baylanıs:
                      </h4>
                      {selected.phone ? (
                        <a
                          href={`tel:${selected.phone}`}
                          className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg hover:bg-white hover:border-blue-200 transition-all no-underline"
                        >
                          <FaPhoneAlt className="text-[#02135e]" size={14} />
                          <span className="text-sm font-bold text-slate-800">
                            {selected.phone}
                          </span>
                        </a>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          Maǵlıwmat kiritilmegen
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelected(null)}
                className="px-6 py-2 bg-[#02135e] text-white text-[11px] font-bold uppercase tracking-widest rounded hover:bg-[#031d8c] transition-colors shadow-md shadow-blue-900/10"
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

export default Teachers;
