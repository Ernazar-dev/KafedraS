import { createBrowserRouter, Navigate } from "react-router-dom";

import PrivateRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

// Client
import Home from "../pages/Client/Home";
import HomePage from "../pages/Client/HomePage";
import Sciences from "../pages/Client/Sciences";
import Teachers from "../pages/Client/Teachers";
import News from "../pages/Client/News";
import NewsSection from "../pages/Client/NewsSection";
import Groups from "../pages/Client/Groups";
import WorksDashboard from "../pages/Client/works/works";

// Admin
import AdminApp from "../pages/Admin/AdminApp";
import Dashboard from "../pages/Admin/pages/Dashboard/Dashboard";
import AdminStudents from "../pages/Admin/pages/Students/AdminStudents";
import AdminSubjects from "../pages/Admin/pages/Subjects/AdminSubjects";
import AdminNews from "../pages/Admin/pages/News/AdminNews";

// SuperAdmin
import SuperAdminApp from "../pages/SuperAdmin/SuperAdminApp";
import SuperAdminDashboard from "../pages/SuperAdmin/pages/Dashboard/SuperAdminDashboard";
import SuperAdminUsers from "../pages/SuperAdmin/pages/Users/SuperAdminUsers";
import SuperAdminTeachers from "../pages/SuperAdmin/pages/Teachers/SuperAdminTeachers";
import SuperAdminNews from "../pages/SuperAdmin/pages/News/SuperAdminNews";
import SuperAdminSubjects from "../pages/SuperAdmin/pages/Subjects/SuperAdminSubjects";
import SuperAdminStudents from "../pages/SuperAdmin/pages/Students/SuperAdminStudents";
import ActivityLogPage from "../pages/SuperAdmin/pages/Logs/ActivityLogPage";
import WorksPage from "../pages/SuperAdmin/pages/Statistika/SuperAdminStatistika";

// Auth
import Login from "../pages/Login/Login";
import Register from "../pages/Register/RegisterPage";
import AdminWorks from "../pages/Admin/pages/AdminWorks";

export const routes = createBrowserRouter([
  // ✅ AUTH ROUTES
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },

  // ✅ CLIENT
  {
    path: "/",
    element: (
      <PrivateRoute allowedRoles={["user", "admin", "superAdmin"]}>
        <Home />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "groups", element: <Groups /> },
      { path: "sciences", element: <Sciences /> },
      { path: "teachers", element: <Teachers /> },
      { path: "news", element: <News /> },
      { path: "news/:id", element: <NewsSection /> },
      { path: "works", element: <WorksDashboard /> },
    ],
  },

  // ✅ ADMIN (TEACHER)
  {
    path: "/admin",
    element: (
      <PrivateRoute allowedRoles={["admin"]}>
        <AdminApp />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "students", element: <AdminStudents /> },
      { path: "subjects", element: <AdminSubjects /> },
      { path: "news", element: <AdminNews /> },
      { path: "works", element: <AdminWorks /> },
    ],
  },

  // ✅ SUPERADMIN
  {
    path: "/superadmin",
    element: (
      <PrivateRoute allowedRoles={["superAdmin"]}>
        <SuperAdminApp />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <SuperAdminDashboard /> },
      { path: "users", element: <SuperAdminUsers /> },
      { path: "teachers", element: <SuperAdminTeachers /> },
      { path: "news", element: <SuperAdminNews /> },
      { path: "subjects", element: <SuperAdminSubjects /> },
      { path: "students", element: <SuperAdminStudents /> },
      { path: "logs", element: <ActivityLogPage /> },
      { path: "works", element: <WorksPage /> },
    ],
  },
]);
