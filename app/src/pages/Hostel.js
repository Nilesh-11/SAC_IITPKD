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
import { HostelInfo } from "../api/council";
import { motion } from "framer-motion";

const Hostel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [council, setCouncil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCouncilData = async () => {
      try {
        const res = await HostelInfo();
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
    "/council/hostel/photo1.jpg",
    "/council/hostel/photo2.jpg",
    "/council/hostel/photo3.jpg",
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundImage: "url('/bg1.jpg')",
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
                              src={`/student/${council.secretary.email}/photo.jpg`}
                              sx={{ width: { xs: 96, sm: 128 }, height: { xs: 96, sm: 128 }, boxShadow: 2 }}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={8} md={9}>
                          <Typography variant="h5" sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                            <Info fontSize={isMobile ? "small" : "medium"} />
                            {council.council_title}
                          </Typography>

                          <Box sx={{ "& > *:not(:last-child)": { mb: 1 } }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Person fontSize={isMobile ? "small" : "medium"} />
                              <strong>Secretary:</strong> {council.secretary.full_name}
                            </Box>
                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                              <Email fontSize={isMobile ? "small" : "medium"} />
                              <strong>Email:</strong> <span style={{ wordBreak: "break-all" }}>{council.secretary.email}</span>
                            </Box>

                            {council.deputies?.length > 0 && (
                              <Box mt={1.5}>
                                <Typography variant="subtitle1" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                                  <Groups fontSize={isMobile ? "small" : "medium"} />
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
                              <AlternateEmail fontSize={isMobile ? "small" : "medium"} />
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
                      About Hostel Affairs Council
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, lineHeight: 1.7, textAlign: "justify", whiteSpace: "pre-wrap" }}>
                      We, at IIT Palakkad, firmly believe that a good, nurturing environment leads to the better productivity of all the students concerned.
                      Which is why, the Hostel Affairs Council, headed by the Hostel Affairs Secretary, is dedicated to make the environment of all the hostels conducive to better productivity and innovation.

                      <br /><br />
                      Currently, we are located across two different campuses viz the Ahalia Campus and the Nila Campus, with three hostels spread across each campus, taking the total count to 6 hostels.

                      <br /><br />
                      Each of the hostels has a hostel wing-wise representative to better present the problems faced by the students of the particular hostel regarding the hostel and the mess to the Hostel Council, hence making it easier for students to report their problems as well.
                      In order to make the system more fluidic, who overlooks all the issues that may be faced by the students and helps the Hostel Affairs Secretary to understand them better.
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>

              {/* Gallery Section */}
              <Grid item xs={12}>
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                  <Box sx={{ p: { xs: 1, sm: 2 }, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Hostel Life at IITPKD
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Gallery
                      images={galleryImages}
                      galleryId="hostelGallery"
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

export default Hostel;
