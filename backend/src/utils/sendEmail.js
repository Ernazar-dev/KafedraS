import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Portni 465 ga o'zgartiring (SSL uchun)
    secure: true, // Port 465 uchun true
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"KafedraSayt" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Xatolikni aniq ko'rish uchun try-catch ichiga olamiz
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email yuborildi: ", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email yuborishda xatolik: ", error.message);
    throw new Error("Email yuborish imkoni bo'lmadi");
  }
};