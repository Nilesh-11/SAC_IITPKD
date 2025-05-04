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

const secretaries_2024 = [
  {
    name: "Karthikeya B",
    title: "Students General Secretary",
    email: "gen_sec@smail.iitpkd.ac.in",
    image: "/student/112101006@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "C V Tirumala Rao ",
    title: "Technical Affairs Secretary",
    email: "sec_tech@smail.iitpkd.ac.in",
    image: "/student/122101043@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "D. Sai Hemanth Reddy",
    title: "Academic Affairs Secretary",
    email: "sec_acad@smail.iitpkd.ac.in",
    image: "/student/112101014@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "Kishore S K",
    title: "Cultural Affairs Secretary",
    email: "sec_arts@smail.iitpkd.ac.in",
    image: "/student/122201019@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "Dipanshu Dutta",
    title: "Sports Affairs Secretary",
    email: "sec_sports@smail.iitpkd.ac.in",
    image: "/student/102101014@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "Bhaskar",
    title: "Post Graduate Affairs Secretary",
    email: "sec_pg@smail.iitpkd.ac.in",
    image: "/student/142302004@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "Revanth Juvvala",
    title: "Hostel Affairs Secretary",
    email: "sec_hostel@smail.iitpkd.ac.in",
    image: "/student/112101021@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "Ajju R Justus",
    title: "Research Affairs Secretary",
    email: "sec_ra@smail.iitpkd.ac.in",
    image: "/student/132204001@smail.iitpkd.ac.in/photo.webp",
  },
];

const secretaries_2025 = [
  {
    name: "Dhaarini M",
    title: "Students General Secretary",
    email: "gen_sec@smail.iitpkd.ac.in",
    image: "/student/102201009@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "Varun Jha",
    title: "Technical Affairs Secretary",
    email: "sec_tech@smail.iitpkd.ac.in",
    image: "/student/112301036@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "Divesh Mishra",
    title: "Academic Affairs Secretary",
    email: "sec_acad@smail.iitpkd.ac.in",
    image: "/student/102201019@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "Joy Patel",
    title: "Cultural Affairs Secretary",
    email: "sec_arts@smail.iitpkd.ac.in",
    image: "/student/132201022@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "Amuluru Pavan Sai",
    title: "Sports Affairs Secretary",
    email: "sec_sports@smail.iitpkd.ac.in",
    image: "/student/122201022@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "Geddam Gowtham",
    title: "Post Graduate Affairs Secretary",
    email: "sec_pg@smail.iitpkd.ac.in",
    image: "/student/142402006@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "Koshal Kumar",
    title: "Hostel Affairs Secretary",
    email: "sec_hostel@smail.iitpkd.ac.in",
    image: "/student/122301022@smail.iitpkd.ac.in/photo.webp",
  },
  {
    name: "Chamind Erakkil",
    title: "Research Affairs Secretary",
    email: "sec_ra@smail.iitpkd.ac.in",
    image: "/student/132314003@smail.iitpkd.ac.in/photo.webp",
  },
];
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
    "/council/photo19.webp",
    "/council/photo16.webp",
    "/council/photo10.webp",
    "/council/photo14.webp",
  ];
  const council_images = [
    "/council/photo13.webp",
    "/council/photo17.webp",
    "/council/photo18.webp",
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
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      lineHeight: 1.7,
                      textAlign: "justify",
                      hyphens: "auto",
                      whiteSpace: "pre-wrap",
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
                <Suspense
                  fallback={<Skeleton variant="rectangular" height={200} />}
                >
                  <Gallery images={about_images} galleryId="firstGallery" />
                </Suspense>
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
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      lineHeight: 1.7,
                      textAlign: "justify",
                      hyphens: "auto",
                      whiteSpace: "pre-wrap",
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
            <Grid item id="secretaries" xs={12} mt={5}>
              <Box mt={4}>
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" },
                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  Meet Our Secretaries
                </Typography>

                <Grid
                  container
                  spacing={4}
                  justifyContent="center"
                  alignItems="stretch"
                >
                  {secretaries_2024.map((secretary, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
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
                          maxWidth: 280,
                        }}
                      >
                        <Avatar
                          alt={secretary.name}
                          src={secretary.image}
                          sx={{
                            width: 110,
                            height: 110,
                            mb: 2,
                            backgroundColor: "grey.300",
                          }}
                          imgProps={{
                            loading: "lazy",
                            style: { objectFit: "cover" },
                          }}
                        />
                        <Typography variant="h6" fontWeight="bold">
                          {secretary.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mt={1}
                        >
                          {secretary.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Email: {secretary.email}
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
