import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../student/Header";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Dashboard from "../../components/user/dash";
import ProjectList from "../../components/user/projects";
import AnnouncementsDash from "../../components/user/announcementsDash";
import EventCalendar from "../../components/user/bigcalendar";
import {getAnnouncementsList} from "../../api/announcement";
import {getEventsList} from "../../api/events";
import {ClubsListApi, StatusApi} from "../../api/public";
import { CircularProgress } from "@mui/material";
import AddProjectForm from "../../components/user/AddProjectForm";
import ManageProject from "../../components/user/ManageProject";
import UpdateProjectForm from "../../components/user/UpdateProjectForm";
import CouncilClubs from "../../components/user/CouncilClubs";
import { getUsername } from "../../api/auth";

const GuestDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [currSection, setCurrentSection] = useState("dashboard");
  const [status, setStatus] = useState("");
  const [allClubs, setAllClubs] = useState([]);
  const username = useState("Guest");
  const userrole = useState("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [annData, eventData, clubData, userData, statData] = await Promise.all([
          getAnnouncementsList(),
          getEventsList(),
          ClubsListApi(),
          StatusApi(),
        ]);
        setAllClubs(clubData.clubs.map(item => `/clubs/${item.name}/opaque_logo_square.png`));
        setAnnouncements(annData);
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
    { name: "Announcements", icon: "📢", link: "announcements" },
    { name: "Calendar", icon: "🗓️", link: "calendar" },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Loading Dashboard...</h2>
        <CircularProgress />
      </div>
    );
  }
  
  return (
    <div>
      <Header
        handleMenuNavigation={handleMenuNavigation}
        liveEvents={events}
        menuItems={menuItems}
        username={username}
        userrole={userrole}
      ></Header>
      {currSection == "dashboard" && (
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

      {currSection == "announcements" && (
        <AnnouncementsDash announcements={announcements}></AnnouncementsDash>
      )}

      {currSection == "calendar" && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <EventCalendar events={events} />
        </LocalizationProvider>
      )}
    </div>
  );
};

export default GuestDashboard;
