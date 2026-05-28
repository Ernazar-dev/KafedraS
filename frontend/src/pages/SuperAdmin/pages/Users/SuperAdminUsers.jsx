import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import { Link } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";
import { BsFillPenFill } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";

const EMPTY_FORM = { username: "", email: "", password: "", role: "user" };

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/superadmin/users");
      setUsers(response.data.filter((u) => u.role !== "superAdmin"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) return;
    try {
      if (editId) {
        const dataToSend = { ...formData };
        if (!dataToSend.password) delete dataToSend.password;
        await api.put(`/superadmin/users/${editId}`, dataToSend);
      } else {
        if (!formData.password) return;
        await api.post("/superadmin/users", formData);
      }
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Paydalanıwshını óshiriwdi tastıyıqlaysızba?")) return;
    try {
      await api.delete(`/superadmin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setEditId(user.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditId(null);
  };

  const filtered = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
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
              Paydalanıwshılar basqarması
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm ml-3.5">
            Sistema paydalanıwshıları hám ruxsatların basqarıw
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
            {editId
              ? "✏️ Paydalanıwshını redaktorlaw"
              : "➕ Jańa paydalanıwshı qosıw"}
          </span>
          {editId && (
            <button
              onClick={resetForm}
              className="ml-auto text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
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
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
            className={inputBase}
          />
          <input
            type="email"
            placeholder="Email mánzili"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className={inputBase}
          />
          <input
            type="password"
            placeholder={
              editId ? "Parol (ózgertiw ushın) " : "Parol (májbúriy)"
            }
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required={!editId}
            className={inputBase}
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className={inputBase}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-colors ${
                editId
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-[#02135e] hover:bg-[#03197a]"
              }`}
            >
              {editId ? "Saqlaw" : "Qosıw"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors whitespace-nowrap"
              >
                Biykar
              </button>
            )}
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
            placeholder="Username yamasa email..."
            className="w-full pl-8 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-[#02135e]/40 focus:ring-2 focus:ring-[#02135e]/10 transition"
          />
        </div>
        <p className="text-xs text-slate-400 font-medium whitespace-nowrap">
          Jámi:{" "}
          <span className="text-[#02135e] font-bold">{filtered.length}</span>{" "}
          dana paydalanıwshı
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4 px-6 py-4 border-b border-slate-50 animate-pulse"
            >
              <div className="h-3 w-6 bg-slate-200 rounded" />
              <div className="h-3 w-32 bg-slate-200 rounded" />
              <div className="h-3 w-48 bg-slate-200 rounded" />
              <div className="h-3 w-16 bg-slate-200 rounded" />
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
                    {["#", "Username", "Email", "Role", "Amallar"].map((h) => (
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
                  {filtered.map((user, i) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-50 hover:bg-[#f0f4ff]/60 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">
                        {i + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#02135e]/10 flex items-center justify-center text-[#02135e] font-bold text-xs shrink-0">
                            {user.username?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="text-sm font-semibold text-[#02135e]">
                            {user.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">
                        {user.email}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg ${
                            user.role === "admin"
                              ? "bg-[#02135e] text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {user.role === "admin" ? "👑 Admin" : "👤 User"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-[#02135e] hover:text-white transition-colors"
                            title="Redaktorlaw"
                          >
                            <BsFillPenFill className="text-xs" />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
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
            {filtered.map((user, i) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-[#02135e]/10 flex items-center justify-center text-[#02135e] font-bold text-lg shrink-0">
                  {user.username?.charAt(0)?.toUpperCase() || "?"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-[#02135e] truncate">
                      {user.username}
                    </p>
                    <span
                      className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                        user.role === "admin"
                          ? "bg-[#02135e] text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.role === "admin" ? "👑 Admin" : "👤 User"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-[#02135e] hover:text-white transition-colors"
                  >
                    <BsFillPenFill className="text-xs" />
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
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
          <span className="text-4xl mb-3">👥</span>
          <p className="text-sm font-medium">Paydalanıwshılar tabılmadı</p>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
