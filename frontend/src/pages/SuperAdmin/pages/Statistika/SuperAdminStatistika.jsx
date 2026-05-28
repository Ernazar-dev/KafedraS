import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import { Link } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  FileText,
  Search,
  User,
  Calendar,
} from "lucide-react";

const CATEGORIES = [
  {
    value: "maqalalar",
    label: "Maqalalar",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "tezisler",
    label: "Tezisler",
    color: "bg-violet-100 text-violet-700",
  },
  {
    value: "dgular",
    label: "DGUlar",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    value: "patentler",
    label: "Patentler",
    color: "bg-amber-100 text-amber-700",
  },
  {
    value: "proyektler",
    label: "Proyektler",
    color: "bg-rose-100 text-rose-700",
  },
];

const getCategoryStyle = (v) =>
  CATEGORIES.find((c) => c.value === v)?.color || "bg-slate-100 text-slate-600";
const getCategoryLabel = (v) =>
  CATEGORIES.find((c) => c.value === v)?.label || v;

const EMPTY_FORM = {
  title: "",
  category: "",
  description: "",
  date: "",
  file: null,
};

const SuperAdminWorks = () => {
  const [works, setWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fileName, setFileName] = useState(null);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/works", { params: { limit: 1000, page: 1 } });
      setWorks(res.data.data);
      setFilteredWorks(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredWorks(
      works.filter(
        (w) =>
          w.title?.toLowerCase().includes(q) ||
          w.authorName?.toLowerCase().includes(q) ||
          w.category?.toLowerCase().includes(q)
      )
    );
  }, [search, works]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, file: files[0] });
      setFileName(files[0].name);
    } else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("date", formData.date);
    if (formData.file) data.append("file", formData.file);
    try {
      if (editMode)
        await api.put(`/works/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      else
        await api.post("/works", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      resetForm();
      fetchWorks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    try {
      await api.delete(`/works/${id}`);
      fetchWorks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description || "",
      date: item.date ? item.date.slice(0, 10) : "",
      file: null,
    });
    setFileName(item.files ? "Fayl mavjud (yangilash uchun yuklang)" : null);
    setEditMode(true);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setFileName(null);
    setEditMode(false);
    setEditingId(null);
    const fi = document.getElementById("saFileInput");
    if (fi) fi.value = "";
  };

  const inputBase =
    "w-full px-4 py-2.5 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl outline-none focus:border-[#02135e]/40 focus:ring-2 focus:ring-[#02135e]/10 transition text-[#02135e] placeholder:text-slate-400";

  return (
    <div className="min-h-screen bg-[#f0f4ff] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-7 bg-[#02135e] rounded-full" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#02135e] tracking-tight">
              Ilimiy isler basqarması
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm ml-3.5">
            Barlıq maqalalar, tezisler, patentler hám proyektler
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

      {/* Category Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {CATEGORIES.map((cat) => {
          const count = works.filter((w) => w.category === cat.value).length;
          return (
            <div
              key={cat.value}
              className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center justify-between"
            >
              <span className="text-xs font-semibold text-slate-500">
                {cat.label}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-lg ${cat.color}`}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-[#02135e] rounded-full" />
          <span className="text-sm font-bold text-[#02135e]">
            {editMode ? "✏️ Jumıstı redaktorlaw" : "➕ Jańa ilimiy jumıs qosıw"}
          </span>
          {editMode && (
            <button
              onClick={resetForm}
              className="ml-auto flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
            >
              <X size={12} /> Biykarlaw
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              name="title"
              placeholder="Tema (Title)"
              value={formData.title}
              onChange={handleChange}
              required
              className={inputBase}
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={inputBase}
            >
              <option value="" disabled>
                Kategoriyanı tańlań
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className={inputBase}
            />
            <label
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-all ${
                fileName
                  ? "bg-[#02135e] text-white border-[#02135e]"
                  : "bg-[#f8fafc] text-slate-500 border-slate-200 hover:border-[#02135e]/40 hover:bg-[#f0f4ff]"
              }`}
            >
              <FileText size={16} className="shrink-0" />
              <span className="truncate text-xs">
                {fileName || "Fayl júklew (PDF/DOC)"}
              </span>
              <input
                id="saFileInput"
                type="file"
                name="file"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            name="description"
            placeholder="Qosımsha maǵlıwmat (qálewli)..."
            value={formData.description}
            onChange={handleChange}
            rows={2}
            className={`${inputBase} resize-none`}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className={`flex items-center gap-2 py-2.5 px-6 rounded-xl text-sm font-semibold text-white transition-colors ${
                editMode
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-[#02135e] hover:bg-[#03197a]"
              }`}
            >
              <Plus size={15} /> {editMode ? "Saqlaw" : "Qosıw"}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <X size={15} /> Biykar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table / Cards */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Table header with search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#02135e] rounded-full" />
            <span className="text-sm font-bold text-[#02135e]">
              Barlıq ilimiy jumıslar
            </span>
            <span className="text-xs text-slate-400">
              (
              <span className="text-[#02135e] font-bold">
                {filteredWorks.length}
              </span>{" "}
              dana)
            </span>
          </div>
          <div className="relative w-full sm:w-72">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Tema, avtor, kategoriya..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl outline-none focus:border-[#02135e]/40 focus:ring-2 focus:ring-[#02135e]/10 transition"
            />
          </div>
        </div>

        {loading ? (
          <div>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 px-5 py-4 border-b border-slate-50 animate-pulse"
              >
                <div className="h-3 w-6 bg-slate-200 rounded" />
                <div className="h-3 w-48 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-3 w-24 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredWorks.length > 0 ? (
          <>
            {/* ── DESKTOP TABLE ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-100">
                    {[
                      "#",
                      "Mavzu & Tavsif",
                      "Kategoriya",
                      "Muallif",
                      "Sana",
                      "Amallar",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 text-xs font-bold text-[#02135e] uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredWorks.map((work, i) => (
                    <tr
                      key={work.id}
                      className="border-b border-slate-50 hover:bg-[#f0f4ff]/60 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">
                        {i + 1}
                      </td>
                      <td className="px-5 py-3.5 max-w-[260px]">
                        <div className="text-sm font-semibold text-[#02135e] line-clamp-1">
                          {work.title}
                        </div>
                        {work.description && (
                          <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {work.description}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-lg ${getCategoryStyle(
                            work.category
                          )}`}
                        >
                          {getCategoryLabel(work.category)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
                          <User size={12} className="text-slate-400" />{" "}
                          {work.authorName || "Admin"}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
                          <Calendar size={12} className="text-slate-400" />
                          {new Date(work.date).toLocaleDateString("uz-UZ")}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(work)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-[#02135e] hover:text-white transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(work.id)}
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── MOBILE CARDS ── */}
            <div className="flex md:hidden flex-col divide-y divide-slate-50">
              {filteredWorks.map((work, i) => (
                <div
                  key={work.id}
                  className="p-4 flex items-start gap-3 hover:bg-[#f0f4ff]/40 transition-colors"
                >
                  <span className="text-xs text-slate-400 font-medium w-5 shrink-0 pt-0.5">
                    {i + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-sm font-bold text-[#02135e] line-clamp-2 leading-snug">
                        {work.title}
                      </p>
                      <span
                        className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-lg ${getCategoryStyle(
                          work.category
                        )}`}
                      >
                        {getCategoryLabel(work.category)}
                      </span>
                    </div>
                    {work.description && (
                      <p className="text-xs text-slate-400 line-clamp-1 mb-1.5">
                        {work.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <User size={10} /> {work.authorName || "Admin"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />{" "}
                        {new Date(work.date).toLocaleDateString("uz-UZ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleEdit(work)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-[#02135e] hover:text-white transition-colors"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(work.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="text-4xl mb-3">📄</span>
            <p className="text-sm font-medium">Maǵlıwmat tabılmadı</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminWorks;
