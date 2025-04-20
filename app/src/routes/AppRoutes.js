import { Routes, Route } from "react-router-dom";
import Home from "./../pages/Home";
import Login from "../pages/Login";
import StudentDashboard from "../pages/student/Dashboard";
import AdminDashboard from "./../pages/admin/Dashboard";
import ClubDashboard from "./../pages/club/Dashboard";
import NotFound from "./../pages/NotFound";
import ProtectedRoute from "./../components/ProtectedRoute";
import Signup from "./../pages/SignUp"
import Technical from "../pages/Technical";
import Academic from "../pages/Academic";
import Developers from "../pages/Developers";
import Culturals from "../pages/Culturals";
import Postgraduate from "../pages/PostGraduate";
import Hostel from "../pages/Hostel";
import Research from "../pages/Research";
import Sports from "../pages/Sports";
import ResetPassword from "../pages/ResetPassword";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/technical" element={<Technical />} />
    <Route path="/academics" element={<Academic />} />
    <Route path="/cultural" element={<Culturals />} />
    <Route path="/post-graduate" element={<Postgraduate />} />
    <Route path="/hostel" element={<Hostel />} />
    <Route path="/research" element={<Research />} />
    <Route path="/sports" element={<Sports />} />
    <Route path="/developers" element={<Developers />} />

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
