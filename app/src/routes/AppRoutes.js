import { Routes, Route } from "react-router-dom";
import Home from "./../pages/Home";
import Login from "../pages/Login";
import StudentDashboard from "../pages/student/Dashboard";
import AdminDashboard from "./../pages/admin/Dashboard";
import ClubDashboard from "./../pages/club/Dashboard";
import NotFound from "./../pages/NotFound";
import ProtectedRoute from "./../components/ProtectedRoute";
import Signup from "./../pages/SignUp"

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />

    <Route path="/signup" element={<Signup />} />

    <Route element={<ProtectedRoute allowedRoles={['student']} />}>
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/settings" element={<StudentDashboard />} />
    </Route>
    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Route>
    <Route element={<ProtectedRoute allowedRoles={['club']} />}>
      <Route path="/club/dashboard" element={<ClubDashboard />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
