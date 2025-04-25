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
import { FaEnvelope, FaUser, FaUsers, FaInfoCircle, FaRegEnvelope } from "react-icons/fa";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Gallery from "../components/common/gallery";
import { SportsInfo } from "../api/council";
import { motion } from "framer-motion";

const Sports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [council, setCouncil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCouncilData = async () => {
      try {
        const res = await SportsInfo();
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
    "/council/sports/photo1.webp",
    "/council/sports/photo2.webp",
    "/council/sports/photo3.webp",
    "/council/sports/photo4.webp",
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
                    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4} md={3}>
                          <Box display="flex" justifyContent={{ xs: "center", sm: "flex-start" }}>
                            <Avatar
                              alt={council.secretary.full_name}
                              src={`/student/${council.secretary.email}/photo.webp`}
                              sx={{ width: { xs: 96, sm: 128 }, height: { xs: 96, sm: 128 }, boxShadow: 2 }}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={8} md={9}>
                          <Typography variant="h5" sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                            <FaInfoCircle size={isMobile ? 20 : 24} />
                            {council.council_title}
                          </Typography>

                          <Box sx={{ "& > *:not(:last-child)": { mb: 1 } }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <FaUser size={isMobile ? 20 : 24} />
                              <strong>Secretary:</strong> {council.secretary.full_name}
                            </Box>
                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                              <FaEnvelope size={isMobile ? 20 : 24} />
                              <strong>Email:</strong> <span style={{ wordBreak: "break-all" }}>{council.secretary.email}</span>
                            </Box>

                            {council.deputies?.length > 0 && (
                              <Box mt={1.5}>
                                <Typography variant="subtitle1" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                                  <FaUsers size={isMobile ? 20 : 24} />
                                  Deputy Secretaries
                                </Typography>
                                {council.deputies.map((deputy, index) => (
                                  <Box key={index} sx={{ pl: 2, mb: 1 }}>
                                    <div><strong>{deputy.full_name}</strong></div>
                                    <div style={{ wordBreak: "break-all" }}>{deputy.email}</div>
                                  </Box>
                                ))}
                              </Box>
                            )}

                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mt={1.5}>
                              <FaRegEnvelope size={isMobile ? 20 : 24} />
                              <strong>Council Email:</strong> <span style={{ wordBreak: "break-all" }}>{council.council_email}</span>
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
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      About Sports Council
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, lineHeight: 1.7, textAlign: "justify", whiteSpace: "pre-wrap" }}>
                      At IIT Palakkad, we believe that physical activity is just as important as academics for a student’s overall development. 
                      The Sports Council plays a pivotal role in fostering a vibrant sporting culture on campus, encouraging students to pursue excellence in a wide variety of sports and fitness activities.

                      <br /><br />
                      The council organizes inter-hostel and inter-college tournaments throughout the year, while also coordinating with external bodies for participation in national-level events like Inter-IIT Sports Meets. 
                      With well-equipped sports facilities, including courts for badminton, basketball, volleyball, and a dedicated gym, students are provided with the infrastructure to train and excel.

                      <br /><br />
                      The Sports Secretary, along with deputy secretaries and student coordinators, ensures smooth conduct of all events and continuously works to enhance sporting facilities and training opportunities. 
                      Whether you're an experienced athlete or someone who just wants to stay fit, the Sports Council is here to help you stay active, competitive, and motivated.
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>

              {/* Gallery Section */}
              <Grid item xs={12}>
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                  <Box sx={{ p: { xs: 1, sm: 2 }, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Glimpses from the Field
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Gallery
                      images={galleryImages}
                      galleryId="sportsGallery"
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

export default Sports;
