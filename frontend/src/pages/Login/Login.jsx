import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginUser,
  verify2FAPin,
  requestRecoveryCode,
  verifyRecoveryCode,
} from "../../api/auth";
import {
  FaLock,
  FaUser,
  FaKey,
  FaEnvelope,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Login = () => {
  // Bosqichlar: 'login' | '2fa' | 'recovery'
  const [step, setStep] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");

  // Ko'rinuvchanlik holatlari
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1-Qadam: Oddiy Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser({ username, password });
      if (res.twoFactorRequired) {
        setStep("2fa");
      } else {
        saveAuthAndNavigate(res);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login qátesi: Maǵlıwmatlar nadurıs",
      );
    } finally {
      setLoading(false);
    }
  };

  // 2-Qadam: PIN tasdiqlash
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verify2FAPin({ username, pin });
      saveAuthAndNavigate(res);
    } catch (err) {
      setError(err.response?.data?.message || "Qáwipsizlik kodı nadurıs");
    } finally {
      setLoading(false);
    }
  };

  // 3-Qadam: Recovery Code so'rash
  const handleForgotPin = async () => {
    setError("");
    setLoading(true);
    try {
      await requestRecoveryCode({ username });
      setStep("recovery");
    } catch (err) {
      setError("Email jiberiwde qátelik júz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // 4-Qadam: Recovery Code tasdiqlash
  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verifyRecoveryCode({ username, code: recoveryCode });
      saveAuthAndNavigate(res);
    } catch (err) {
      setError("Tastıyıqlaw kodı nadurıs yamasa múddeti ótken");
    } finally {
      setLoading(false);
    }
  };

  const saveAuthAndNavigate = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("username", data.username);
    localStorage.setItem("email", data.email);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa] p-5 font-sans">
      <div className="w-full max-w-[400px]">
        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="h-1.5 w-full bg-[#02135e]" />

          <div className="px-8 py-10">
            {/* --- HEADER --- */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-[#02135e] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/20">
                {step === "login" && <FaLock className="text-white text-2xl" />}
                {step === "2fa" && <FaKey className="text-white text-2xl" />}
                {step === "recovery" && (
                  <FaEnvelope className="text-white text-2xl" />
                )}
              </div>
              <h2 className="text-2xl font-black text-[#02135e] uppercase tracking-tight">
                {step === "login" && "Sistemaǵa Kiriw"}
                {step === "2fa" && "Qáwipsizlik Kodı"}
                {step === "recovery" && "Tiklew"}
              </h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                {step === "login" && "Kafedra xızmetkerleri ushın"}
                {step === "2fa" && "Sırlı kodińızdı kiritiń"}
                {step === "recovery" && "Email kodińızdı kiritiń"}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-[11px] font-black px-4 py-3 rounded-xl mb-6 text-center uppercase tracking-wide">
                {error}
              </div>
            )}

            {/* --- FORMS --- */}

            {/* Step 1: Login Form */}
            {step === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Username
                  </label>
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#02135e] transition-colors" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:border-[#02135e] focus:bg-white"
                      placeholder="Login kiritiń"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Parol
                  </label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#02135e] transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:border-[#02135e] focus:bg-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#02135e] transition-colors"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={16} />
                      ) : (
                        <FaEye size={16} />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#02135e] text-white font-black text-[11px] uppercase tracking-[2px] hover:bg-[#031d8c] transition-all mt-4"
                >
                  {loading ? "Júklenbekte..." : "Dawam etiw"}
                </button>
              </form>
            )}

            {/* Step 2: 2FA PIN Form */}
            {step === "2fa" && (
              <form onSubmit={handlePinSubmit} className="space-y-6">
                <div className="space-y-3">
                  <div className="relative group">
                    <input
                      type={showPin ? "text" : "password"}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      required
                      className="w-full text-center py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-2xl font-black tracking-[10px] outline-none focus:border-[#02135e] focus:bg-white transition-all px-12"
                      placeholder="••••••"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#02135e] transition-colors"
                    >
                      {showPin ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                  <div className="flex justify-between px-1">
                    <button
                      type="button"
                      onClick={() => setStep("login")}
                      className="text-[10px] font-black text-slate-400 uppercase hover:text-[#02135e] flex items-center gap-1"
                    >
                      <FaArrowLeft /> Artqa
                    </button>
                    <button
                      type="button"
                      onClick={handleForgotPin}
                      className="text-[10px] font-black text-blue-600 uppercase hover:underline"
                    >
                      Kodtı umıttıńızba?
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || pin.length < 3}
                  className="w-full py-4 rounded-xl bg-[#02135e] text-white font-black text-[11px] uppercase tracking-[2px] hover:bg-[#031d8c] transition-all"
                >
                  {loading ? "Tekserilmekte..." : "Tastıyıqlaw"}
                </button>
              </form>
            )}

            {/* Step 3: Recovery Code Form */}
            {step === "recovery" && (
              <form onSubmit={handleRecoverySubmit} className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                    Emailıńızǵa kelgen 6 xanalı kodtı kiritiń.
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    value={recoveryCode}
                    onChange={(e) =>
                      setRecoveryCode(e.target.value.replace(/\D/g, ""))
                    }
                    required
                    className="w-full text-center py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-2xl font-black tracking-[15px] outline-none focus:border-[#02135e] focus:bg-white transition-all"
                    placeholder="000000"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setStep("2fa")}
                    className="text-[10px] font-black text-slate-400 uppercase hover:text-[#02135e] flex items-center gap-1"
                  >
                    <FaArrowLeft /> PINǵa qaytıw
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading || recoveryCode.length < 6}
                  className="w-full py-4 rounded-xl bg-blue-600 text-white font-black text-[11px] uppercase tracking-[2px] hover:bg-blue-700 transition-all"
                >
                  {loading ? "Tekserilmekte..." : "Kodtı Tastıyıqlaw"}
                </button>
              </form>
            )}

            {/* --- FOOTER --- */}
            {step === "login" && (
              <div className="text-center mt-10">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  Akkauntıńız joq pa?{" "}
                  <Link
                    to="/register"
                    className="text-[#02135e] hover:underline ml-1"
                  >
                    Registraciya
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
