import jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    req.user = null;
    return next();
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    req.user = null;
  }

  next();
};