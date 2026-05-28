import { useState, useEffect } from "react";
import api from "../../../../api/axios";
import { Link } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";
import { MdAddPhotoAlternate } from "react-icons/md";
import { BsFillPenFill } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getImageUrl } from "../../../../api/imageUrl";

const SuperAdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    fullname: "",
    position: "",
    phone: "",
    photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("fullname", formData.fullname);
    data.append("position", formData.position);
    data.append("phone", formData.phone);
    if (formData.photo) data.append("photo", formData.photo);
    try {
      if (editingId)
        await api.put(`/teachers/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      else
        await api.post("/teachers", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      fetchTeachers();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setFormData({
      fullname: teacher.fullname,
      position: teacher.position,
      phone: teacher.phone,
      photo: null,
    });
    setPreview(teacher.photo ? getImageUrl(teacher.photo) : null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Muǵallimdi óshiriwdi tastıyıqlaysız ba?")) return;
    try {
      await api.delete(`/teachers/${id}`);
      setTeachers(teachers.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({ fullname: "", position: "", phone: "", photo: null });
    setPreview(null);
    setEditingId(null);
  };

  const filtered = teachers.filter(
    (t) =>
      t.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      t.position?.toLowerCase().includes(search.toLowerCase())
  );

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
              Muǵallimler basqarması
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm ml-3.5">
            Kafedra professor-oqıtıwshılarınıń dizimi
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
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <div className="w-1 h-5 bg-[#02135e] rounded-full" />
          <span className="text-sm font-bold text-[#02135e]">
            {editingId
              ? "✏️ Oqıtıwshını redaktorlaw"
              : "➕ Jańa oqıtıwshı qosıw"}
          </span>
          {editingId && (
            <button
              onClick={resetForm}
              className="ml-auto text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
            >
              Biykarlaw
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 sm:gap-6 items-start">
            {/* Photo Upload */}
            <label
              htmlFor="photoUpload"
              className="cursor-pointer block group mx-auto md:mx-0 w-32 md:w-full"
            >
              <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 group-hover:border-[#02135e]/40 bg-[#f8fafc] overflow-hidden flex items-center justify-center transition-colors">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <MdAddPhotoAlternate size={28} />
                    <span className="text-xs font-medium">Foto</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="photoUpload"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>

            {/* Inputs */}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="fullname"
                placeholder="F.I.O (Tolıq atı)"
                value={formData.fullname}
                onChange={handleChange}
                required
                className={inputBase}
              />
              <input
                type="text"
                name="position"
                placeholder="Lawazımı (máselen: Docent, Professor)"
                value={formData.position}
                onChange={handleChange}
                required
                className={inputBase}
              />
              <input
                type="text"
                name="phone"
                placeholder="Telefon nomeri"
                value={formData.phone}
                onChange={handleChange}
                required
                className={inputBase}
              />

              <div className="flex gap-3 pt-1 flex-wrap">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60 ${
                    editingId
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-[#02135e] hover:bg-[#03197a]"
                  }`}
                >
                  {loading ? "Saqlanbaqta..." : editingId ? "Saqlaw" : "Qosıw"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="py-2.5 px-5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    Biykarlaw
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Search + Count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="At yaki lawazım..."
            className="w-full pl-8 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-[#02135e]/40 focus:ring-2 focus:ring-[#02135e]/10 transition"
          />
        </div>
        <p className="text-xs text-slate-400 font-medium whitespace-nowrap">
          Jámi:{" "}
          <span className="text-[#02135e] font-bold">{filtered.length}</span>{" "}
          dana muǵallim
        </p>
      </div>

      {/* ── DESKTOP TABLE ── */}
      {filtered.length > 0 ? (
        <>
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-100">
                    {[
                      "#",
                      "Foto",
                      "F.I.O",
                      "Lavozimi",
                      "Telefon",
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
                  {filtered.map((t, i) => (
                    <tr
                      key={t.id}
                      className="border-b border-slate-50 hover:bg-[#f0f4ff]/60 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">
                        {i + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        {t.photo ? (
                          <img
                            src={getImageUrl(t.photo)}
                            alt={t.fullname}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#02135e]/10 flex items-center justify-center text-[#02135e] font-bold text-sm">
                            {t.fullname?.charAt(0) || "?"}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-[#02135e] whitespace-nowrap">
                        {t.fullname}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-medium bg-[#02135e]/10 text-[#02135e] px-2.5 py-1 rounded-lg">
                          {t.position}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">
                        {t.phone}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(t)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-[#02135e] hover:text-white transition-colors"
                            title="Redaktorlaw"
                          >
                            <BsFillPenFill className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                            title="Óshiriw"
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
            {filtered.map((t, i) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4"
              >
                {/* Avatar */}
                <div className="shrink-0">
                  {t.photo ? (
                    <img
                      src={getImageUrl(t.photo)}
                      alt={t.fullname}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#02135e]/10 flex items-center justify-center text-[#02135e] font-bold text-xl">
                      {t.fullname?.charAt(0) || "?"}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#02135e] truncate">
                    {t.fullname}
                  </p>
                  <span className="inline-block text-xs font-medium bg-[#02135e]/10 text-[#02135e] px-2 py-0.5 rounded-lg mt-0.5 mb-1">
                    {t.position}
                  </span>
                  <p className="text-xs text-slate-400">{t.phone}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(t)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-[#02135e] hover:text-white transition-colors"
                  >
                    <BsFillPenFill className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
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
          <span className="text-4xl mb-3">👨‍🏫</span>
          <p className="text-sm font-medium">
            Házirshe oqıtıwshılar qosılmaǵan
          </p>
        </div>
      )}
    </div>
  );
};

export default SuperAdminTeachers;
