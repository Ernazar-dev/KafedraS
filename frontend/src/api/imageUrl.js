/**
 * Rasm URL ni to'g'rilash utility
 *
 * DB da eski https://kafedrasayd.uz/uploads/... URLlar bo'lishi mumkin.
 * Development da ularni localhost ga o'tkazamiz.
 * Agar fayl localhost da yo'q bo'lsa, production URL ga qaytadi.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const PROD_URL = "https://kafedrasayd.uz";

export function getImageUrl(url) {
  if (!url) return null;

  // Allaqachon localhost URL — o'zgartirmaydi
  if (url.startsWith("http://localhost") || url.startsWith("http://127.0.0.1")) {
    return url;
  }

  // Production URL (kafedrasayd.uz)
  if (url.includes("kafedrasayd.uz")) {
    if (import.meta.env.DEV) {
      // Development: localhost ga yo'naltirish (fayl localhost da bo'lsa)
      return url.replace(PROD_URL, BACKEND_URL);
    }
    // Production: to'g'ridan-to'g'ri ishlatish
    return url;
  }

  // Relative path: /uploads/file.png
  if (url.startsWith("/uploads/")) {
    return `${BACKEND_URL}${url}`;
  }

  // Faqat filename: file.png
  if (!url.startsWith("http")) {
    return `${BACKEND_URL}/uploads/${url}`;
  }

  return url;
}

/**
 * img onError handler — localhost da topilmasa production ga fallback
 * Ishlatish: <img src={...} onError={imgFallback} />
 */
export function imgFallback(e) {
  const currentSrc = e.target.src;
  // Agar localhost dan kelgan xato bo'lsa, production ga o'tkazamiz
  if (currentSrc.startsWith("http://localhost") || currentSrc.startsWith("http://127.0.0.1")) {
    const filename = currentSrc.split("/uploads/")[1];
    if (filename) {
      e.target.onerror = null; // loop oldini olish
      e.target.src = `${PROD_URL}/uploads/${filename}`;
    }
  }
}
