import { useEffect, useState, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Header from "../student/Header";
import { getUsername } from "../../api/auth";

const Dashboard = lazy(() => import("../../components/user/dash"));
const AddClubForm = lazy(() => import("../../components/user/AddClubForm"));
const UpdateClubForm = lazy(() => import("../../components/user/UpdateClubForm"));
const AddAnnouncementForm = lazy(() => import("../../components/user/AddAnnouncmentForm"));
const UpdateAnnouncementForm = lazy(() => import("../../components/user/UpdateAnnouncementForm"));
const UpdateEventForm = lazy(() => import("../../components/user/UpdateEventForm"));
const AddEventForm = lazy(() => import("../../components/user/AddEvent"));

const CouncilDashboard = () => {
  const [searchParams] = useSearchParams();
  const currSection = searchParams.get("currSection") || "dashboard";
  const [userrole, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [userData] = await Promise.all([
          getUsername(),
        ]);
        setRole(userData.user_type);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: "📊", link: "dashboard" },
    { name: "Add Club", icon: "🏫", link: "addclub" },
    { name: "Update Club", icon: "✏️", link: "updateclub" },
    { name: "Add Announcement", icon: "📢", link: "addannouncement" },
    { name: "Update Announcement", icon: "📝", link: "updateannouncement" },
    { name: "Add Event", icon: "📅", link: "addevent" },
    { name: "Update Event", icon: "🖋️", link: "updateevent" },
  ];

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <h2>Loading Dashboard...</h2>
        <CircularProgress />
      </Box>
    );
  }

  const sectionComponents = {
    dashboard: (
      <Dashboard
        role={userrole}
      />
    ),
    addclub: <AddClubForm />,
    updateclub: <UpdateClubForm />,
    addannouncement: <AddAnnouncementForm />,
    updateannouncement: <UpdateAnnouncementForm />,
    addevent: <AddEventForm />,
    updateevent: <UpdateEventForm />
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
        userrole={userrole}
      />

      <Suspense fallback={<Box textAlign="center" mt={5}><CircularProgress /></Box>}>
        {sectionComponents[currSection]}
      </Suspense>
    </Box>
  );
};

export default CouncilDashboard;