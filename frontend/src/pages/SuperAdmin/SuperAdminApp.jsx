import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AsideBar from "../../components/AsideBar";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import { MdMenu, MdClose } from "react-icons/md";

const SuperAdminApp = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ScrollToTop />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 bg-[#02135e] text-white">
        <button onClick={() => setSidebarOpen(true)} className="text-2xl">
          <MdMenu />
        </button>
        <span className="font-bold text-lg">Super Admin</span>
        <div />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:sticky md:top-0 md:h-screen`}
      >
        <div className="h-full relative">
          <button
            className="md:hidden absolute top-4 right-4 text-white/80 hover:text-white text-xl z-10"
            onClick={() => setSidebarOpen(false)}
          >
            <MdClose />
          </button>
          <AsideBar closeSidebar={() => setSidebarOpen(false)} />
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 pt-16 md:pt-0">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SuperAdminApp;
