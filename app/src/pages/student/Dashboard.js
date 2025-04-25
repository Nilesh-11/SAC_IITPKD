import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import Header from "./Header";
import Dashboard from "../../components/user/dash";
import ProjectList from "../../components/user/projects";
import AnnouncementsDash from "../../components/user/announcementsDash";
import EventCalendar from "../../components/user/bigcalendar";
import {getAnnouncementsList} from "../../api/announcement";
import {getEventsList} from "../../api/events";
import {ClubsListApi, StatusApi} from "../../api/public";
import AddProjectForm from "../../components/user/AddProjectForm";
import ManageProject from "../../components/user/ManageProject";
import UpdateProjectForm from "../../components/user/UpdateProjectForm";
import CouncilClubs from "../../components/user/CouncilClubs";
import { getUsername } from "../../api/auth";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [currSection, setCurrentSection] = useState("dashboard");
  const [status, setStatus] = useState("");
  const [allClubs, setAllClubs] = useState([]);
  const [username, setUsername] = useState("");
  const [userrole, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [annData, eventData, clubData, userData, statData] = await Promise.all([
          getAnnouncementsList(),
          getEventsList(),
          ClubsListApi(),
          getUsername(),
          StatusApi(),
        ]);
        setAllClubs(clubData.clubs.map(item => `/clubs/${item.name}/opaque_logo_square.png`));
        setAnnouncements(annData);
        setUsername(userData.name);
        setRole(userData.user_type);
        setEvents(eventData);
        setStatus(statData);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);
  
  const handleMenuNavigation = (link) => {
    setCurrentSection(link);
  };

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
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Loading Dashboard...</h2>
        <CircularProgress />
      </div>
    );
  }

  const handleClubNavigation = (link) => {
    navigate(link);
  };
  
  return (
    <Box sx={{backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.2)), url('/bg1.webp')`,
      backgroundSize: "cover",
      backgroundPosition: "center",}}>
      <Header
        handleMenuNavigation={handleMenuNavigation}
        liveEvents={events}
        menuItems={menuItems}
        username={username}
        userrole={userrole}
      ></Header>
      {currSection === "dashboard" && (
        <Dashboard
          announcements={announcements}
          status={status}
          myClubs={allClubs}
          handleAllAnnouncementClick={() => {
            setCurrentSection("announcements");
          }}
          handleAllClubLink={() => {
            setCurrentSection("clubs");
          }}
        >
          {" "}
        </Dashboard>
      )}

      {currSection === "clubs" && (
        <CouncilClubs handleNavigation={handleClubNavigation}></CouncilClubs>
      )}

      {currSection === "addproject" && (
        <AddProjectForm></AddProjectForm>
      )}

      {currSection === "manageproject" && (
        <ManageProject></ManageProject>
      )}

      {currSection === "updateproject" && (
        <UpdateProjectForm></UpdateProjectForm>
      )}
      
      {currSection === "projects" && (
        <ProjectList handleAddProject={() => {
          setCurrentSection("addproject");
        }}></ProjectList>
      )}

      {currSection === "announcements" && (
        <AnnouncementsDash announcements={announcements}></AnnouncementsDash>
      )}

      {currSection === "calendar" && (
          <EventCalendar events={events} />
      )}
    </Box>
  );
};

export default StudentDashboard;
