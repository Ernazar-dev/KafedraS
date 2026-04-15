import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import SearchInput from "../../../../components/SearchInput/SearchInput";
import { IoExitOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const COURSES = ["1", "2", "3", "4"];
const LANGS = ["O'zbek", "Qaraqalpaq", "Rus"];
const FACULTIES = [
  "Informaciya Qa'wipsizlik",
  "Kiberqa'wipsizlik",
  "Jasalma intellekt",
];

const filterCls =
  "px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-[#02135e]/40 focus:ring-2 focus:ring-[#02135e]/10 transition text-[#02135e] cursor-pointer disabled:opacity-40";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("3");
  const [selectedLang, setSelectedLang] = useState("Qaraqalpaq");
  const [selectedFaculty, setSelectedFaculty] = useState(FACULTIES[0]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api
      .get("/students")
      .then((r) => setStudents(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = students
    .filter((s) => {
      if (searchQuery.trim())
        return s.fullname.toLowerCase().includes(searchQuery.toLowerCase());
      return (
        String(s.course) === selectedCourse &&
        s.lang === selectedLang &&
        s.faculty === selectedFaculty
      );
    })
    .sort((a, b) => a.fullname.localeCompare(b.fullname));

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-4 border-[#02135e] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Yuklanmoqda...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f0f4ff] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-7 bg-[#02135e] rounded-full" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#02135e] tracking-tight">
              Studentler dizimi
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm ml-3.5">
            Barcha yo'nalishlar bo'yicha talabalar ro'yxati
          </p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm no-underline"
        >
          <IoExitOutline className="text-lg" />
          <span className="hidden sm:inline">Chiqish</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            disabled={!!searchQuery}
            className={filterCls}
          >
            {COURSES.map((c) => (
              <option key={c} value={c}>
                {c}-kurs
              </option>
            ))}
          </select>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            disabled={!!searchQuery}
            className={filterCls}
          >
            {LANGS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            disabled={!!searchQuery}
            className={`${filterCls} max-w-[180px] truncate`}
          >
            {FACULTIES.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Barlıq studentlerden izlew..."
          />
          <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:block">
            <span className="text-[#02135e] font-bold">{filtered.length}</span>{" "}
            ta
          </span>
        </div>
      </div>

      {/* Content */}
      {filtered.length > 0 ? (
        <>
          {/* ── DESKTOP TABLE ── */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#02135e] text-white">
                    {["#", "F.I.Sh", "Yo'nalish", "Kurs", "Til"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr
                      key={s.id || i}
                      className="border-b border-slate-50 hover:bg-[#f0f4ff]/60 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">
                        {i + 1}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-[#02135e] whitespace-nowrap">
                        {s.fullname}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">
                        {s.faculty}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#02135e]/10 text-[#02135e] text-xs font-bold">
                          {s.course}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                          {s.lang}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── MOBILE CARDS ── */}
          <div className="flex md:hidden flex-col gap-3">
            {filtered.map((s, i) => (
              <div
                key={s.id || i}
                className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-[#02135e]/10 flex items-center justify-center text-[#02135e] font-bold text-xs shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#02135e] truncate">
                    {s.fullname}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {s.faculty}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#02135e]/10 text-[#02135e] text-[10px] font-bold">
                      {s.course}
                    </span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {s.lang}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 text-slate-400">
          <span className="text-4xl mb-3">📭</span>
          <p className="text-sm font-medium">Student tabılmadı</p>
        </div>
      )}
    </div>
  );
}
