import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
  FaSearch,
  FaUserGraduate,
  FaUniversity,
  FaTimes,
} from "react-icons/fa";

const faculties = [
  { name: "Informaciya Qáwipsizlik", short: "AX" },
  { name: "Kiberqáwipsizlik", short: "KX" },
  { name: "Jasalma intellekt", short: "JI" },
];

const langs = [
  { name: "Qaraqalpaq", short: "QQ" },
  { name: "O'zbek", short: "UZB" },
  { name: "Rus", short: "RUS" },
];

const courses = [1, 2, 3, 4];

export default function Groups() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFaculty, setActiveFaculty] = useState(0);
  const [activeLang, setActiveLang] = useState(0);

  useEffect(() => {
    api
      .get("/students")
      .then((res) => setStudents(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStudentsByGroup = (faculty, lang, course) =>
    students
      .filter(
        (s) =>
          s.faculty === faculty.name &&
          s.lang === lang.name &&
          Number(s.course) === Number(course),
      )
      .sort((a, b) => a.fullname.localeCompare(b.fullname));

  const globalSearchResults = students.filter((s) =>
    s.fullname.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-4 sm:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* ─── HEADER ─── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="flex items-center gap-3 text-[22px] sm:text-[28px] font-extrabold text-[#02135e]">
            <FaUniversity className="text-[32px]" />
            Toparlar Dizimi
          </h2>

          <div className="relative w-full max-w-[400px]">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
            <input
              type="text"
              placeholder="Studentti izlew F.I.O"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-11 py-3 rounded-xl border-2 border-slate-200 bg-white text-[15px] text-slate-700 outline-none transition-all duration-300 focus:border-[#02135e] focus:shadow-[0_0_0_4px_rgba(2,19,94,0.1)]"
            />
            {searchTerm && (
              <FaTimes
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
              />
            )}
          </div>
        </div>

        {/* ─── LOADING ─── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-[#02135e]/20 border-t-[#02135e] rounded-full animate-spin" />
            <p className="text-[#02135e]/50 text-sm font-medium tracking-widest uppercase">
              Júklenip atır...
            </p>
          </div>
        ) : searchTerm.length > 0 ? (
          /* ─── QIDIRUV NATIJALARI ─── */
          <div>
            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#02135e] mb-5">
              Nátiyjeler:{" "}
              <span className="text-blue-600">
                {globalSearchResults.length}
              </span>{" "}
              student tabıldı
            </h3>

            {globalSearchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {globalSearchResults.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-xl border-l-[5px] border-l-[#02135e] shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4 px-5 py-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#e0e7ff] flex items-center justify-center shrink-0">
                      <FaUserGraduate className="text-[#02135e] text-xl" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-800 mb-2">
                        {s.fullname}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[11px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">
                          {s.faculty}
                        </span>
                        <span className="text-[11px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">
                          {s.lang}
                        </span>
                        <span className="text-[11px] bg-[#02135e] text-white font-semibold px-2 py-0.5 rounded">
                          {s.course}-kurs
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <FaUserGraduate className="text-5xl text-slate-200" />
                <p className="text-slate-400 text-base">
                  Bunday atlı student tabılmadı :(
                </p>
              </div>
            )}
          </div>
        ) : (
          /* ─── TABLAR ─── */
          <div>
            {/* Fakultet tablari */}
            <div className="flex justify-center flex-wrap gap-2 pb-5 mb-1 border-b-2 border-slate-200">
              {faculties.map((f, i) => (
                <button
                  key={f.short}
                  onClick={() => {
                    setActiveFaculty(i);
                    setActiveLang(0);
                  }}
                  className={`px-6 py-2.5 rounded-lg font-semibold text-[14px] transition-all duration-200 outline-none ${
                    activeFaculty === i
                      ? "bg-[#02135e] text-white shadow-lg shadow-[#02135e]/30"
                      : "text-slate-500 hover:bg-slate-100 hover:text-[#02135e]"
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            {/* Til tablari */}
            <div className="flex justify-center flex-wrap gap-2 my-6">
              {langs.map((lang, i) => (
                <button
                  key={lang.short}
                  onClick={() => setActiveLang(i)}
                  className={`px-6 py-2 rounded-full font-medium text-[14px] border transition-all duration-200 outline-none ${
                    activeLang === i
                      ? "bg-[#02135e] text-white border-[#02135e]"
                      : "bg-white text-slate-500 border-slate-300 hover:border-[#02135e] hover:text-[#02135e]"
                  }`}
                >
                  {langs[i].short} patok
                </button>
              ))}
            </div>

            {/* Kurs kartalar */}
            <div
              key={`${activeFaculty}-${activeLang}`}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
              style={{ animation: "fadeIn 0.35s ease" }}
            >
              {courses.map((course) => {
                const list = getStudentsByGroup(
                  faculties[activeFaculty],
                  langs[activeLang],
                  course,
                );
                return (
                  <div
                    key={course}
                    className="bg-white rounded-2xl overflow-hidden flex flex-col"
                    style={{
                      boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                      borderTop: "5px solid #02135e",
                    }}
                  >
                    {/* Karta header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                      <h3 className="text-[17px] font-extrabold text-[#02135e] uppercase tracking-wide">
                        {course}-kurs
                      </h3>
                      <span className="bg-[#e0e7ff] text-[#02135e] text-[13px] font-bold px-3 py-1 rounded-full">
                        {list.length}
                      </span>
                    </div>

                    {/* Student list */}
                    <div
                      className="flex-1 overflow-y-auto"
                      style={{
                        maxHeight: "450px",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#cbd5e1 transparent",
                      }}
                    >
                      {list.length > 0 ? (
                        list.map((s, i) => (
                          <div
                            key={s.id}
                            className={`flex items-center gap-3 px-5 py-3 border-b border-[#f0f0f0] transition-colors duration-150 hover:bg-[#e0e7ff] ${
                              i % 2 === 1 ? "bg-[#f8fafc]" : "bg-white"
                            }`}
                          >
                            <span
                              className="w-7 h-7 rounded-full bg-[#02135e] text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                              style={{
                                boxShadow: "0 2px 5px rgba(2,19,94,0.2)",
                              }}
                            >
                              {i + 1}
                            </span>
                            <span className="text-[13px] font-medium text-slate-700 leading-snug">
                              {s.fullname}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-slate-400 italic text-sm py-8">
                          Topar bos
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
