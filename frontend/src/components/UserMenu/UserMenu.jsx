import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import defaultAvatar from "../../assets/images/profil-adam.png";
import { Link } from "react-router-dom";
import {
  FaSignOutAlt,
  FaEdit,
  FaKey,
  FaUpload,
  FaUserShield,
} from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    avatar: defaultAvatar,
    role: "",
  });
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const menuRef = useRef(null);

  useEffect(() => {
    const u = {
      username: localStorage.getItem("username") || "User",
      email: localStorage.getItem("email") || "",
      avatar: localStorage.getItem("avatar") || defaultAvatar,
      role: localStorage.getItem("role") || "",
    };
    setUser(u);
    setNewUsername(u.username);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleUsernameChange = async () => {
    if (!newUsername.trim()) return;
    try {
      setLoading(true);
      const res = await api.put("/users/me/username", {
        username: newUsername,
      });
      setUser((p) => ({ ...p, username: res.data.username }));
      localStorage.setItem("username", res.data.username);
      showMsg("Username tabıslı ózgertildi!");
    } catch {
      showMsg("Qátelik júz berdi!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword.trim()) return;
    try {
      setLoading(true);
      await api.put("/users/me/password", { password: newPassword });
      setNewPassword("");
      showMsg("Parol tabıslı ózgertildi!");
    } catch {
      showMsg("Qátelik júz berdi!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result;
      setUser((p) => ({ ...p, avatar: b64 }));
      localStorage.setItem("avatar", b64);
      showMsg("Avatar ózgertildi!");
    };
    reader.readAsDataURL(file);
  };

  const getDashboardLink = () => {
    if (user.role === "superAdmin") return "/superadmin/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return null;
  };

  const dashboardPath = getDashboardLink();

  const inputClass =
    "flex-1 px-3 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl outline-none focus:border-[#02135e]/40 focus:ring-2 focus:ring-[#02135e]/10 transition placeholder:text-slate-400 text-[#02135e]";

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/30 hover:border-white transition-all cursor-pointer"
      >
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-full h-full object-cover bg-white rounded-full"
        />
      </button>

      {open && (
        <div className="absolute right-0 top-13 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-slate-100 mt-2">
          {/* Header */}
          <div className="relative flex items-center gap-3 p-4 bg-[#02135e]">
            {/* Avatar */}
            <label className="cursor-pointer group relative shrink-0">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-13 h-13 w-12 h-12 rounded-xl object-cover border-2 border-white/30 group-hover:opacity-80 transition bg-white"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <FaUpload className="text-white text-xs drop-shadow" />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white truncate">
                {user.username}
              </p>
              <p className="text-xs text-white/60 truncate">{user.email}</p>
              {user.role && (
                <span className="inline-block mt-1 text-[10px] font-semibold bg-white/15 text-white/80 px-2 py-0.5 rounded-lg capitalize">
                  {user.role}
                </span>
              )}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
            >
              <RiCloseLine />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col gap-4">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <FaEdit className="text-[#02135e]/60" /> Username
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Yangi username"
                  className={inputClass}
                />
                <button
                  onClick={handleUsernameChange}
                  disabled={loading}
                  className="px-4 py-2 bg-[#02135e] hover:bg-[#03197a] text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
                >
                  OK
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <FaKey className="text-[#02135e]/60" /> Parol
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yangi parol"
                  className={inputClass}
                />
                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="px-4 py-2 bg-[#02135e] hover:bg-[#03197a] text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
                >
                  OK
                </button>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <p
                className={`text-xs text-center font-medium px-3 py-2 rounded-xl ${
                  message.type === "error"
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {message.text}
              </p>
            )}

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {/* Avatar upload */}
              <label className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#02135e] cursor-pointer transition font-medium">
                <FaUpload className="text-[10px]" /> Súwret júklew
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-3">
                {dashboardPath && (
                  <Link
                    to={dashboardPath}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#02135e] hover:text-blue-700 no-underline transition"
                  >
                    <FaUserShield className="text-[10px]" /> Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition"
                >
                  <FaSignOutAlt className="text-[10px]" /> Shıǵıw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
