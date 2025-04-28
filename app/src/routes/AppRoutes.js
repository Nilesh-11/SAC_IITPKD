import { lazy, Suspense, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./../components/ProtectedRoute";

const lazyImport = (path) => {
  const Component = lazy(() => import(`./../${path}`));
  return <Component />;
};

const publicRoutes = [
  { path: "/", component: "pages/Home" },
  { path: "/login", component: "pages/Login" },
  { path: "/reset-password", component: "pages/ResetPassword" },
  { path: "/technical", component: "pages/Technical" },
  { path: "/academics", component: "pages/Academic" },
  { path: "/cultural", component: "pages/Culturals" },
  { path: "/post-graduate", component: "pages/PostGraduate" },
  { path: "/hostel", component: "pages/Hostel" },
  { path: "/research", component: "pages/Research" },
  { path: "/sports", component: "pages/Sports" },
  { path: "/signup", component: "pages/SignUp" },
  { path: "/developers", component: "pages/Developers" },
  { path: "/guest/dashboard", component: "pages/guest/Dashboard" },
];

const protectedRoutes = [
  { 
    roles: ["student"], 
    routes: [
      { path: "/student/dashboard", component: "pages/student/Dashboard" },
      { path: "/project/info", component: "components/user/projectinfo" },
      { path: "/club/info", component: "components/user/clubinfo" },
      { path: "/club/coreteam", component: "components/user/ClubCoreTeam" },
    ]
  },
  { 
    roles: ["admin"], 
    routes: [
      { path: "/admin/dashboard", component: "pages/admin/Dashboard" },
    ]
  },
  { 
    roles: ["club"], 
    routes: [
      { path: "/club/dashboard", component: "pages/club/Dashboard" },
    ]
  },
  { 
    roles: ["council"], 
    routes: [
      { path: "/council/dashboard", component: "pages/council/Dashboard" },
    ]
  },
];

const AppRoutes = () => {
  const routeElements = useMemo(() => [
    ...publicRoutes.map(({ path, component }) => (
      <Route key={path} path={path} element={lazyImport(component)} />
    )),
    ...protectedRoutes.map(({ roles, routes }) => (
      <Route key={roles.join()} element={<ProtectedRoute allowedRoles={roles} />}>
        {routes.map(({ path, component }) => (
          <Route key={path} path={path} element={lazyImport(component)} />
        ))}
      </Route>
    )),
    <Route key="*" path="*" element={lazyImport("pages/NotFound")} />
  ], []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>{routeElements}</Routes>
    </Suspense>
  );
};

export default AppRoutes;