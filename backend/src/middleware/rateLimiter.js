import rateLimit from "express-rate-limit";

// Umumiy barcha API uchun cheklov (DDoS-ga qarshi)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 300, // Har bir IP uchun 15 minutda max 100 ta so'rov
  message: { message: "Juda ko'p so'rov yuborildi. Iltimos, 15 daqiqa kuting." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Faqat Login va Register uchun qat'iy cheklov (Brute Force-ga qarshi)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 soat
  max: 10, // 1 soat ichida bir xil IP dan faqat 10 marta login qilishga urinish mumkin
  message: { message: "Login uchun ko'p urinish qilindi. Iltimos, 1 soatdan keyin harakat qiling." },
});