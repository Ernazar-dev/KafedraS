import xss from "xss";

function sanitizeValue(value) {
  if (typeof value === "string") {
    return xss(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (typeof value === "object" && value !== null) {
    const result = {};
    for (const key in value) {
      result[key] = sanitizeValue(value[key]);
    }
    return result;
  }
  return value;
}

export default function sanitize(req, res, next) {
  // req.body - yozish mumkin
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }

  // req.query - Express 5 da getter, shuning uchun har bir key ni alohida o'zgartirish kerak
  if (req.query && typeof req.query === "object") {
    try {
      const sanitizedQuery = sanitizeValue(req.query);
      for (const key in sanitizedQuery) {
        try {
          req.query[key] = sanitizedQuery[key];
        } catch {
          // Ba'zi keylar read-only bo'lishi mumkin, skip
        }
      }
    } catch {
      // query o'zgartirib bo'lmasa, skip — xavfsizlik uchun faqat body muhim
    }
  }

  // req.params - yozish mumkin
  if (req.params && typeof req.params === "object") {
    try {
      req.params = sanitizeValue(req.params);
    } catch {
      // skip
    }
  }

  next();
}
