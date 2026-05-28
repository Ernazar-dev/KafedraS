import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Plus, X, FileText } from "lucide-react";

const CATEGORIES = [
  { value: "maqalalar", label: "Maqalalar" },
  { value: "tezisler", label: "Tezisler" },
  { value: "dgular", label: "DGUlar" },
  { value: "patentler", label: "Patentler" },
  { value: "proyektler", label: "Proyektler" },
];

const inputCls =
  "w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-[#f8fafc] text-[14px] text-slate-800 outline-none focus:border-[#02135e] focus:bg-white focus:shadow-[0_0_0_4px_rgba(2,19,94,0.08)] transition-all duration-200 placeholder-slate-400";

const WorkForm = ({ fetchWorks, editing, setEditing }) => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    file: null,
  });
  const [fileName, setFileName] = useState(null);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || "",
        category: editing.category || "",
        description: editing.description || "",
        date: editing.date ? editing.date.slice(0, 10) : "",
        file: null,
      });
      setFileName(editing.files ? "Fayl bar" : null);
    } else {
      setForm({
        title: "",
        category: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        file: null,
      });
      setFileName(null);
    }
  }, [editing]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm({ ...form, file: files[0] });
      setFileName(files[0]?.name || null);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("date", form.date);
    if (form.file) formData.append("file", form.file);

    try {
      if (editing) {
        await axios.put(`/works/${editing.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditing(null);
      } else {
        await axios.post("/works", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setForm({
        title: "",
        category: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        file: null,
      });
      setFileName(null);
      document.getElementById("workFileInput").value = "";
      fetchWorks();
    } catch (error) {
      alert(error.response?.data?.message || "Qátelik júz berdi");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      {editing && (
        <div className="h-1.5 w-full bg-gradient-to-r from-[#02135e] to-blue-500" />
      )}
      <div className="p-5 sm:p-6">
        <h2 className="text-[16px] font-extrabold text-[#02135e] mb-4">
          {editing ? "Jumıstı jańalaw" : "Jana jumıs qosıw"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Title */}
          <input
            name="title"
            placeholder="Tema (Title)"
            value={form.title}
            onChange={handleChange}
            required
            className={inputCls}
          />

          {/* Category + Date row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className={`${inputCls} flex-1`}
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
              value={form.date}
              onChange={handleChange}
              required
              className={`${inputCls} sm:w-44`}
            />
          </div>

          {/* Description */}
          <textarea
            name="description"
            placeholder="Táriyp (Description)"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={`${inputCls} resize-none`}
          />

          {/* File */}
          <label
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all duration-200 text-[13px] font-medium w-fit ${fileName ? "border-[#02135e] bg-[#02135e]/5 text-[#02135e]" : "border-slate-200 bg-slate-50 text-slate-500 hover:border-[#02135e]/50"}`}
          >
            <FileText size={15} className="shrink-0" />
            <span className="truncate max-w-[200px]">
              {fileName || "Fayl tańlań (PDF)"}
            </span>
            <input
              id="workFileInput"
              type="file"
              name="file"
              onChange={handleChange}
              className="hidden"
            />
          </label>

          {/* Buttons */}
          <div className="flex gap-3 mt-1">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#02135e] text-white font-semibold text-[14px] hover:bg-[#02135e]/90 active:scale-95 transition-all duration-200 shadow-md shadow-[#02135e]/20"
            >
              <Plus size={17} />
              {editing ? "Saqlaw" : "Jaratiw"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-[14px] hover:bg-slate-50 transition-colors duration-200"
              >
                <X size={15} /> Biykarlaw
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkForm;
