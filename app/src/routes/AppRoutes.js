import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./../components/ProtectedRoute";

const Home = lazy(() => import("./../pages/Home"));
const Login = lazy(() => import("./../pages/Login"));
const StudentDashboard = lazy(() => import("./../pages/student/Dashboard"));
const AdminDashboard = lazy(() => import("./../pages/admin/Dashboard"));
const ClubDashboard = lazy(() => import("./../pages/club/Dashboard"));
const NotFound = lazy(() => import("./../pages/NotFound"));
const Signup = lazy(() => import("./../pages/SignUp"));
const Technical = lazy(() => import("./../pages/Technical"));
const Academic = lazy(() => import("./../pages/Academic"));
const Developers = lazy(() => import("./../pages/Developers"));
const Culturals = lazy(() => import("./../pages/Culturals"));
const Postgraduate = lazy(() => import("./../pages/PostGraduate"));
const Hostel = lazy(() => import("./../pages/Hostel"));
const Research = lazy(() => import("./../pages/Research"));
const Sports = lazy(() => import("./../pages/Sports"));
const ResetPassword = lazy(() => import("./../pages/ResetPassword"));
const CouncilDashboard = lazy(() => import("./../pages/council/Dashboard"));
const ProjectInfo = lazy(() => import("./../components/user/projectinfo"));
const ClubInfo = lazy(() => import("./../components/user/clubinfo"));
const GuestDashboard = lazy(() => import("./../pages/guest/Dashboard"));
const ClubCoreTeam = lazy(() => import("./../components/user/ClubCoreTeam"));

const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
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
      <Route path="/signup" element={<Signup />} />
      <Route path="/developers" element={<Developers />} />
      <Route path="/guest/dashboard" element={<GuestDashboard />} />

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/project/info" element={<ProjectInfo />} />
        <Route path="/club/info" element={<ClubInfo />} />
        <Route path="/club/coreteam" element={<ClubCoreTeam />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["club"]} />}>
        <Route path="/club/dashboard" element={<ClubDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["council"]} />}>
        <Route path="/council/dashboard" element={<CouncilDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
