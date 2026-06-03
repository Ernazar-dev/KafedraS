import nodemailer from "nodemailer";
import axios from "axios";

export const sendEmail = async (options) => {
  // Agar RESEND_API_KEY o'rnatilgan bo'lsa, Resend API orqali yuboramiz (Render va boshqa SMTP bloklangan serverlar uchun eng qulay yo'l)
  if (process.env.RESEND_API_KEY) {
    try {
      console.log("➡️ Resend API orqali email yuborilmoqda...");
      const response = await axios.post(
        "https://api.resend.com/emails",
        {
          from: process.env.EMAIL_FROM || `KafedraSayt <onboarding@resend.dev>`,
          to: options.email,
          subject: options.subject,
          text: options.message,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Email Resend API orqali muvaffaqiyatli yuborildi. ID: ", response.data.id);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Resend API orqali yuborishda xatolik: ",
        error.response?.data || error.message
      );
      throw new Error(
        `Email yuborish imkoni bo'lmadi (Resend API xatosi): ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  // Aks holda standart SMTP (Nodemailer) orqali yuboramiz
  console.log("➡️ SMTP (Nodemailer) orqali email yuborilmoqda...");
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "465"),
    secure: process.env.EMAIL_SECURE !== "false", // Standart holatda true (port 465 uchun), agar "false" bo'lsa false bo'ladi
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"KafedraSayt" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email SMTP orqali yuborildi: ", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email SMTP orqali yuborishda xatolik: ", error.message);
    throw new Error(`Email yuborish imkoni bo'lmadi: ${error.message}`);
  }
};