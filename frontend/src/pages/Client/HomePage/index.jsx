import { useEffect } from "react";
import logo_sh_1 from "../../../assets/images/aloqaBank_logo.png";
import logo_sh_2 from "../../../assets/images/ITcenter_logo.png";
import logo_sh_3 from "../../../assets/images/NMTU_logo2.jpg";
import heroBg from "../../../assets/images/TI_fak.jpg";
import { FaHistory, FaHandshake } from "react-icons/fa";
import api from "../../../api/axios";
import NewsSlider from "../../../components/NewsSlider/NewsSlider";
import IlmiyJumislar from "../../../components/ilmiyJumislar/index";

const animateCounter = (id, endValue) => {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const increment = Math.ceil(endValue / 80);
  const timer = setInterval(() => {
    start += increment;
    if (start >= endValue) {
      el.innerText = endValue;
      clearInterval(timer);
    } else el.innerText = start;
  }, 20);
};

const PARTNERS = [
  { logo: logo_sh_1, name: "Aloqa Bank" },
  { logo: logo_sh_2, name: "IT Center" },
  { logo: logo_sh_3, name: "NMTU" },
];

const HISTORY_PARAGRAPHS = [
  <>
    Universitet{" "}
    <strong className="text-gray-800">
      "Nókis mámleketlik texnika universiteti"n shólkemlestiriw haqqında"ǵı
      Prezident qararı
    </strong>{" "}
    (PQ-25-sanlı, 2025-jıl 24-yanvar) tiykarında shólkemlestirildi.
  </>,
  "Wazıypaları hám Sanaat, texnika-texnologiya hám injenerlik tarawları ushın joqarı mamanlıqtaǵı qánigeler hám ilimiy-pedagogikalıq kadrlar tayarlaw, mamanlıǵın arttırıw hám qayta tayarlaw universitettiń tiykarǵı wazıypalarınan biri bolıp esaplanadı.",
  "2025/2026 oqıw jılınan baslap tájiriybe-óndiris («spin-off») kárxanası shólkemlestiriledi.",
];

const HomePage = () => {
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [sRes, tRes, eRes] = await Promise.all([
          api.get("/students"),
          api.get("/teachers"),
          api.get("/subjects"),
        ]);
        const students = Array.isArray(sRes.data) ? sRes.data.length : 0;
        const teachers = Array.isArray(tRes.data) ? tRes.data.length : 0;
        const subjects = Array.isArray(eRes.data) ? eRes.data.length : 0;
        setTimeout(() => {
          animateCounter("teacherCounter", teachers);
          animateCounter("studentCounter", students);
          animateCounter("subjectCounter", subjects);
        }, 200);
      } catch (err) {
        console.error("API qátesi:", err);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="bg-[#f8fafc] overflow-x-hidden">
      {/* ── HERO ── */}
      <section
        className="relative w-full flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: 500,
          maxHeight: 700,
          height: "90vh",
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#2a2a40]/60" />

        <div className="relative z-10 flex flex-col items-center gap-10 px-5 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-4">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full">
              NMTU
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
              Jasalma intellekt hám
              <br />
              <span className="text-amber-400">Kiberqáwipsizlik</span> kafedrası
            </h1>
          </div>

          {/* Counters */}
          <div className="flex gap-8 sm:gap-16">
            {[
              { id: "teacherCounter", label: "Oqıtıwshılar" },
              { id: "studentCounter", label: "Studentler" },
              { id: "subjectCounter", label: "Pánler" },
            ].map(({ id, label }) => (
              <div key={id} className="flex flex-col items-center gap-1">
                <span
                  id={id}
                  className="text-4xl sm:text-5xl font-extrabold text-amber-400 leading-none tabular-nums"
                >
                  0
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white/75 uppercase tracking-widest mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
            <span className="text-xs text-white/60">Tómenge</span>
            <div className="w-px h-8 bg-white/30 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── NEWS SLIDER ── */}
      <div className="-mt-1">
        <NewsSlider />
      </div>

      {/* ── ILMIY ISHLAR ── */}
      <IlmiyJumislar />

      {/* ── KAFEDRA TARIXI ── */}
      <section className="py-16 bg-[#f0f4ff]">
        <div className="max-w-[1400px] mx-auto px-5">
          {/* Section Title */}
          <div className="flex flex-col items-center gap-2 mb-10 text-center">
            <div className="flex items-center gap-2 text-[#02135e]">
              <FaHistory className="text-2xl" />
              <h2 className="text-2xl sm:text-3xl font-extrabold m-0">
                Kafedra Tariyxı
              </h2>
            </div>
            <div className="w-14 h-1 bg-[#02135e] rounded-full opacity-40" />
          </div>

          {/* History Card */}
          <div className="bg-white rounded-2xl shadow-sm border-l-4 border-[#02135e] overflow-hidden">
            <div className="p-8 sm:p-10">
              <h3 className="text-xl sm:text-2xl font-bold text-[#02135e] mb-6 pb-5 border-b border-slate-100">
                Jasalma intellekt hám Kiberqáwipsizlik kafedrası
              </h3>
              <div className="flex flex-col gap-5">
                {HISTORY_PARAGRAPHS.map((para, i) => (
                  <p
                    key={i}
                    className="text-gray-600 leading-relaxed text-sm sm:text-base text-justify"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      {/* ── PARTNERS ── */}
      <section className="pt-12 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-5">
          <div className="flex flex-col items-center gap-2 mb-10 text-center">
            <div className="flex items-center gap-2 text-[#02135e]">
              <FaHandshake className="text-2xl" />
              <h2 className="text-2xl sm:text-3xl font-extrabold m-0">
                Birge islewshiler
              </h2>
            </div>
            <div className="w-14 h-1 bg-[#02135e] rounded-full opacity-40" />
          </div>
        </div>

        <div className="relative w-full overflow-hidden pb-10">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

          <div
            className="flex items-center gap-10"
            style={{
              animation: "partners-scroll 20s linear infinite",
              width: "max-content",
            }}
          >
            {[...PARTNERS, ...PARTNERS].map((partner, i) => (
              <div
                key={i}
                className="group shrink-0 w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center p-4 rounded-full border-2 border-slate-100 bg-[#f8fafc] hover:border-blue-300 hover:shadow-[0_8px_24px_rgba(59,130,246,0.15)] transition-all duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes partners-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>
    </div>
  );
};

export default HomePage;
