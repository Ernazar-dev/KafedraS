import { useState } from "react";
import {
  FaUser, FaChalkboardTeacher, FaNewspaper, FaBook,
  FaLayerGroup, FaChartBar, FaFileAlt, FaChevronDown
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import Logout from "../Logout";

const AsideBar = ({ closeSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition no-underline
    ${isActive ? "bg-white/25 text-white" : "text-white/80 hover:bg-white/15 hover:text-white"}`;

  return (
    <div className="flex flex-col h-full py-6 px-5 bg-[#02135e] text-white">
      <div className="mb-8">
        <h2 className="text-xl font-bold">SuperAdmin</h2>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <NavLink to="/superadmin/dashboard" onClick={closeSidebar} className={linkClass}>
          <MdDashboard className="text-lg" /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/superadmin/users" onClick={closeSidebar} className={linkClass}>
          <FaUser /> <span>Paydalanıwshılar</span>
        </NavLink>

        {/* Dropdown */}
        <div>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/15 hover:text-white transition"
          >
            <div className="flex items-center gap-3">
              <FaLayerGroup /> <span>ListNav</span>
            </div>
            <FaChevronDown
              className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-white/20 pl-3">
              <NavLink to="/superadmin/teachers" onClick={closeSidebar} className={linkClass}>
                <FaChalkboardTeacher /> Muǵallimler
              </NavLink>
              <NavLink to="/superadmin/news" onClick={closeSidebar} className={linkClass}>
                <FaNewspaper /> Jańalıqlar
              </NavLink>
              <NavLink to="/superadmin/subjects" onClick={closeSidebar} className={linkClass}>
                <FaBook /> Pánler
              </NavLink>
              <NavLink to="/superadmin/students" onClick={closeSidebar} className={linkClass}>
                <FaLayerGroup /> Studentler
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/superadmin/works" onClick={closeSidebar} className={linkClass}>
          <FaChartBar /> <span>Statistika</span>
        </NavLink>

        <NavLink to="/superadmin/logs" onClick={closeSidebar} className={linkClass}>
          <FaFileAlt /> <span>AuditLog</span>
        </NavLink>
      </nav>

      <div className="mt-4 flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-red-500/20 rounded-lg transition cursor-pointer">
        <Logout />
      </div>
    </div>
  );
};

export default AsideBar;
