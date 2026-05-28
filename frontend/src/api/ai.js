import api from "./axios";

export const sendMessageToAI = async (message) => {
  try {
    const res = await api.post("/ai/chat", { message });
    return res.data;
  } catch (err) {
    console.error("AI API Error:", err);
    return { reply: "Server bilan bog‘lanishda xato yuz berdi." };
  }
};
