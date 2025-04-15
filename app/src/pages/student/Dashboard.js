import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Dashboard from "../../components/user/dash";
import Clubs from "../../components/user/clubs";
import ProjectList from "./../../components/user/projects";
import AnnouncementsDash from "../../components/user/announcementsDash";
import EventCalendar from "../../components/user/bigcalendar";

import {events, liveEvents, projects, announcements, otherClubs, myClubs, myClubs2} from "./../variables";

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [currSection, setCurrentSection] = useState("dashboard");

    const handleMenuNavigation = (link) => {
        console.log(link);
        setCurrentSection(link);
    }

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
        { name: "More", icon: "⋯", link: "more" }
    ];

    const status = [
        { title: "Clubs", count: 5 },
        { title: "Events", count: 10 },
        { title: "Ongoing Projects", count: 2 },
        { title: "Projects Completed", count: "10" },
        { title: "Add Functionalities", count: "+" }
    ];

    


    const handleClubNavigation = (link) => {
        console.log(link);
    }

    return (
        <div>
            <Header handleMenuNavigation={handleMenuNavigation} liveEvents={liveEvents} recentActivity={activity} menuItems={menuItems} ></Header>
            {currSection == "dashboard" && (
                <Dashboard announcements={announcements} status={status} myClubs={myClubs} 
                    handleAllAnnouncementClick={() => {setCurrentSection("announcements")}}
                    handleAllClubLink={() => {setCurrentSection("clubs")}}
                    > </Dashboard>
                )}

            {currSection == "clubs" && (
                <Clubs my_clubs={myClubs2} other_clubs={otherClubs} handleNavigation={handleClubNavigation} />
            )}

            {currSection == 'opportunities' && (
                <ProjectList projects={projects}></ProjectList>
            )}

            {currSection == 'announcements' && (
                <AnnouncementsDash announcements={announcements}></AnnouncementsDash>
            )}

            {currSection == 'calendar' && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <EventCalendar events={events} />
                </LocalizationProvider>
            )}
        </div>
    );
}

export default StudentDashboard;