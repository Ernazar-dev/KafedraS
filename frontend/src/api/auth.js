import api from "./axios"; // markaziy api instance

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// 2FA PIN tasdiqlash uchun yangi funksiya
export const verify2FAPin = async (data) => {
  const res = await api.post("/auth/verify-pin", data);
  return res.data;
};

// PIN esdan chiqqanda emailga kod so'rash
export const requestRecoveryCode = async (data) => {
  const res = await api.post("/auth/request-recovery", data);
  return res.data;
};

// Email kodni tasdiqlash
export const verifyRecoveryCode = async (data) => {
  const res = await api.post("/auth/verify-recovery", data);
  return res.data;
};
