import api from "./axios";

/**
 * Joriy foydalanuvchi ma'lumotlarini olish (profil, rol, 2FA holati)
 */
export const fetchMe = async () => {
  return await api.get("/users/me");
};

/**
 * 2FA (Ikki bosqichli kirish)ni yoqish yoki o'chirish
 * @param {boolean} enable - true (yoqish) yoki false (o'chirish)
 * @param {string} pin - 6 xonali raqamli PIN kod (faqat yoqishda kerak)
 */
export const toggle2FA = async (enable, pin) => {
  return await api.post("/users/2fa/toggle", { enable, pin });
};

/**
 * Username'ni o'zgartirish
 */
export const updateUsername = async (username) => {
  return await api.put("/users/me/username", { username });
};

/**
 * Parolni o'zgartirish
 */
export const updatePassword = async (password) => {
  return await api.put("/users/me/password", { password });
};