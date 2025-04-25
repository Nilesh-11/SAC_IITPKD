import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import { FaEnvelope } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Gallery from "../components/common/gallery";
import { AcademicInfo } from "../api/council";
import { motion } from "framer-motion";

const Academic = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [council, setCouncil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCouncilData = async () => {
      try {
        const res = await AcademicInfo();
        res.type === "error"
          ? setError(res.details || "Failed to load council data")
          : setCouncil(res.council);
      } catch (err) {
        setError("Network error - please try again later");
      } finally {
        setLoading(false);
      }
    };
    fetchCouncilData();
  }, []);

  const galleryImages = [
    "/council/academic/photo1.webp",
    "/council/academic/photo2.webp",
    "/council/academic/photo3.webp",
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundImage: "url('/bg1.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat", }}>
      <Header />

      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flex: 1,
          py: 4,
          px: { xs: 2, sm: 3 },
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <Grid container spacing={3}>
          {/* Loading & Error States */}
          {loading && (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            </Grid>
          )}

          {error && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            </Grid>
          )}

          {/* Main Content */}
          {!loading && (
            <>
              {/* Leadership Section - Conditionally Rendered */}
              {council && council.secretary && (
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: 2,
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      <Grid container spacing={2}>
                        {/* Avatar Column */}
                        <Grid item xs={12} sm={4} md={3}>
                          <Box
                            display="flex"
                            justifyContent={{ xs: "center", sm: "flex-start" }}
                          >
                            <Avatar
                              alt={council.secretary.full_name}
                              src={`/student/${council.secretary.email}/photo.webp`}
                              sx={{
                                width: { xs: 96, sm: 128 },
                                height: { xs: 96, sm: 128 },
                                boxShadow: 2,
                              }}
                            />
                          </Box>
                        </Grid>

                        {/* Info Column */}
                        <Grid item xs={12} sm={8} md={9}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              width: "100%",
                            }}
                          >
                            <Typography
                              variant="h5"
                              component="h1"
                              sx={{
                                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                                mb: 1.5,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                width: "100%",
                              }}
                            >
                              <FaInfoCircle fontSize={isMobile ? "small" : "medium"} />
                              {council.council_title}
                            </Typography>

                            <Box
                              sx={{
                                "& > *:not(:last-child)": { mb: 1 },
                                fontSize: { xs: "0.9rem", sm: "1rem" },
                                width: "100%",
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={1}>
                                <FaUser fontSize={isMobile ? "small" : "medium"} />
                                <strong>Secretary:</strong>
                                <span>
                                  {council.secretary.full_name}
                                </span>
                              </Box>

                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                flexWrap="wrap"
                              >
                                <FaEnvelope fontSize={isMobile ? "small" : "medium"} />
                                <strong>Email:</strong>
                                <span style={{ wordBreak: "break-all" }}>
                                  {council.secretary.email}
                                </span>
                              </Box>

                              {council.deputies?.length > 0 && (
                                <Box mt={1.5}>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontSize: { xs: "1rem", sm: "1.1rem" },
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      mb: 1,
                                    }}
                                  >
                                    <FaUsers fontSize={isMobile ? "small" : "medium"} />
                                    Deputy Secretaries
                                  </Typography>
                                  {council.deputies.map((deputy, index) => (
                                    <Box
                                      key={index}
                                      sx={{
                                        pl: 2,
                                        mb: 1,
                                        "& > *": {
                                          fontSize: {
                                            xs: "0.875rem",
                                            sm: "0.95rem",
                                          },
                                        },
                                      }}
                                    >
                                      <div>
                                        <strong>{deputy.full_name}</strong>
                                      </div>
                                      <div style={{ wordBreak: "break-all" }}>
                                        {deputy.email}
                                      </div>
                                    </Box>
                                  ))}
                                </Box>
                              )}

                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                flexWrap="wrap"
                                mt={1.5}
                              >
                                <FaRegEnvelope fontSize={isMobile ? "small" : "medium"} />
                                <strong>Council Email:</strong>
                                <span style={{ wordBreak: "break-all" }}>
                                  {council.council_email}
                                </span>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </motion.div>
                </Grid>
              )}

              {/* Description Section - Always Visible */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Box
                    sx={{
                      p: { xs: 1, sm: 2 },
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{
                        fontSize: { xs: "1.25rem", sm: "1.4rem" },
                        mb: 2,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      About the Academic Council
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography
                      sx={{
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        lineHeight: 1.7,
                        textAlign: "justify",
                        hyphens: "auto",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Academics play a central role in any students’ college life; and at a premiere institute 
                      such as an IIT, the academic life becomes all the more important to the development of 
                      a budding engineer or a scientist or a start-up innovator. Therefore, it becomes utmost 
                      important for the students to have a representative with regards to the academics of the institute.
                      <br /><br />
                      The elected Academic Affairs Secretary carries the principal responsibility of looking out 
                      for the interests of all the students concerned and to help or suggest actions with whatever 
                      issues faced by any of the student community and in nurturing and supporting a healthy academic 
                      life for students. The secretary is also primarily concerned with disseminating any information 
                      on academic matters that is crucial to the knowledge of the student body.
                      <br /><br />
                      The Career Development Centre (CDC) works with the Academic Affairs Secretary, along with a 
                      training and placement officer, faculty advisors, and branch representatives constituting 
                      the team. The Academic Affairs Secretary also overlooks the recently formed alumni association 
                      of IIT Palakkad, which was registered on July 26, 2019, aiming to nurture and maintain good 
                      relationships with our alumnus even after graduation.
                      <br /><br />
                      With Students' Advisor and a faculty (currently, Dr. Lakshmi Narasimhan) as advisors, the team 
                      now has an Alumni Head and further team members are being selected (formation of remaining team 
                      is being held now).
                      <br /><br />
                      The Secretary also works closely with Dean, Academic Research, besides Dean, Academics, to 
                      provide better guidance and infrastructure to the students who are interested in further studies.
                      <br /><br />
                      <Box component="span" sx={{ fontWeight: 'bold' }}>
                        Contact Information:
                      </Box>
                      <br />
                      Dean, Academics: deanacad@iitpkd.ac.in
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>

              {/* Gallery Section - Always Visible */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Box
                    sx={{
                      p: { xs: 1, sm: 2 },
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{
                        fontSize: { xs: "1.25rem", sm: "1.4rem" },
                        mb: 2,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Academic Activities
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Gallery
                      images={galleryImages}
                      galleryId="academicGallery"
                      columns={isMobile ? 1 : 3}
                      imageStyle={{ borderRadius: 8 }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            </>
          )}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default Academic;