import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", { username, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registraciya qátesi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa] p-5 font-sans">
      <div className="w-full max-w-[400px]">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="h-1.5 w-full bg-[#02135e]" />

          <div className="px-8 py-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4 text-[#02135e]">
                <FaUserPlus size={24} />
              </div>
              <h2 className="text-2xl font-black text-[#02135e] uppercase tracking-tight">
                Registraciya
              </h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                Jańa akkaunt jaratıw
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl mb-6 text-center uppercase tracking-wide">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                  Username
                </label>
                <div className="relative group">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#02135e] transition-colors" />
                  <input
                    type="text"
                    value={username}
                    placeholder="Login tańlań'"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:border-[#02135e] focus:bg-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                  Email
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#02135e] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    placeholder="pochta@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:border-[#02135e] focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                  Parol
                </label>
                <div className="relative group">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#02135e] transition-colors" />
                  <input
                    type="password"
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:border-[#02135e] focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#02135e] text-white font-black text-xs uppercase tracking-[2px] transition-all hover:bg-[#031d8c] mt-4"
              >
                {loading ? "Júklenbekte..." : "Registraciyadan ótiw"}
              </button>

              <div className="text-center mt-6">
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  Akkauntıńız bar ma?{" "}
                  <Link
                    to="/login"
                    className="text-[#02135e] hover:underline ml-1"
                  >
                    Kiriw
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
