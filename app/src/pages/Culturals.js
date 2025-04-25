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
import {
  FaUsers,
  FaRegEnvelope,
} from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Gallery from "../components/common/gallery";
import { CulturalInfo } from "../api/council";
import { motion } from "framer-motion";

const Cultural = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [council, setCouncil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCouncilData = async () => {
      try {
        const res = await CulturalInfo();
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
    "/council/cultural/photo1.webp",
    "/council/cultural/photo2.webp",
    "/council/cultural/photo3.webp",
    "/council/cultural/photo4.webp",
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

          {!loading && (
            <>
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
                        <Grid item xs={12} sm={4} md={3}>
                          <Box display="flex" justifyContent={{ xs: "center", sm: "flex-start" }}>
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

                        <Grid item xs={12} sm={8} md={9}>
                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
                            <Typography variant="h5" sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem" }, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                              <FaInfoCircle fontSize={isMobile ? "small" : "medium"} />
                              {council.council_title}
                            </Typography>

                            <Box sx={{ "& > *:not(:last-child)": { mb: 1 }, fontSize: { xs: "0.9rem", sm: "1rem" }, width: "100%" }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <FaUser fontSize={isMobile ? "small" : "medium"} />
                                <strong>Secretary:</strong>
                                <span>{council.secretary.full_name}</span>
                              </Box>

                              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                <FaEnvelope fontSize={isMobile ? "small" : "medium"} />
                                <strong>Email:</strong>
                                <span style={{ wordBreak: "break-all" }}>{council.secretary.email}</span>
                              </Box>

                              {council.deputies?.length > 0 && (
                                <Box mt={1.5}>
                                  <Typography variant="subtitle1" sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <FaUsers fontSize={isMobile ? "small" : "medium"} />
                                    Deputy Secretaries
                                  </Typography>
                                  {council.deputies.map((deputy, index) => (
                                    <Box key={index} sx={{ pl: 2, mb: 1, "& > *": { fontSize: { xs: "0.875rem", sm: "0.95rem" } } }}>
                                      <div><strong>{deputy.full_name}</strong></div>
                                      <div style={{ wordBreak: "break-all" }}>{deputy.email}</div>
                                    </Box>
                                  ))}
                                </Box>
                              )}

                              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mt={1.5}>
                                <FaRegEnvelope fontSize={isMobile ? "small" : "medium"} />
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

              {/* Description Section */}
              <Grid item xs={12}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <Box sx={{ p: { xs: 1, sm: 2 }, backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ fontSize: { xs: "1.25rem", sm: "1.4rem" }, mb: 2, fontFamily: "Poppins, sans-serif" }}>
                      About the Cultural Council
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, lineHeight: 1.7, textAlign: "justify", hyphens: "auto", whiteSpace: "pre-wrap" }}>
                      The Cultural Council of IIT Palakkad is committed to nurturing the vibrant and diverse cultural life on campus.
                      It provides a platform for students to express their artistic and creative talents across music, dance, drama, literature, fine arts, and more.
                      <br /><br />
                      The Council organizes a wide variety of events throughout the year, including the institute's flagship cultural fest, workshops, inter-hostel competitions, and collaboration with clubs.
                      The council also promotes inclusivity and encourages participation from students of all backgrounds to foster a sense of community and joy through culture.
                      <br /><br />
                      Led by the Cultural Affairs Secretary and supported by deputy secretaries and volunteers, the council works under the SAC framework to bring energy and celebration to campus life.
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>

              {/* Gallery Section */}
              <Grid item xs={12}>
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                  <Box sx={{ p: { xs: 1, sm: 2 }, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
                    <Typography variant="h5" sx={{ fontSize: { xs: "1.25rem", sm: "1.4rem" }, mb: 2, fontFamily: "Poppins, sans-serif" }}>
                      Cultural Highlights
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Gallery
                      images={galleryImages}
                      galleryId="culturalGallery"
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

export default Cultural;
