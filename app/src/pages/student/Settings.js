import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Dashboard from "../../components/user/dash";
import Clubs from "../../components/user/clubs";
import ProjectList from "./../../components/user/projects";
import AnnouncementsDash from "../../components/user/announcementsDash";
import EventCalendar from "../../components/user/bigcalendar";

import {
  liveEvents,
} from "./../variables";
import getAnnouncementsList from "../../api/announcement";
import getEventsList from "../../api/events";
import getProjectsList from "../../api/projects";

const StudentSettings = () => {
  const navigate = useNavigate();
  const [currSection, setCurrentSection] = useState("dashboard");


  const handleMenuNavigation = (link) => {
    setCurrentSection(link);
  };

  const activity = [
    { club: "YACC", user: "Alice", club_logo_src: "/logo192.png" },
    { club: "Voxel", user: "Bob", club_logo_src: "/logo192.png" },
  ];

  const menuItems = [
    { name: "Profile", icon: "👤", link: "profile" },
    { name: "Settings", icon: "⚙️", link: "settings" },
    { name: "Courses", icon: "📚", link: "courses" },
    { name: "Grades", icon: "📈", link: "grades" },
    { name: "Attendance", icon: "📝", link: "attendance" },
    { name: "Schedule", icon: "🗓️", link: "schedule" },
    { name: "Notifications", icon: "🔔", link: "notifications" },
    { name: "Support", icon: "🆘", link: "support" },
  ];  

  return (
    <div>
      <Header
        handleMenuNavigation={handleMenuNavigation}
        liveEvents={liveEvents}
        recentActivity={activity}
        menuItems={menuItems}
      ></Header>
    </div>
  );
};

export default StudentSettings;
