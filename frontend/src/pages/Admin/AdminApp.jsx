import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PiStudentFill } from "react-icons/pi";
import { ImBook } from "react-icons/im";
import { TiNews } from "react-icons/ti";
import { MdDashboard, MdMenu, MdClose, MdWork } from "react-icons/md";
import { FaSignOutAlt, FaTimes } from "react-icons/fa";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";

const navItems = [
  { to: "/admin/dashboard", icon: <MdDashboard />, label: "Dashboard" },
  { to: "/admin/students", icon: <PiStudentFill />, label: "Studentler" },
  { to: "/admin/subjects", icon: <ImBook />, label: "Pánler" },
  { to: "/admin/news", icon: <TiNews />, label: "Jańalıqlar" },
  { to: "/admin/works", icon: <MdWork />, label: "Works" },
];

export default function AdminApp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <ScrollToTop />

      {/* ─── MOBILE HEADER ─── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 h-14 bg-[#02135e] shadow-lg">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white"
        >
          <MdMenu className="text-xl" />
        </button>
        <span className="font-extrabold text-white text-[15px] tracking-wide">
          Admin Panel
        </span>
        <div className="w-9" />
      </div>

      {/* ─── OVERLAY ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`fixed top-0 left-0 h-full w-[240px] bg-[#02135e] text-white flex flex-col z-50 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:sticky md:top-0 md:h-screen`}
      >
        {/* Sidebar Header */}
        <div className="px-5 pt-6 pb-5 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-xs font-extrabold">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[13px] font-bold text-white leading-none">
                  {username}
                </p>
                <p className="text-[11px] text-white/50 mt-0.5">
                  Administrator
                </p>
              </div>
            </div>
            <button
              className="md:hidden w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <MdClose className="text-base" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            <span className="text-[11px] text-white/50">Online</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 mb-2">
            Menyú
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[13px] transition-all duration-200 no-underline
                ${
                  isActive
                    ? "bg-white text-[#02135e] shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-[17px] shrink-0 ${isActive ? "text-[#02135e]" : ""}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-white transition-all duration-200 text-[13px] font-medium"
          >
            <FaSignOutAlt className="text-base shrink-0" />
            Shıǵıw
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="p-5 sm:p-7 max-w-[1200px] mx-auto">
          <Outlet />
        </div>
      </div>

      {/* ─── LOGOUT CONFIRM MODAL ─── */}
      {showLogout && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLogout(false)}
          style={{ animation: "fadeIn 0.2s ease" }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[320px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideUp 0.25s ease" }}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-[#02135e] to-red-500" />
            <div className="px-6 py-6 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <FaSignOutAlt className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-[17px] font-extrabold text-[#02135e] mb-1">
                Shıǵıwdı tastıyıqlaw
              </h3>
              <p className="text-slate-400 text-[13px] text-center mb-6">
                Haqıyqatında da shıǵıwdı qaleysizbiz be?
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-[14px] hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FaTimes className="text-xs" /> Bekar etiw
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-[14px] active:scale-95 transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt className="text-sm" /> Shıǵıw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
