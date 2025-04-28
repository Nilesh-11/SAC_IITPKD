import { lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Header from "../student/Header";

const Dashboard = lazy(() => import("../../components/user/dash"));
const AnnouncementsDash = lazy(() => import("../../components/user/announcementsDash"));
const EventCalendar = lazy(() => import("../../components/user/bigcalendar"));

const GuestDashboard = () => {
  const [searchParams] = useSearchParams();
  const currSection = searchParams.get("currSection") || "dashboard";

  const menuItems = [
    { name: "Dashboard", icon: "📊", link: "dashboard" },
    { name: "Announcements", icon: "📢", link: "announcements" },
    { name: "Calendar", icon: "🗓️", link: "calendar" },
  ];

  const sectionComponents = {
    dashboard: (
      <Dashboard role="guest"/>
    ),
    announcements: <AnnouncementsDash />,
    calendar: <EventCalendar />
  };

  return (
    <Box
      sx={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.2)), url('/bg1.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Header
        menuItems={menuItems}
        userrole="guest"
      />

      <Suspense fallback={<Box textAlign="center" mt={5}><CircularProgress /></Box>}>
        {sectionComponents[currSection]}
      </Suspense>
    </Box>
  );
};

export default GuestDashboard;