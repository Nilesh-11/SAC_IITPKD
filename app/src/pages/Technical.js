import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Email,
  Person,
  Groups,
  Info,
  AlternateEmail,
} from "@mui/icons-material";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Gallery from "../components/common/gallery";
import { TechnicalInfo } from "../api/council";
import { motion } from "framer-motion";

const Technical = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [council, setCouncil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCouncilData = async () => {
      try {
        const res = await TechnicalInfo();
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
    "/council/technical/photo1.jpg",
    "/council/technical/photo2.jpg",
    "/council/technical/photo3.jpg",
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
          {!loading && council && (
            <>
              {/* Leadership Section - Conditionally Rendered */}
              {council.secretary && (
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
                              src={`/student/${council.secretary.email}/photo.jpg`}
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
                              <Info fontSize={isMobile ? "small" : "medium"} />
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
                                <Person fontSize={isMobile ? "small" : "medium"} />
                                <strong>Secretary:</strong>
                                <span>
                                  {council.secretary.full_name} (
                                  {council.secretary.name})
                                </span>
                              </Box>

                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                flexWrap="wrap"
                              >
                                <Email fontSize={isMobile ? "small" : "medium"} />
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
                                    <Groups fontSize={isMobile ? "small" : "medium"} />
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
                                        <strong>{deputy.full_name}</strong> (
                                        {deputy.name})
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
                                <AlternateEmail fontSize={isMobile ? "small" : "medium"} />
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
                      About the Technical Council
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
                      As one of the newly established premier institutes of
                      technology in India, IIT Palakkad constantly strives to
                      live up to the IIT tag and to constantly raise the
                      standards by tirelessly working towards creating,
                      sustaining and recreating a healthy, technocratic
                      atmosphere to help the curiosity of budding innovators and
                      engineers of the future. <br />
                      <br />
                      The Technical Council of IIT Palakkad actively advocates
                      and handles all the technical initiatives, events and
                      activities held in the Institute. The council comprises
                      the student representatives, coordinators and faculty,
                      each of who passionately work towards progressively
                      transcending the institute in the field of technology.
                      With this view in mind, the Council also works toward
                      securing a sustainable budget from the Student Affairs
                      Council (SAC) Budget. <br />
                      <br />
                      The Council also takes pride in maintaining the Innovation
                      Lab, which forms the central hub for all creative
                      activities of the students. The lab is well-equipped with
                      modern equipment, tools and material with the facility
                      being student-run and maintained under the supervision of
                      the Technical Affairs Secretary (TAS), appointed under the
                      SAC to drive the growth of technical knowledge at the
                      campus.
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
                      Glimpses of Innovation
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Gallery
                      images={galleryImages}
                      galleryId="technicalGallery"
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

export default Technical;