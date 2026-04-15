import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const action = useNavigationType(); // "PUSH", "POP" yoki "REPLACE" qaytaradi

  useEffect(() => {
    // Brauzerga: "Skrollni o'zing eslab qol" deymiz (avvalgidek 'manual' emas, 'auto')
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto';
    }

    // Agar harakat "POP" bo'lmasa (ya'ni yangi sahifaga o'tish bo'lsa - PUSH)
    // unda tepaga chiqaramiz.
    // Agar "POP" (Orqaga qaytish) bo'lsa, brauzer o'zi eski joyga tushiradi.
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
    
  }, [action, pathname]);

  return null;
}