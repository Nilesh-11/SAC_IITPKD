import React, { useEffect, useState } from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import Header from "./../components/common/header";
import CalendarComponent from "./../components/common/calendar";
import Footer from "./../components/common/footer";
import Gallery from "./../components/common/gallery";
import AnnouncementSection from "./../components/common/announcements";
import getAnnouncementsList from "../api/announcement";
import getEventsList from "../api/events";

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const data = await getAnnouncementsList();
      setAnnouncements(data);
    };

    const fetchEvents = async () => {
      const data = await getEventsList();
      console.log(data);
      setEvents(data);
    };

    fetchAnnouncements();
    fetchEvents();
  }, []);

  const about_images = [
    "/about/photo1.jpg",
    "/about/photo2.jpg",
    "/about/photo3.jpg",
    "/about/photo1.jpg",
    "/about/photo2.jpg",
    "/about/photo3.jpg",
  ];
  const council_images = [
    "/councils/photo1.jpg",
    "/councils/photo2.jpg",
    "/councils/photo3.jpg",
    "/councils/photo1.jpg",
    "/councils/photo2.jpg",
    "/councils/photo3.jpg",
  ];
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/bg1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
    <div id="home">
      <Header />
      <Container maxWidth="lg" alignItems="flex-end">
        <Grid
          container
          spacing={2}
          style={{ marginTop: "20px" }}
          justifyContent="flex-center"
          direction="column"
          wrap="nowrap"
        >
          <Grid
            container
            item
            id="announcements"
            xs={12}
            sx={{
              justifyContent: "space-between",
              "@media (max-width: 600px)": { justifyContent: "space-around" },
            }}
            spacing={2}
            direction="row"
            justifyContent="space-between"
          >
            <Grid item xs={6} md={6}>
              <AnnouncementSection announcements={announcements} />
            </Grid>
            <Grid item xs={6} md={6}>
              <CalendarComponent events={events} />
            </Grid>
          </Grid>
          <Grid item id="about-us" xs={12} spacing={4}>
            <Box mt={4}>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" },
                }}
              >
                About Us
              </Typography>
              <Typography
                sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" } }}
              >
                The Technical Council of IIT Palakkad is a dynamic group
                dedicated to promoting innovation, technical excellence, and
                collaboration within the academic community. Comprising talented
                students, faculty, and professionals, our council aims to bridge
                the gap between classroom learning and real-world technological
                applications. We organize events, workshops, and seminars to
                enhance the skills of students, while fostering a spirit of
                teamwork and leadership. Through collaboration with industry
                leaders and experts, the Technical Council seeks to provide
                students with opportunities to engage with cutting-edge
                technologies and stay ahead of industry trends. We are committed
                to creating a platform where creativity meets technology,
                empowering students to excel in their academic and professional
                pursuits.
              </Typography>
            </Box>
            <Box>
              <Gallery images={about_images} galleryId="firstGallery" />
            </Box>
          </Grid>
          <Grid item id="councils" xs={12}>
            <Box mt={4}>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" },
                }}
              >
                Councils
              </Typography>
              <Typography
                sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" } }}
              >
                The councils at IIT Palakkad play a pivotal role in enhancing
                the campus experience by promoting student leadership,
                collaboration, and innovation across various domains. Each
                council is dedicated to a specific aspect of student life, be it
                academics, culture, sports, or technology, providing students
                with the opportunity to develop their skills, contribute to the
                community, and lead impactful initiatives. These councils work
                closely with faculty, administration, and industry professionals
                to organize events, workshops, and activities that foster
                growth, creativity, and personal development. Through their
                diverse activities, the councils ensure that every student has
                the opportunity to engage with their interests, cultivate
                leadership qualities, and make meaningful contributions to both
                the college and society.
              </Typography>
            </Box>
            <Gallery images={council_images} galleryId="secondGallery" />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
    </Box>
  );
};

export default Home;
