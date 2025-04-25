import { useEffect, useState } from "react";
import Header from "./../student/Header";
import {getEventsList} from "./../../api/events";
import AddCouncilForm from "./../../components/user/AddCouncilForm";
import UpdateCouncilForm from "./../../components/user/UpdateCouncilForm";
import AddStudentForm from "./../../components/user/AddStudentForm";
import { Box } from "@mui/material";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [currSection, setCurrentSection] = useState("addcouncil");

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEventsList();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  const handleMenuNavigation = (link) => {
    setCurrentSection(link);
  };

  const menuItems = [
    { name: "Add Council", icon: "🆕", link: "addcouncil" },     // Represents "add" or "new"
    { name: "Update Council", icon: "🛠️", link: "updatecouncil" }, // Represents "update/edit"
    { name: "Add Student", icon: "🎓", link: "addstudent" },      // Represents "student"
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
      ></Header>

      {currSection === "addcouncil" && (
        <AddCouncilForm />
      )}

      {currSection === "updatecouncil" && (
        <UpdateCouncilForm />
      )}

      {currSection === "addstudent" && (
        <AddStudentForm />
      )}

    </Box>
  );
};

export default AdminDashboard;
