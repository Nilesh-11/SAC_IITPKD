import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../student/Header";
import Dashboard from "../../components/user/dash";
import {getAnnouncementsList} from "../../api/announcement";
import {getEventsList} from "../../api/events";
import AddClubForm from "../../components/user/AddClubForm";
import UpdateClubForm from "../../components/user/UpdateClubForm";
import AddAnnouncementForm from "../../components/user/AddAnnouncmentForm";
import UpdateAnnouncementForm from "../../components/user/UpdateAnnouncementForm";
import UpdateEventForm from "../../components/user/UpdateEventForm";
import AddEventForm from "../../components/user/AddEvent";
import { ClubsListApi, StatusApi } from "../../api/public";
import { getUsername } from "../../api/auth";
import { CircularProgress } from "@mui/material";

const CouncilDashboard = () => {
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

      {currSection == "addannouncement" && (
        <AddAnnouncementForm></AddAnnouncementForm>
      )}

      {currSection == "updateannouncement" && (
        <UpdateAnnouncementForm></UpdateAnnouncementForm>
      )}

      {currSection == "updateevent" && (
        <UpdateEventForm></UpdateEventForm>
      )}

      {currSection == "addevent" && (
        <AddEventForm></AddEventForm>
      )}

      {currSection == "addclub" && (
        <AddClubForm></AddClubForm>
      )}

      {currSection == "updateclub" && (
        <UpdateClubForm></UpdateClubForm>
      )}
    </div>
  );
};

export default CouncilDashboard;
