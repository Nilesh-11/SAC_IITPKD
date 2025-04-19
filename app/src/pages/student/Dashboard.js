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
import ClubInfo from "./../../components/user/clubinfo";
import {
  otherClubs,
  myClubs,
  myClubs2,
} from "./../variables";
import getAnnouncementsList from "../../api/announcement";
import getEventsList from "../../api/events";
import getProjectsList from "../../api/projects";
import { Description } from "@mui/icons-material";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currSection, setCurrentSection] = useState("dashboard");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const data = await getAnnouncementsList();
      setAnnouncements(data);
    };

    const fetchEvents = async () => {
      const data = await getEventsList();
      setEvents(data);
    };

    const fetchProjects = async () => {
      const data = await getProjectsList();
      setProjects(data);
    };

    fetchAnnouncements();
    fetchEvents();
    fetchProjects();
  }, []);

  const handleMenuNavigation = (link) => {
    setCurrentSection(link);
  };

  const activity = [
    { club: "YACC", user: "Alice", club_logo_src: "/logo192.png" },
    { club: "Voxel", user: "Bob", club_logo_src: "/logo192.png" },
  ];

  const menuItems = [
    { name: "Dashboard", icon: "📊", link: "dashboard" },
    { name: "Clubs", icon: "🏫", link: "clubs" },
    { name: "Announcements", icon: "📣", link: "announcements" },
    { name: "Calendar", icon: "🗓️", link: "calendar" },
    { name: "Live-Events", icon: "🎤", link: "live-events" },
    { name: "Opportunities", icon: "🔍", link: "opportunities" },
    { name: "Budget", icon: "💰", link: "budget" },
    { name: "More", icon: "⋯", link: "more" },
  ];

  const status = [
    { title: "Clubs", count: 5 },
    { title: "Events", count: 10 },
    { title: "Ongoing Projects", count: 2 },
    { title: "Projects Completed", count: "10" },
    { title: "Add Functionalities", count: "+" },
  ];

  const handleClubNavigation = (link) => {
    console.log(link);
  };

  const clubData = {
    id: 2,
    name: "yacc",
    is_member: false,
    role: "",
    title: "Yet Another Coding Club",
    description:"A dynamic and inclusive community of passionate coders and algorithmic thinkers. Our mission is to foster a deep and abiding love for coding, share knowledge, and provide a platform for students to enhance their coding skills and take on real-world challenges. YACC has five independent and parallel tracks that you can excel in: Competitive Programming, Ethical Hacking, Full stack development, Game development and System Design. YACC strives to build strong coding and problem-solving culture in the institute and to make programming a cherishable experience for students with different skill sets",
    head: "Name 1",
    coheads: ["Name 1", "Name 2", "Name 3"],
    email: "club@iitpkd.ac.in",
    members: [
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some2", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"}
    ],
    projects: projects
  };

  const ProjectInfo = {
    name: "yacc",
    title: "Yet Another Coding Club",
    description:"A dynamic and inclusive community of passionate coders and algorithmic thinkers. Our mission is to foster a deep and abiding love for coding, share knowledge, and provide a platform for students to enhance their coding skills and take on real-world challenges. YACC has five independent and parallel tracks that you can excel in: Competitive Programming, Ethical Hacking, Full stack development, Game development and System Design. YACC strives to build strong coding and problem-solving culture in the institute and to make programming a cherishable experience for students with different skill sets",
    head: "Name 1",
    coheads: ["Name 1", "Name 2", "Name 3"],
    email: "club@iitpkd.ac.in",
    contact_number: "1234567890",
    members: [
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"},
      {name: "some2", email: "mail@mail.com", joined_date: "2025-04-15 17:28:57.626089"}
    ],
    projects: projects
  };

  return (
    <div>
      <Header
        handleMenuNavigation={handleMenuNavigation}
        liveEvents={events}
        recentActivity={activity}
        menuItems={menuItems}
      ></Header>
      {currSection == "dashboard" && (
        <Dashboard
          announcements={announcements}
          status={status}
          myClubs={myClubs}
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

      {currSection == "clubs" && (
        <Clubs
          my_clubs={myClubs2}
          other_clubs={otherClubs}
          handleNavigation={handleClubNavigation}
        />
      )}

      {currSection == "more" && (
        <ClubInfo />
      )}


      {currSection == "opportunities" && (
        <ProjectList projects={projects}></ProjectList>
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

export default StudentDashboard;
