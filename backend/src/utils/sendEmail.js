import nodemailer from "nodemailer";
import axios from "axios";

export const sendEmail = async (options) => {
  // Env o'zgaruvchilarni tozalash (Renderda qo'shtirnoq yoki bo'shliqlar qo'shilib qolishini oldini olish uchun)
  const resendApiKey = process.env.RESEND_API_KEY?.trim().replace(/^["']|["']$/g, "");
  const emailFrom = process.env.EMAIL_FROM?.trim().replace(/^["']|["']$/g, "");
  const emailHost = process.env.EMAIL_HOST?.trim().replace(/^["']|["']$/g, "");
  const emailPort = process.env.EMAIL_PORT?.trim().replace(/^["']|["']$/g, "");
  const emailSecure = process.env.EMAIL_SECURE?.trim().replace(/^["']|["']$/g, "");
  const emailUser = process.env.EMAIL_USER?.trim().replace(/^["']|["']$/g, "");
  const emailPass = process.env.EMAIL_PASS?.trim().replace(/^["']|["']$/g, "");

  // Agar RESEND_API_KEY o'rnatilgan bo'lsa, Resend API orqali yuboramiz (Render va boshqa SMTP bloklangan serverlar uchun eng qulay yo'l)
  if (resendApiKey) {
    try {
      console.log("➡️ Resend API orqali email yuborilmoqda...");
      const response = await axios.post(
        "https://api.resend.com/emails",
        {
          from: emailFrom || `KafedraSayt <onboarding@resend.dev>`,
          to: options.email,
          subject: options.subject,
          text: options.message,
        },
        {
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
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
    host: emailHost || "smtp.gmail.com",
    port: parseInt(emailPort || "465"),
    secure: emailSecure !== "false", // Standart holatda true (port 465 uchun), agar "false" bo'lsa false bo'ladi
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: emailFrom || `"KafedraSayt" <${emailUser}>`,
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