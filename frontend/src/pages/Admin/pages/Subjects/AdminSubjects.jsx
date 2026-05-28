import { useState, useEffect } from "react";
import api from "../../../../api/axios";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  FileText,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  BookOpen,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../../../api/imageUrl";

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    videoLink: "",
    images: null,
    file: null,
    video: null,
  });

  const [previews, setPreviews] = useState({
    image: null,
    fileName: null,
    videoName: null,
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects/my");
      setSubjects(res.data);
    } catch (error) {
      console.error("GET Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (name === "images") {
        setFormData({ ...formData, images: files });
        setPreviews({ ...previews, image: URL.createObjectURL(file) });
      } else {
        setFormData({ ...formData, [name]: file });
        if (name === "file") setPreviews({ ...previews, fileName: file.name });
        if (name === "video")
          setPreviews({ ...previews, videoName: file.name });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("videoLink", formData.videoLink);
    if (formData.images)
      Array.from(formData.images).forEach((f) => data.append("images", f));
    if (formData.file) data.append("file", formData.file);
    if (formData.video) data.append("video", formData.video);
    try {
      if (editMode) {
        const res = await api.put(`/subjects/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSubjects((prev) =>
          prev.map((s) => (s.id === editingId ? res.data : s)),
        );
        showToast("Fan muvaffaqiyatli yangilandi!");
      } else {
        const res = await api.post("/subjects", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSubjects((prev) => [res.data, ...prev]);
        showToast("Fan muvaffaqiyatli qo'shildi!");
      }
      resetForm();
    } catch (error) {
      showToast(error.response?.data?.message || "Xatolik yuz berdi", "error");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      videoLink: item.videoLink || "",
      images: null,
      file: null,
      video: null,
    });
    setPreviews({
      image: item.images ? getImageUrl(item.images.split(",")[0]) : null,
      fileName: item.file ? "Fayl mavjud" : null,
      videoName: item.video ? "Video mavjud" : null,
    });
    setEditingId(item.id);
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/subjects/${id}`);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      setShowDeleteId(null);
      showToast("Fan o'chirildi");
    } catch (error) {
      showToast("O'chirishda xatolik", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      videoLink: "",
      images: null,
      file: null,
      video: null,
    });
    setPreviews({ image: null, fileName: null, videoName: null });
    setEditMode(false);
    setEditingId(null);
    document
      .querySelectorAll('input[type="file"]')
      .forEach((i) => (i.value = ""));
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] pb-20 sm:pb-0">
      <div className="flex min-h-screen">
        {/* ─── LEFT SIDEBAR (desktop only) ─── */}
        <div className="hidden lg:flex flex-col items-center w-[72px] bg-[#02135e] py-6 gap-6 fixed top-0 left-0 h-full z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
          <div className="flex-1" />
          <Link to="/" title="Saytga o'tish">
            <div className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <LogOut size={18} className="text-white/70" />
            </div>
          </Link>
        </div>

        {/* ─── MAIN ─── */}
        <div className="flex-1 lg:ml-[72px]">
          {/* ─── HEADER ─── */}
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#02135e] flex items-center justify-center lg:hidden shadow-md shadow-[#02135e]/30">
                <BookOpen size={17} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                  Admin Panel
                </p>
                <h1 className="text-[16px] sm:text-[20px] font-extrabold text-[#02135e] leading-none">
                  Fanlar
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#02135e]/8 text-[11px] font-bold text-[#02135e]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {subjects.length}
              </span>
              <Link
                to="/"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-slate-200 hover:border-[#02135e] text-slate-500 hover:text-[#02135e] text-[13px] font-semibold transition-all duration-200"
              >
                <LogOut size={14} />
                Saytga o'tish
              </Link>
            </div>
          </header>

          {/* ─── BODY ─── */}
          <main className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1180px]">
            {/* ─── FORM CARD ─── */}
            <div
              className={`relative bg-white rounded-2xl border overflow-hidden mb-4 sm:mb-6 transition-all duration-300 ${editMode ? "border-[#02135e]/40 shadow-lg shadow-[#02135e]/10" : "border-slate-200 shadow-sm"}`}
            >
              {editMode && (
                <div className="h-1 w-full bg-gradient-to-r from-[#02135e] via-blue-500 to-indigo-400" />
              )}

              {/* Form header */}
              <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${editMode ? "bg-[#02135e]" : "bg-slate-100"}`}
                  >
                    {editMode ? (
                      <Edit2 size={15} className="text-white" />
                    ) : (
                      <Plus size={15} className="text-slate-500" />
                    )}
                  </div>
                  <span className="text-[14px] font-bold text-[#02135e]">
                    {editMode ? "Fanni tahrirlash" : "Yangi fan qo'shish"}
                  </span>
                </div>
                {editMode && (
                  <button
                    onClick={resetForm}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                    aria-label="Bekor qilish"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  {/* Cover image — full width on mobile */}
                  <label className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 active:border-[#02135e] hover:border-[#02135e] transition-all duration-200 cursor-pointer group bg-slate-50">
                    {previews.image ? (
                      <>
                        <img
                          src={previews.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity">
                          <div className="bg-white/90 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                            <ImageIcon size={14} className="text-[#02135e]" />
                            <span className="text-[12px] font-bold text-[#02135e]">
                              Almashtirish
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 h-full text-slate-400 p-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-200 group-hover:bg-[#02135e]/10 active:bg-[#02135e]/10 flex items-center justify-center transition-colors">
                          <ImageIcon size={22} />
                        </div>
                        <span className="text-[12px] font-semibold">
                          Muqova rasm
                        </span>
                        <span className="text-[11px] text-slate-300">
                          JPG, PNG, WEBP
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      name="images"
                      onChange={handleChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                  </label>

                  {/* Text fields */}
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      name="name"
                      placeholder="Fan nomi..."
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-[15px] text-slate-800 outline-none focus:border-[#02135e] focus:bg-white focus:shadow-[0_0_0_3px_rgba(2,19,94,0.08)] transition-all duration-200 placeholder-slate-400 font-medium"
                    />
                    <textarea
                      name="description"
                      placeholder="Fan haqida qisqacha..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-[15px] text-slate-700 outline-none focus:border-[#02135e] focus:bg-white focus:shadow-[0_0_0_3px_rgba(2,19,94,0.08)] transition-all duration-200 placeholder-slate-400 resize-none leading-relaxed"
                    />

                    {/* Media uploads — mobile: vertikal stack */}
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      {/* PDF */}
                      <label
                        className={`flex items-center gap-2.5 px-4 py-3 sm:py-2 rounded-xl border-2 cursor-pointer transition-all duration-200 text-[14px] sm:text-[13px] font-semibold flex-1 active:scale-[0.98] ${previews.fileName ? "border-[#02135e] bg-[#02135e]/5 text-[#02135e]" : "border-slate-200 bg-slate-50 text-slate-500 hover:border-[#02135e]/50"}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${previews.fileName ? "bg-[#02135e]/10" : "bg-slate-200"}`}
                        >
                          <FileText
                            size={14}
                            className={
                              previews.fileName
                                ? "text-[#02135e]"
                                : "text-slate-400"
                            }
                          />
                        </div>
                        <span className="truncate">
                          {previews.fileName || "PDF fayl"}
                        </span>
                        <input
                          type="file"
                          name="file"
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>

                      {/* Video */}
                      <label
                        className={`flex items-center gap-2.5 px-4 py-3 sm:py-2 rounded-xl border-2 cursor-pointer transition-all duration-200 text-[14px] sm:text-[13px] font-semibold flex-1 active:scale-[0.98] ${previews.videoName ? "border-[#02135e] bg-[#02135e]/5 text-[#02135e]" : "border-slate-200 bg-slate-50 text-slate-500 hover:border-[#02135e]/50"}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${previews.videoName ? "bg-[#02135e]/10" : "bg-slate-200"}`}
                        >
                          <Video
                            size={14}
                            className={
                              previews.videoName
                                ? "text-[#02135e]"
                                : "text-slate-400"
                            }
                          />
                        </div>
                        <span className="truncate">
                          {previews.videoName || "Video fayl"}
                        </span>
                        <input
                          type="file"
                          name="video"
                          onChange={handleChange}
                          accept="video/*"
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* YouTube link */}
                    <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 focus-within:border-[#02135e] focus-within:bg-white transition-all duration-200">
                      <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                        <LinkIcon size={14} className="text-red-500" />
                      </div>
                      <input
                        type="text"
                        name="videoLink"
                        placeholder="YouTube havolasi..."
                        value={formData.videoLink}
                        onChange={handleChange}
                        className="bg-transparent text-[15px] sm:text-[13px] text-slate-700 outline-none placeholder-slate-400 w-full"
                      />
                    </div>

                    {/* Submit buttons — full width on mobile */}
                    <div className="flex flex-col sm:flex-row gap-2.5 mt-1">
                      <button
                        type="submit"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 sm:py-2.5 rounded-xl bg-[#02135e] text-white font-bold text-[15px] sm:text-[13px] active:scale-95 hover:bg-[#02135e]/90 transition-all duration-200 shadow-md shadow-[#02135e]/25"
                      >
                        {editMode ? (
                          <CheckCircle size={17} />
                        ) : (
                          <Plus size={17} />
                        )}
                        {editMode ? "Saqlash" : "Qo'shish"}
                      </button>
                      {editMode && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 sm:py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-[15px] sm:text-[13px] active:bg-slate-100 hover:bg-slate-50 transition-colors duration-200"
                        >
                          <X size={15} />
                          Bekor qilish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* ─── SUBJECTS GRID ─── */}
            {subjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
                {subjects.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col active:scale-[0.99] hover:shadow-lg hover:shadow-slate-200/80 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Cover image */}
                    <div className="h-44 sm:h-48 bg-slate-100 shrink-0 overflow-hidden relative">
                      {item.images ? (
                        <img
                          src={getImageUrl(item.images?.split(",")[0])}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center">
                            <BookOpen size={28} className="text-slate-300" />
                          </div>
                        </div>
                      )}

                      {/* Resource badges on image */}
                      {(item.file || item.video || item.videoLink) && (
                        <div className="absolute top-2 left-2 flex gap-1">
                          {item.file && (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                              <FileText size={9} /> PDF
                            </span>
                          )}
                          {(item.video || item.videoLink) && (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                              <Video size={9} /> Video
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-4">
                      <h3 className="text-[15px] font-extrabold text-[#02135e] line-clamp-1 mb-1.5">
                        {item.name}
                      </h3>
                      <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed flex-1">
                        {item.description}
                      </p>
                    </div>

                    {/* Actions — large touch targets */}
                    <div className="flex border-t border-slate-100">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[14px] font-bold text-[#02135e] active:bg-[#02135e]/5 hover:bg-[#02135e]/5 transition-colors duration-150"
                      >
                        <Edit2 size={15} />
                        Tahrirlash
                      </button>
                      <div className="w-px bg-slate-100" />
                      <button
                        onClick={() => setShowDeleteId(item.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[14px] font-bold text-red-500 active:bg-red-50 hover:bg-red-50 transition-colors duration-150"
                      >
                        <Trash2 size={15} />
                        O'chirish
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-slate-200">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <BookOpen size={36} className="text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="text-slate-700 font-bold mb-1">
                    Hozircha fan yo'q
                  </p>
                  <p className="text-slate-400 text-[13px]">
                    Yuqoridagi forma orqali fan qo'shing
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 flex">
        <Link
          to="/"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-slate-400 active:text-[#02135e] transition-colors"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-semibold">Saytga</span>
        </Link>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[#02135e]"
        >
          <Plus size={20} />
          <span className="text-[10px] font-semibold">Qo'shish</span>
        </button>
        <div className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-slate-400">
          <BookOpen size={20} />
          <span className="text-[10px] font-semibold">
            {subjects.length} ta
          </span>
        </div>
      </nav>

      {/* ─── DELETE MODAL ─── */}
      {showDeleteId && (
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowDeleteId(null)}
          style={{ animation: "fadeIn 0.2s ease" }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full sm:max-w-[360px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideUp 0.25s ease" }}
          >
            <div className="h-1.5 bg-gradient-to-r from-red-400 to-rose-600" />
            <div className="px-6 py-7 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-[18px] font-extrabold text-[#02135e] mb-1.5">
                O'chirishni tasdiqlash
              </h3>
              <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                Bu fan butunlay o'chiriladi.
                <br />
                Bu amalni qaytarib bo'lmaydi.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteId(null)}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-[14px] hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={() => handleDelete(showDeleteId)}
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[14px] active:scale-95 transition-all shadow-lg shadow-red-500/25"
                >
                  Ha, o'chirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST ─── */}
      {toast && (
        <div
          className={`fixed bottom-20 sm:bottom-5 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-[13px] font-semibold max-w-[280px] ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-[#02135e] text-white"
          }`}
          style={{ animation: "slideUp 0.3s ease" }}
        >
          {toast.type === "error" ? (
            <X size={16} className="shrink-0" />
          ) : (
            <CheckCircle size={16} className="shrink-0" />
          )}
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}
