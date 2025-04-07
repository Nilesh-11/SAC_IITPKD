import React from 'react';
import LeftNav from './user/leftnav';
import { useNavigate } from "react-router-dom"; // For navigation

const Test = () => {
    const navigate = useNavigate();
    const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

    const myClubs2 = [
      { title: "YACC", link: "/yacc", image: "/clubs/yacc/grd.jpg" },
      { title: "CognifyAI", link: "/cognifyai", image: "/clubs/yacc/grd.jpg" },
      { title: "Y-dyuthi", link: "/y-dyuthi", image: "/clubs/yacc/grd.jpg" },
      { title: "Stellar", link: "/stellar", image: "/clubs/yacc/grd.jpg" },
      { title: "E-cell", link: "/ecell", image: "/clubs/yacc/grd.jpg" },
      { title: "Club 6", link: "/club6", image: "/clubs/yacc/grd.jpg" },
    ];
    
    const otherClubs = [
      { title: "Club 1", link: "/club1", image: "/clubs/yacc/grd.jpg" },
      { title: "Club 2", link: "/club2", image: "/clubs/yacc/grd.jpg" },
      { title: "Club 3", link: "/club3", image: "/clubs/yacc/grd.jpg" },
      { title: "Club 4", link: "/club4", image: "/clubs/yacc/grd.jpg" },
      { title: "Club 5", link: "/club5", image: "/clubs/yacc/grd.jpg" },
      { title: "Club 6", link: "/club6", image: "/clubs/yacc/grd.jpg" },
    ];
    
    const handleClubNavigation = (link) => {
      console.log("Navigating to:", link);
    };

    const announcementsData = [
      {
        club: "YACC",
        title: "Web Dev BootCamp",
        info: "Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do a. ",
        image: "/clubs/yacc/grd.jpg",
      },
      {
        club: "YACC",
        title: "Web Dev BootCamp",
        info: "Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
        image: "/clubs/yacc/grd.jpg",
      },
      {
        club: "YACC",
        title: "Web Dev BootCamp",
        info: "Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do a. Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do a Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do a",
        image: "/clubs/yacc/grd.jpg",
      },
      {
        club: "YACC",
        title: "Web Dev BootCamp",
        info: "Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do a. Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do a Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do a",
        image: "/clubs/yacc/grd.jpg",
      },
      {
        club: "YACC",
        title: "Web Dev BootCamp",
        info: "Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do a. Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do a Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do a",
        image: "/clubs/yacc/grd.jpg",
      },
      {
        club: "YACC",
        title: "Web Dev BootCamp",
        info: "Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do a. Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do a Announcement/Event Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do a",
        image: "/clubs/yacc/grd.jpg",
      },
    ];
    const announcements = [
      { title: "Announcement Heading 1", date: "1 day ago", logo: "logo192.png" },
      { title: "Announcement Heading 2", date: "2 days ago", logo: "logo192.png" },
      { title: "Announcement Heading 3", date: "3 days ago", logo: "logo192.png" },
      { title: "Announcement Heading 4", date: "4 days ago", logo: "logo192.png" }
    ];
    
    const status = [
      { title: "Clubs", count: 5 },
      { title: "Events", count: 10 },
      { title: "Ongoing Projects", count: 2 },
      { title: "Add Functionalities", count: "+" }
    ];
    
    const myClubs = [
      "/clubs/yacc/grd.jpg",
      "/clubs/yacc/grd.jpg",
      "/clubs/yacc/grd.jpg",
      "/clubs/yacc/grd.jpg"
    ];

    const menuItems = [
        { name: "Dashboard", icon: "📊", link: "/dashboard" },
        { name: "Clubs", icon: "🏫", link: "/clubs" },
        { name: "Announcements", icon: "📣", link: "/announcements" },
        { name: "Calendar", icon: "🗓️", link: "/calendar" },
        { name: "Live-Events", icon: "🎤", link: "/live-events" },
        { name: "Opportunities", icon: "🔍", link: "/opportunities" },
        { name: "Budget", icon: "💰", link: "/budget" },
        { name: "More", icon: "⋯", link: "/more" }
    ];
    const liveEvents = [
        {
            club: "Voxel",
            title: "Photoshop Intro",
            info: "Learn the basics of Photoshop...",
            link: "#",
            club_logo_src: "logo192.png",
        },
        {
            club: "YACC",
            title: "Web Dev Bootcamp",
            info: "A beginner-friendly web dev workshop...",
            link: "#",
            club_logo_src: "logo192.png",
        },
    ];
    
    const activity = [
        { club: "YACC", user: "Alice", club_logo_src: "logo192.png" },
        { club: "Voxel", user: "Bob", club_logo_src: "logo192.png" },
    ];

    const handleNavigation = (link) => {
        navigate(link); // Use React Router's navigate function to handle the route change
    };

    const clubData = {
      club: "YACC",
      details:
        "A dynamic and inclusive community of passionate coders and algorithmic thinkers. Our mission is to foster a deep and abiding love for coding, share knowledge, and provide a platform for students to enhance their coding skills and take on real-world challenges. YACC has five independent and parallel tracks that you can excel in: Competitive Programming, Ethical Hacking, Full stack development, Game development and System Design. YACC strives to build strong coding and problem-solving culture in the institute and to make programming a cherishable experience for students with different skill sets",
      image: "/clubs/yacc/grd.jpg",
      club_heads: ["Name 1", "Name 3"],
      club_leads: ["Name 1", "Name 2", "Name 3"],
      mail: "club@iitpkd.ac.in",
      contact_number: "1234567890",
      discussions: [
        { logo: "logo192.png", title: "Disc 1", student: "someone", date: "1 hour ago" },
        { logo: "logo192.png", title: "Disc 2", student: "someone", date: "1 hour ago" },
      ],
    };
    const projects = [
      {
        type: "Tech",
        clubname: "Coding Club",
        title: "Web Development Bootcamp",
        description: "Learn full-stack web development.",
        skills: ["JavaScript", "React"],
        maxmembers: 10,
        currentMembers: 8,
        status: "Ongoing",
        dateCreated: "2024-03-29T10:00:00",
        logo: "/clubs/yacc/logo_circle.png",
      },
      {
        type: "Science",
        clubname: "Robotics Club",
        title: "AI-powered Robot",
        description: "Building a robot with AI capabilities.",
        skills: ["Python", "AI"],
        maxmembers: 10,
        currentMembers: 10,
        status: "Completed",
        dateCreated: "2024-03-28T12:30:00",
        logo: "/clubs/cognifai/logo.jpeg",
      }
    ];
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <div>
            <LeftNav menuItems={menuItems} handleClick={handleNavigation}/>
        </div>
      <Dashboard announcements={announcements} status={status} myClubs={myClubs} />
      <AnnouncementsDash announcements={announcementsData} />
      <Clubs my_clubs={myClubs2} other_clubs={otherClubs} handleNavigation={handleClubNavigation} />
      <ClubInfo {...clubData} />
      <ProjectList projects={projects} />
      
      {!isDrawerOpen && (
        <IconButton
          onClick={() => setIsRightDrawerOpen(true)}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            p: 0,
            transition: "all 0.3s ease-in-out",
            "&:hover": { transform: "scale(1.1)" },
          }}
        >
          <Avatar src="logo192.png" sx={{ width: 50, height: 50 }} />
        </IconButton>
      )}

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsRightDrawerOpen(false)}
        transitionDuration={500}
        sx={{
          "& .MuiDrawer-paper": {
            width: 350,
            p: 2,
            boxShadow: 3,
          },
        }}
      >
        <RightNavbar
          username="John Doe"
          userLogo="logo192.png"
          liveEvents={liveEvents}
          activity={activity}
          onClose={() => setIsRightDrawerOpen(false)} // Close when clicking outside
        />
      </Drawer>
    </ThemeProvider>
  );
};

export default Test;
