import { useSearchParams } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Header from "./Header";
import Dashboard from "../../components/user/dash";
import { getUsername } from "../../api/auth";

const ProjectList = lazy(() => import("../../components/user/projects"));
const AddProjectForm = lazy(() => import("../../components/user/AddProjectForm"));
const ManageProject = lazy(() => import("../../components/user/ManageProject"));
const UpdateProjectForm = lazy(() => import("../../components/user/UpdateProjectForm"));
const AnnouncementsDash = lazy(() => import("../../components/user/announcementsDash"));
const EventCalendar = lazy(() => import("../../components/user/bigcalendar"));
const CouncilClubs = lazy(() => import("../../components/user/CouncilClubs"));

const StudentDashboard = () => {
  const [searchParams] = useSearchParams();
  const currSection = searchParams.get("currSection");
  const [userrole, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [ userData] = await Promise.all([
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
    { name: "Clubs", icon: "🏛️", link: "clubs" },
    { name: "Announcements", icon: "📢", link: "announcements" },
    { name: "Calendar", icon: "🗓️", link: "calendar" },
    { name: "Projects", icon: "📂", link: "projects" },
    { name: "Add Project", icon: "➕", link: "addproject" },
    { name: "Update Project", icon: "🔄", link: "updateproject" },
    { name: "Manage Project", icon: "🛠️", link: "manageproject" },
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
    clubs: <CouncilClubs />,
    announcements: <AnnouncementsDash />,
    calendar: <EventCalendar />,
    projects: <ProjectList />,
    addproject: <AddProjectForm />,
    manageproject: <ManageProject />,
    updateproject: <UpdateProjectForm />,
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

export default StudentDashboard;
