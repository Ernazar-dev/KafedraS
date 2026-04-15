import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) return res.status(401).json({ message: "Foydalanuvchi topilmadi" });
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token noto‘g‘ri yoki muddati tugagan" });
    }
  } else {
    return res.status(401).json({ message: "Token mavjud emas" });
  }
};

export default protect;

