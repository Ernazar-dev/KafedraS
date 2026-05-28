/**
 * ROLE-BASED AUTHORIZATION MIDDLEWARE
 * Ishlatilish tartibi:
 * protect → authorizeRoles(...)
 */

 /**
  * ✅ Универсал middleware
  * Misol:
  * router.post("/news", protect, authorizeRoles("admin", "superAdmin"), createNews)
  */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // protect ishlamagan bo‘lsa
    if (!req.user) {
      return res.status(401).json({ message: "Token mavjud emas" });
    }

    // role tekshiruvi
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Ruxsat yo‘q" });
    }

    next();
  };
};

/**
 * ✅ ADMIN yoki SUPERADMIN uchun shortcut
 */
export const adminOrSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Token mavjud emas" });
  }

  if (req.user.role === "admin" || req.user.role === "superAdmin") {
    return next();
  }

  return res.status(403).json({ message: "Access denied" });
};

/**
 * ✅ FAQAT SUPERADMIN
 */
export const superAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Token mavjud emas" });
  }

  if (req.user.role !== "superAdmin") {
    return res.status(403).json({ message: "SuperAdmin kerak" });
  }

  next();
};