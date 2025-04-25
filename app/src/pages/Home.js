import React, { Suspense, useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import { getAnnouncementsList } from "../api/announcement";
import { getEventsList } from "../api/events";

const Header = React.lazy(() => import("./../components/common/header"));
const Footer = React.lazy(() => import("./../components/common/footer"));
const Gallery = React.lazy(() => import("./../components/common/gallery"));
const AnnouncementSection = React.lazy(() =>
  import("./../components/common/announcements")
);
const CalendarComponent = React.lazy(() =>
  import("./../components/common/calendar")
);

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsData, eventsData] = await Promise.all([
          getAnnouncementsList(),
          getEventsList(),
        ]);
        setAnnouncements(announcementsData);
        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const about_images = [
    "/council/photo9.webp",
    "/council/photo7.webp",
    "/council/photo11.webp",
    "/council/photo10.webp",
    "/council/photo14.webp",
  ];
  const council_images = [
    "/council/photo6.webp",
    "/council/photo13.webp",
    "/council/photo12.webp",
  ];

  const deanOfficePeople = [
    {
      name: "Dr. Deepak Rajendraprasad",
      title:
        "Associate Professor in Computer Science & Engineering and Dean of Student Affairs",
      email: "deanstudents@iitpkd.ac.in",
      image: "/people/DeepakR.webp",
    },
    {
      name: "S Samuel",
      title: "Advisor (Student Matters)",
      email: "samuel@iitpkd.ac.in",
      image: "/people/Samuel.webp",
    },
  ];

  return (
    <React.Profiler>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: "url('/bg1.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div id="home">
          <Suspense fallback={<Skeleton variant="rectangular" height={64} />}>
            <Header />
          </Suspense>
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
                  "@media (max-width: 600px)": {
                    justifyContent: "space-around",
                  },
                }}
                spacing={2}
                direction="row"
                justifyContent="space-between"
              >
                <Grid item xs={6} md={6}>
                  <Suspense
                    fallback={<Skeleton variant="rectangular" height={300} />}
                  >
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <AnnouncementSection announcements={announcements} />
                    )}
                  </Suspense>
                </Grid>
                <Suspense
                  fallback={<Skeleton variant="rectangular" height={300} />}
                >
                  <Grid item xs={6} md={6}>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <CalendarComponent events={events} />
                    )}
                  </Grid>
                </Suspense>
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
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                    }}
                  >
                    The Technical Council of IIT Palakkad is a dynamic group
                    dedicated to promoting innovation, technical excellence, and
                    collaboration within the academic community. Comprising
                    talented students, faculty, and professionals, our council
                    aims to bridge the gap between classroom learning and
                    real-world technological applications. We organize events,
                    workshops, and seminars to enhance the skills of students,
                    while fostering a spirit of teamwork and leadership. Through
                    collaboration with industry leaders and experts, the
                    Technical Council seeks to provide students with
                    opportunities to engage with cutting-edge technologies and
                    stay ahead of industry trends. We are committed to creating
                    a platform where creativity meets technology, empowering
                    students to excel in their academic and professional
                    pursuits.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 200, sm: 300, md: 400 }, // Set appropriate heights
                    position: "relative",
                  }}
                >
                  <Suspense
                    fallback={<Skeleton variant="rectangular" height={200} />}
                  >
                    <Gallery images={about_images} galleryId="firstGallery" />
                  </Suspense>
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
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                    }}
                  >
                    The councils at IIT Palakkad play a pivotal role in
                    enhancing the campus experience by promoting student
                    leadership, collaboration, and innovation across various
                    domains. Each council is dedicated to a specific aspect of
                    student life, be it academics, culture, sports, or
                    technology, providing students with the opportunity to
                    develop their skills, contribute to the community, and lead
                    impactful initiatives. These councils work closely with
                    faculty, administration, and industry professionals to
                    organize events, workshops, and activities that foster
                    growth, creativity, and personal development. Through their
                    diverse activities, the councils ensure that every student
                    has the opportunity to engage with their interests,
                    cultivate leadership qualities, and make meaningful
                    contributions to both the college and society.
                  </Typography>
                </Box>
                <Suspense
                  fallback={<Skeleton variant="rectangular" height={200} />}
                >
                  <Gallery images={council_images} galleryId="secondGallery" />
                </Suspense>
              </Grid>
            </Grid>
            <Grid item id="office-of-dean" xs={12} mt={5}>
              <Box mt={4}>
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" },
                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  Office of Dean (Students)
                </Typography>

                <Grid
                  container
                  spacing={4}
                  justifyContent="center"
                  alignItems="center"
                >
                  {deanOfficePeople.map((person, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          p: 2,
                          maxWidth: 300,
                        }}
                      >
                        <Avatar
                          alt={person.name}
                          src={person.image}
                          sx={{
                            width: 120,
                            height: 120,
                            mb: 2,
                            backgroundColor: "grey.300",
                          }}
                          imgProps={{
                            loading: "lazy",
                            style: { objectFit: "cover" },
                          }}
                        />
                        <Typography variant="h6" fontWeight="bold">
                          {person.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mt={1}
                        >
                          {person.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Email: {person.email}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Container>
          <Footer />
        </div>
      </Box>
    </React.Profiler>
  );
};

export default Home;
