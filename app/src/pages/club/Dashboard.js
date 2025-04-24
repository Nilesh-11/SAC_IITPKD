import { useEffect, useState } from "react";
import Header from "../student/Header";
import Dashboard from "../../components/user/dash";
import AnnouncementsDash from "../../components/user/announcementsDash";
import ClubInfo from "../../components/user/clubinfo";
import {getAnnouncementsList} from "../../api/announcement";
import AddRoleForm from "../../components/user/AddRoleForm";
import UpdateRoleForm from "../../components/user/UpdateRoleForm";
import MembersSection from "../../components/user/MembersSection";
import UpdateMembershipForm from "../../components/user/UpdateMembershipForm";
import AddAnnouncementForm from "../../components/user/AddAnnouncmentForm";
import UpdateAnnouncementForm from "../../components/user/UpdateAnnouncementForm";
import AddProjectForm from "../../components/user/AddProjectForm";
import UpdateProjectForm from "../../components/user/UpdateProjectForm";
import ManageProject from "../../components/user/ManageProject";
import AddEventForm from "../../components/user/AddEvent";
import UpdateEventForm from "../../components/user/UpdateEventForm";
import { getUsername } from "../../api/auth";
import { ClubsListApi, StatusApi } from "../../api/public";
import { Box, CircularProgress } from "@mui/material";
import ProjectList from "../../components/user/projects";
import { getEventsList } from "../../api/events";

const ClubDashboard = () => {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [status, setStatus] = useState("");
  const [allClubs, setAllClubs] = useState([]);
  const [currSection, setCurrentSection] = useState("dashboard");
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
          setEvents(eventData);
          setAllClubs(clubData.clubs.map(item => `/clubs/${item.name}/opaque_logo_square.png`));
          setAnnouncements(annData);
          setUsername(userData.name);
          setRole(userData.user_type);
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

  if (loading) {
      return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h2>Loading Dashboard...</h2>
          <CircularProgress />
        </div>
      );
    }

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
  
  return (
    <Box
    sx={{backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.2)), url('/bg1.webp')`,
      backgroundSize: "cover",
      backgroundPosition: "center",}}
    >
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
            setCurrentSection("dashboard");
          }}
          handleAllClubLink={() => {
            setCurrentSection("dashboard");
          }}
        >
          {" "}
        </Dashboard>
      )}

      {currSection === "updateevent" && (
        <UpdateEventForm></UpdateEventForm>
      )}

      {currSection === "addevent" && (
        <AddEventForm></AddEventForm>
      )}

      {currSection === "addannouncement" && (
        <AddAnnouncementForm></AddAnnouncementForm>
      )}

      {currSection === "updateannouncement" && (
        <UpdateAnnouncementForm></UpdateAnnouncementForm>
      )}

      {currSection === "addrole" && (
        <AddRoleForm></AddRoleForm>
      )}

      {currSection === "updaterole" && (
        <UpdateRoleForm></UpdateRoleForm>
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

      {currSection === "updatemember" && (
        <UpdateMembershipForm></UpdateMembershipForm>
      )}

      {currSection === "projects" && (
        <ProjectList handleAddProject={() => {
          setCurrentSection("addproject");
        }}></ProjectList>
      )}


      {currSection === "members" && (
        <MembersSection></MembersSection>
      )}

      {currSection === "more" && (
        <ClubInfo />
      )}

      {currSection === "announcements" && (
        <AnnouncementsDash announcements={announcements}></AnnouncementsDash>
      )}
    </Box>
  );
};

export default ClubDashboard;
