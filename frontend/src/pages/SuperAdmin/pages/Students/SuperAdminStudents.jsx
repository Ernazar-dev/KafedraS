import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import { IoExitOutline } from "react-icons/io5";
import { BsFillPenFill } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";

const FACULTIES = [
  "Informaciya Qáwipsizlik",
  "Kiberqáwipsizlik",
  "Jasalma intellekt",
];
const LANGS = ["O'zbek", "Qaraqalpaq", "Rus"];
const COURSES = ["1", "2", "3", "4"];
const EMPTY_FORM = { fullname: "", faculty: "", course: "", lang: "" };

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("1");
  const [selectedLang, setSelectedLang] = useState("Qaraqalpaq");
  const [selectedFaculty, setSelectedFaculty] = useState(FACULTIES[0]);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.fullname ||
      !formData.faculty ||
      !formData.course ||
      !formData.lang
    )
      return;
    const dataToSend = { ...formData, course: Number(formData.course) };
    try {
      if (editId) await api.put(`/students/${editId}`, dataToSend);
      else await api.post("/students", dataToSend);
      setFormData(EMPTY_FORM);
      setEditId(null);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (s) => {
    setFormData({
      fullname: s.fullname,
      faculty: s.faculty,
      course: s.course,
      lang: s.lang,
    });
    setEditId(s.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Óshiriwdi tastıyıqlaysızba?")) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents((p) => p.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = students
    .filter((s) => s.course === Number(selectedCourse))
    .filter((s) => s.lang === selectedLang)
    .filter((s) => s.faculty === selectedFaculty)
    .filter((s) => s.fullname?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.fullname.trim().localeCompare(b.fullname.trim()));

  const inputCls =
    "w-full px-4 py-2.5 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl outline-none focus:border-[#02135e]/40 focus:ring-2 focus:ring-[#02135e]/10 transition text-[#02135e] placeholder:text-slate-400";
  const filterCls =
    "text-sm border border-slate-200 rounded-xl px-3 py-2 text-slate-600 bg-white outline-none focus:border-[#02135e]/40 transition cursor-pointer";

  return (
    <div className="min-h-screen bg-[#f0f4ff] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-7 bg-[#02135e] rounded-full" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#02135e] tracking-tight">
              Studentler basqarması
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm ml-3.5">
            Barlıq baǵdarlar boyınsha studentler dizimi
          </p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <IoExitOutline className="text-lg" />
          <span className="hidden sm:inline">Shıǵıw</span>
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-[#02135e] rounded-full" />
          <span className="text-sm font-bold text-[#02135e]">
            {editId ? "✏️ Studentti redaktorlaw" : "➕ Jańa student qosıw"}
          </span>
          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setFormData(EMPTY_FORM);
              }}
              className="ml-auto text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition"
            >
              Biykarlaw
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          <input
            type="text"
            placeholder="F.I.Sh"
            value={formData.fullname}
            onChange={(e) =>
              setFormData({ ...formData, fullname: e.target.value })
            }
            required
            className={inputCls}
          />
          <select
            value={formData.faculty}
            onChange={(e) =>
              setFormData({ ...formData, faculty: e.target.value })
            }
            required
            className={inputCls}
          >
            <option value="">Jónelis tanlań</option>
            {FACULTIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Kurs (1–4)"
            min="1"
            max="4"
            value={formData.course}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || (Number(v) >= 1 && Number(v) <= 4))
                setFormData({ ...formData, course: v });
            }}
            required
            className={inputCls}
          />
          <select
            value={formData.lang}
            onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
            required
            className={inputCls}
          >
            <option value="">Til tańlań</option>
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className={`py-2.5 px-5 rounded-xl text-sm font-semibold text-white transition-colors ${
              editId
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-[#02135e] hover:bg-[#03197a]"
            }`}
          >
            {editId ? "Saqlaw" : "Qosıw"}
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            Filtr:
          </span>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
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
            className={filterCls}
          >
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className={`${filterCls} max-w-[180px] truncate`}
          >
            {FACULTIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <div className="relative flex-1 min-w-[160px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Atı boyınsha..."
              className="w-full pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#02135e]/40 transition"
            />
          </div>

          <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
            <span className="text-[#02135e] font-bold">{filtered.length}</span>{" "}
            dana student
          </span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4 px-6 py-4 border-b border-slate-50 animate-pulse"
            >
              <div className="h-3 w-6 bg-slate-200 rounded" />
              <div className="h-3 w-40 bg-slate-200 rounded" />
              <div className="h-3 w-32 bg-slate-200 rounded" />
              <div className="h-3 w-10 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <>
          {/* ── DESKTOP TABLE ── */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-100">
                    {["#", "F.I.Sh", "Yo'nalish", "Kurs", "Til", "Amallar"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3.5 text-xs font-bold text-[#02135e] uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr
                      key={s.id}
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
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(s)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-[#02135e] hover:text-white transition-colors"
                          >
                            <BsFillPenFill className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <RiDeleteBin6Line className="text-xs" />
                          </button>
                        </div>
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
                key={s.id}
                className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3"
              >
                {/* Index circle */}
                <div className="w-8 h-8 rounded-xl bg-[#02135e]/10 flex items-center justify-center text-[#02135e] font-bold text-xs shrink-0">
                  {i + 1}
                </div>

                {/* Info */}
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

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(s)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-[#02135e] hover:text-white transition-colors"
                  >
                    <BsFillPenFill className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <RiDeleteBin6Line className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 text-slate-400">
          <span className="text-4xl mb-3">📭</span>
          <p className="text-sm font-medium">Bul toparda ele studentler joq</p>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
