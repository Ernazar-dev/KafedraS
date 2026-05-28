import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaExclamationTriangle, FaArrowLeft, FaHome } from "react-icons/fa";

const ErrorPage = ({ type = "404" }) => {
  const navigate = useNavigate();

  const is403 = type === "403";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa] p-5 font-sans">
      <div className="w-full max-w-[500px] text-center">
        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden p-8 sm:p-12">
          {/* Top colored accent line */}
          <div className="h-1.5 w-full bg-[#02135e] absolute top-0 left-0" />

          {/* Animated Icon Container */}
          <div className="relative w-24 h-24 rounded-3xl bg-[#02135e]/5 flex items-center justify-center mx-auto mb-8 transition-transform hover:scale-105 duration-300">
            {is403 ? (
              <>
                <div className="absolute inset-0 bg-red-500/10 rounded-3xl animate-pulse" />
                <FaShieldAlt className="text-red-600 text-5xl relative z-10 animate-bounce" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[#02135e]/10 rounded-3xl animate-pulse" />
                <FaExclamationTriangle className="text-[#02135e] text-5xl relative z-10" />
              </>
            )}
          </div>

          {/* Error Code & Title */}
          <h1 className="text-6xl font-black text-[#02135e] tracking-tight mb-2">
            {is403 ? "403" : "404"}
          </h1>
          <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-wide">
            {is403 ? "Kirish taqiqlangan" : "Sahifa topilmadi"}
          </h2>

          {/* Error Description */}
          <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-[360px] mx-auto">
            {is403
              ? "Kiberxavfsizlik tizimi: Ushbu sahifaga kirish uchun sizda yetarli huquqlar yoki ruxsatnomalar mavjud emas."
              : "Kechirasiz, siz qidirayotgan sahifa mavjud emas, o'chirilgan yoki manzili o'zgartirilgan bo'lishi mumkin."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#02135e] hover:border-[#02135e] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <FaArrowLeft size={12} />
              Ortga qaytish
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#02135e] text-white hover:bg-[#031d8c] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 no-underline transition-all"
            >
              <FaHome size={12} />
              Bosh sahifaga
            </Link>
          </div>
        </div>

        {/* Small footer text */}
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-6">
          Jasalma intellekt hám Kiberqáwipsizlik kafedrası
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
