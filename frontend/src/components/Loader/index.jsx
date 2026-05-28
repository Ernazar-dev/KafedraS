import React, { createContext, useState, useEffect } from "react";
import api from "../../api/axios";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loadingCounter, setLoadingCounter] = useState(0);

  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        setLoadingCounter((prev) => prev + 1);
        return config;
      },
      (error) => {
        setLoadingCounter((prev) => prev - 1);
        return Promise.reject(error);
      }
    );

    const resInterceptor = api.interceptors.response.use(
      (response) => {
        setLoadingCounter((prev) => Math.max(0, prev - 1));
        return response;
      },
      (error) => {
        setLoadingCounter((prev) => Math.max(0, prev - 1));
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, []);

  const isLoading = loadingCounter > 0;

  return (
    <LoaderContext.Provider value={{ isLoading }}>
      {children}
      {isLoading && <SpinnerUI />}
    </LoaderContext.Provider>
  );
};

const SpinnerUI = () => (
  <>
    <style>{`
      @keyframes spin-cw {
        to { transform: rotate(360deg); }
      }
      @keyframes spin-ccw {
        to { transform: rotate(-360deg); }
      }
      @keyframes fade-up {
        0%, 100% { opacity: 0.4; transform: translateY(3px); }
        50%       { opacity: 1;   transform: translateY(0); }
      }

      .ring-outer {
        width: 80px; height: 80px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: #00d2ff;
        animation: spin-cw 1.8s linear infinite;
        position: relative;
      }
      .ring-outer::before {
        content: "";
        position: absolute;
        inset: 6px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: #7eb8ff;
        animation: spin-ccw 2.4s linear infinite;
      }
      .ring-outer::after {
        content: "";
        position: absolute;
        inset: 16px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: #ffffff;
        animation: spin-cw 1.2s linear infinite;
      }
      .ring-glow {
        filter: drop-shadow(0 0 10px rgba(0, 210, 255, 0.7));
      }
      .loader-text {
        animation: fade-up 1.6s ease-in-out infinite;
      }
    `}</style>

    {/* Overlay */}
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-[#02135e]">
      {/* Subtle radial glow in bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,210,255,0.08) 0%, transparent 70%)" }}
      />

      <div className="flex flex-col items-center gap-6 relative">
        {/* Spinner */}
        <div className="ring-glow">
          <div className="ring-outer" />
        </div>

        {/* Dots row */}
        <div className="flex items-center gap-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] inline-block"
              style={{ animation: `fade-up 1.6s ease-in-out ${i * 0.25}s infinite` }}
            />
          ))}
        </div>

        {/* Text */}
        <p
          className="loader-text text-[13px] font-bold tracking-[4px] uppercase text-[#00d2ff]"
          style={{ fontFamily: "'Segoe UI', sans-serif" }}
        >
          Júklenip atır
        </p>
      </div>
    </div>
  </>
);

export default LoaderProvider;