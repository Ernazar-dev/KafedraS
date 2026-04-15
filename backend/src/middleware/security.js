import helmet from "helmet";

export default helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Faqat ishonchli scriptlar
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "http://localhost:5000"], // Rasm manbalarini cheklash
      connectSrc: ["'self'", "https://kafedrasayd.uz", "http://localhost:5000"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
});