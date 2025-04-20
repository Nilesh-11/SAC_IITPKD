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
import { PostgraduateInfo } from "../api/council";
import { motion } from "framer-motion";

const Postgraduate = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [council, setCouncil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCouncilData = async () => {
      try {
        const res = await PostgraduateInfo();
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
    "/council/postgraduate/photo1.jpg",
    "/council/postgraduate/photo2.jpg",
    "/council/postgraduate/photo3.jpg",
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <Container
        component="main"
        maxWidth="lg"
        sx={{ flex: 1, py: 4, px: { xs: 2, sm: 3 }, width: "100%", overflowX: "hidden" }}
      >
        <Grid container spacing={3}>
          {loading && (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            </Grid>
          )}

          {error && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            </Grid>
          )}

          {!loading &&  (
            <>
              {council && council.secretary && (
                <Grid item xs={12}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4} md={3}>
                          <Box display="flex" justifyContent={{ xs: "center", sm: "flex-start" }}>
                            <Avatar
                              alt={council.secretary.full_name}
                              src={`/student/${council.secretary.email}/photo.jpg`}
                              sx={{ width: { xs: 96, sm: 128 }, height: { xs: 96, sm: 128 }, boxShadow: 2 }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <Typography variant="h5" sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem" }, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                              <Info fontSize={isMobile ? "small" : "medium"} />
                              {council.council_title}
                            </Typography>

                            <Box sx={{ "& > *:not(:last-child)": { mb: 1 }, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Person fontSize={isMobile ? "small" : "medium"} />
                                <strong>Secretary:</strong>
                                <span>{council.secretary.full_name} ({council.secretary.name})</span>
                              </Box>

                              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                <Email fontSize={isMobile ? "small" : "medium"} />
                                <strong>Email:</strong>
                                <span style={{ wordBreak: "break-all" }}>{council.secretary.email}</span>
                              </Box>

                              {council.deputies?.length > 0 && (
                                <Box mt={1.5}>
                                  <Typography variant="subtitle1" sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <Groups fontSize={isMobile ? "small" : "medium"} />
                                    Deputy Secretaries
                                  </Typography>
                                  {council.deputies.map((deputy, index) => (
                                    <Box key={index} sx={{ pl: 2, mb: 1 }}>
                                      <div><strong>{deputy.full_name}</strong> ({deputy.name})</div>
                                      <div style={{ wordBreak: "break-all" }}>{deputy.email}</div>
                                    </Box>
                                  ))}
                                </Box>
                              )}

                              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mt={1.5}>
                                <AlternateEmail fontSize={isMobile ? "small" : "medium"} />
                                <strong>Council Email:</strong>
                                <span style={{ wordBreak: "break-all" }}>{council.council_email}</span>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </motion.div>
                </Grid>
              )}

              <Grid item xs={12}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <Box sx={{ p: { xs: 1, sm: 2 }, backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ fontSize: { xs: "1.25rem", sm: "1.4rem" }, mb: 2, fontFamily: "Poppins, sans-serif" }}>
                      About the Postgraduate Council
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, lineHeight: 1.7, textAlign: "justify", whiteSpace: "pre-wrap" }}>
                      The PG section has grown a lot with the institute currently offering MS, M.Tech, M.Sc, and PhD degrees, with some M.Sc. and M.Tech courses beginning only the previous year. Being more experienced, PG students also become fundamental in the process of creating a more hands-on culture in the institute and some often offer guidance by assisting some professors in their undergrad courses. Even so, most of the PG students are usually working in labs and are always approachable and offer guidance to any undergrad who is interested in further studies.

                      Secretary, Post Graduate (SPG) Affairs is unique in itself as the secretary represents the welfare of the whole of the PG student community in all regards: academic, cultural, technical, sports and hostel too, except for research, which is dedicatedly handled by the Secretary, Research Affairs. SPG gives important advice and feedback from the PG students and hence plays an integral, indispensable role in the proper functioning of SAC.

                      The institute, in collaboration with the SGP and SRA, organizes seminars, talks, institute colloquium, etc which form an essential part of the day-to-day activities for PG scholars. Research Scholar’s Day, like in other esteemed institutes, is also celebrated at IIT Palakkad, under the management of SGP. The secretary also works closely with the Associate Dean (Academics, PG) and Dean (Students) to provide better guidance and infrastructure to the post-graduates.

                      Associate Dean (Academics, PG): adpg@iitpkd.ac.in
                      Dean (Students): deanstudents@iitpkd.ac.in
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12}>
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                  <Box sx={{ p: { xs: 1, sm: 2 }, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
                    <Typography variant="h5" sx={{ fontSize: { xs: "1.25rem", sm: "1.4rem" }, mb: 2, fontFamily: "Poppins, sans-serif" }}>
                      PG Council Highlights
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Gallery
                      images={galleryImages}
                      galleryId="postgraduateGallery"
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

export default Postgraduate;