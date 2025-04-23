import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../student/Header";
import Dashboard from "../../components/user/dash";
import AnnouncementsDash from "../../components/user/announcementsDash";
import ClubInfo from "../../components/user/clubinfo";
import {
  myClubs,
} from "../variables";
import {getAnnouncementsList} from "../../api/announcement";
import {getEventsList} from "../../api/events";
import {getProjectsList} from "../../api/projects";
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
import AddCouncilForm from "../../components/user/AddCouncilForm";
import UpdateCouncilForm from "../../components/user/UpdateCouncilForm";
import AddStudentForm from "../../components/user/AddStudentForm";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currSection, setCurrentSection] = useState("addcouncil");

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

  const menuItems = [
    { name: "Add Council", icon: "🏫", link: "addcouncil" },
    { name: "Update Council", icon: "🏫", link: "updatecouncil" },
    { name: "Add Student", icon: "🏫", link: "addstudent" },
  ];
  
  return (
    <div>
      <Header
        handleMenuNavigation={handleMenuNavigation}
        liveEvents={events}
        menuItems={menuItems}
      ></Header>

      {currSection == "addcouncil" && (
        <AddCouncilForm />
      )}

      {currSection == "updatecouncil" && (
        <UpdateCouncilForm />
      )}

      {currSection == "addstudent" && (
        <AddStudentForm />
      )}

    </div>
  );
};

export default AdminDashboard;
