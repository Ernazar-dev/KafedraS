import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../../api/axios";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      // Tizimga birinchi kirganda rolni tekshirish (navigatsiyada har safar so'rov yubormaslik uchun)
      api.get("/auth/me")
        .then((res) => {
          const serverRole = res.data.role;
          if (serverRole !== role) {
            localStorage.setItem("role", serverRole);
            // Sahifani qayta yuklash orqali yangi rolni faollashtiramiz
            window.location.reload();
          }
        })
        .catch((err) => {
          console.error("Xavfsizlik profili tekshiruvi xatosi:", err.message);
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/login";
        });
    }
  }, [isLoggedIn, role]);

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role))
    return <Navigate to="/403" replace />;

  return children;
};

export default ProtectedRoute;