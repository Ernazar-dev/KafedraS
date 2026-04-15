import { NavLink, Outlet, useLocation } from "react-router-dom";
import { RiRobot2Line, RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { FaFacebook, FaInstagram, FaTelegramPlane } from "react-icons/fa";
import {
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdAccessTime,
  MdDirectionsBus,
} from "react-icons/md";
import logo_kafedra from "../../../assets/images/logo.png";
import { useEffect, useState } from "react";
import ChatBox from "../../../components/AIChat/ChatBox";
import UserMenu from "../../../components/UserMenu/UserMenu";
import api from "../../../api/axios";
import ScrollToTop from "../../../components/ScrollToTop/ScrollToTop";

const navLinks = [
  { to: "/news", label: "Jańalıqlar" },
  { to: "/sciences", label: "Pánler" },
  { to: "/teachers", label: "Muǵallimler" },
  { to: "/groups", label: "Toparlar" },
];

const contactItems = [
  { icon: <MdLocationOn />, text: "Nókis qalasi, A.Temur kóshesi 108" },
  { icon: <MdDirectionsBus />, text: "Jámiyetlik transportlar: 9, 68, 29" },
  { icon: <MdPhone />, text: "+998 90 735-09-09" },
  { icon: <MdEmail />, text: "info@tuit-nukus.uz" },
  { icon: <MdAccessTime />, text: "Dúyshembi – Juma: 8:30 – 18:00" },
];

const Home = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    api.get("/students").catch(console.error);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />

      {/* ───────── HEADER ───────── */}
      <header
        className={`sticky top-0 z-50 bg-[#02135e] text-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_4px_24px_rgba(2,19,94,0.3)]" : "shadow-md"
        }`}
      >
        <div className="max-w-[1300px] mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-3 text-white no-underline group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-md group-hover:bg-white/30 transition" />
                <img
                  src={logo_kafedra}
                  alt="logo"
                  className="relative w-12 h-12 object-contain"
                />
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-[13px] font-bold uppercase tracking-wide m-0">
                  Jasalma intellekt hám
                </p>
                <p className="text-[13px] font-bold uppercase tracking-wide m-0">
                  Kiberqáwipsizlik kafedrası
                </p>
              </div>
            </NavLink>

            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-xl text-lg font-semibold transition-all no-underline ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/75 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* AI Chat Button */}
              <button
                onClick={() => setChatOpen((p) => !p)}
                className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-white/20 hover:border-white/40"
              >
                <RiRobot2Line className="text-lg" />
                <span className="hidden sm:inline">AI Chat</span>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#02135e] animate-pulse" />
              </button>

              <UserMenu />

              {/* Burger */}
              <button
                className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xl transition"
                onClick={() => setMenuOpen((p) => !p)}
              >
                <RiMenu3Line />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-[#02135e] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden shadow-2xl`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={logo_kafedra}
                alt="logo"
                className="w-9 h-9 object-contain"
              />
              <span className="font-bold text-sm text-white">Kafedra</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xl transition"
            >
              <RiCloseLine />
            </button>
          </div>

          {/* Drawer Links */}
          <nav className="flex flex-col gap-1 p-4 flex-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-sm font-semibold no-underline transition ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/75 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* AI in Drawer */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => {
                setChatOpen(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-sm font-semibold transition"
            >
              <RiRobot2Line className="text-lg" />
              AI Chat penen sawbet
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* ───────── FOOTER ───────── */}
      <footer className="bg-[#02135e] text-white mt-16">
        {/* Top wave divider */}
        <div className="h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="max-w-[1300px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-14">
            {/* Brand */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 rounded-xl blur-md" />
                  <img
                    src={logo_kafedra}
                    alt="logo"
                    className="relative w-16 h-16 object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight m-0">
                    Jasalma intellekt hám
                  </p>
                  <p className="text-sm font-bold leading-tight m-0 text-white/80">
                    Kiberqáwipsizlik kafedrası
                  </p>
                </div>
              </div>

              <p className="text-sm text-white/60 leading-relaxed">
                Zamanagóy texnologiyalar hám jasalma intellekt tarawında jetik
                qánigeler tayarlawshı kafedra 
              </p>

              {/* Socials */}
              <div className="flex gap-3">
                {[
                  {
                    icon: <FaTelegramPlane />,
                    href: "#",
                    color: "hover:bg-sky-500",
                  },
                  {
                    icon: <FaInstagram />,
                    href: "#",
                    color: "hover:bg-pink-500",
                  },
                  {
                    icon: <FaFacebook />,
                    href: "#",
                    color: "hover:bg-blue-600",
                  },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 text-white/70 hover:text-white ${s.color} transition-all text-base`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-base font-bold mb-5 flex items-center gap-2">
                <span className="w-5 h-0.5 bg-white/40 inline-block" />
                Baylanıs
              </h3>
              <ul className="flex flex-col gap-3">
                {contactItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-white/70"
                  >
                    <span className="text-white/40 text-base mt-0.5 shrink-0">
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <span className="w-5 h-0.5 bg-white/40 inline-block" />
                Mánzil
              </h3>
              <div className="h-48 rounded-2xl overflow-hidden ring-1 ring-white/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1472.135373211829!2d59.609028091291684!3d42.44325514475605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41dd9b6c95362885%3A0x29b5e1bb7bd42709!2sNukus%20branch%20of%20the%20Tashkent%20University%20of%20Information%20Technologies!5e0!3m2!1suz!2sus!4v1758693862351!5m2!1suz!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="max-w-[1300px] mx-auto px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-4">
              <p className="text-xs text-white/40 text-center">
                © 2025 Jasalma intellekt hám Kiberqáwipsizlik kafedrası
              </p>
              <p className="text-xs text-white/30">TUIT Nókis filiali</p>
            </div>
          </div>
        </div>
      </footer>

      {/* ───────── AI CHAT MODAL ───────── */}
      {chatOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-end justify-end p-4 sm:p-6"
          onClick={() => setChatOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 overflow-hidden">
              <ChatBox />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
