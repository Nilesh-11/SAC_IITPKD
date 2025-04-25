import { useSearchParams } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import Header from "./../student/Header";
import { getUsername } from "./../../api/auth";

const Dashboard = lazy(() => import("../../components/user/dash"));
const AddRoleForm = lazy(() => import("../../components/user/AddRoleForm"));
const UpdateRoleForm = lazy(() =>
  import("../../components/user/UpdateRoleForm")
);
const MembersSection = lazy(() =>
  import("../../components/user/MembersSection")
);
const UpdateMembershipForm = lazy(() =>
  import("../../components/user/UpdateMembershipForm")
);
const AddAnnouncementForm = lazy(() =>
  import("../../components/user/AddAnnouncmentForm")
);
const UpdateAnnouncementForm = lazy(() =>
  import("../../components/user/UpdateAnnouncementForm")
);
const AddProjectForm = lazy(() =>
  import("../../components/user/AddProjectForm")
);
const UpdateProjectForm = lazy(() =>
  import("../../components/user/UpdateProjectForm")
);
const ManageProject = lazy(() => import("../../components/user/ManageProject"));
const AddEventForm = lazy(() => import("../../components/user/AddEvent"));
const UpdateEventForm = lazy(() =>
  import("../../components/user/UpdateEventForm")
);
const AnnouncementsDash = lazy(() =>
  import("../../components/user/announcementsDash")
);
const ProjectList = lazy(() => import("../../components/user/projects"));

const ClubDashboard = () => {
  const [searchParams] = useSearchParams();
  const currSection = searchParams.get("currSection");
  const [userrole, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [userData] =
          await Promise.all([
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
    { name: "Add Role", icon: "🆕", link: "addrole" },
    { name: "Update Role", icon: "🔄", link: "updaterole" },
    { name: "Members", icon: "👥", link: "members" },
    { name: "Update Member", icon: "✏️", link: "updatemember" },
    { name: "Add Announcement", icon: "📢", link: "addannouncement" },
    { name: "Update Announcement", icon: "📝", link: "updateannouncement" },
    { name: "Add Project", icon: "➕", link: "addproject" },
    { name: "Update Project", icon: "🛠️", link: "updateproject" },
    { name: "Manage Project", icon: "📂", link: "manageproject" },
    { name: "Add Event", icon: "📅", link: "addevent" },
    { name: "Update Event", icon: "✏️", link: "updateevent" },
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
    dashboard: <Dashboard role={userrole} />,
    addrole: <AddRoleForm />,
    updaterole: <UpdateRoleForm />,
    members: <MembersSection />,
    updatemember: <UpdateMembershipForm />,
    addannouncement: <AddAnnouncementForm />,
    updateannouncement: <UpdateAnnouncementForm />,
    addproject: <AddProjectForm />,
    updateproject: <UpdateProjectForm />,
    manageproject: <ManageProject />,
    addevent: <AddEventForm />,
    updateevent: <UpdateEventForm />,
    projects: <ProjectList />,
    announcements: <AnnouncementsDash />
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
      <Suspense
        fallback={
          <Box textAlign="center" mt={5}>
            <CircularProgress />
          </Box>
        }
      >
        <Header
          menuItems={menuItems}
          userrole={userrole}
        />
        {sectionComponents[currSection]}
      </Suspense>
    </Box>
  );
};

export default ClubDashboard;
