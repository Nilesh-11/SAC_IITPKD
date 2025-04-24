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
import { MdEmail, MdPerson, MdGroup, MdInfo, MdAlternateEmail, MdSchool } from "react-icons/md";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Gallery from "../components/common/gallery";
import { ResearchInfo } from "../api/council";
import { motion } from "framer-motion";

const Research = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [council, setCouncil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCouncilData = async () => {
      try {
        const res = await ResearchInfo();
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
    "/council/research/photo1.webp",
    "/council/research/photo2.webp",
    "/council/research/photo3.webp",
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
                            <MdInfo size={isMobile ? 20 : 24} />
                            {council.council_title}
                          </Typography>

                          <Box sx={{ "& > *:not(:last-child)": { mb: 1 } }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <MdPerson size={isMobile ? 20 : 24} />
                              <strong>Secretary:</strong> {council.secretary.full_name}
                            </Box>
                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                              <MdEmail size={isMobile ? 20 : 24} />
                              <strong>Email:</strong> <span style={{ wordBreak: "break-all" }}>{council.secretary.email}</span>
                            </Box>

                            {council.deputies?.length > 0 && (
                              <Box mt={1.5}>
                                <Typography variant="subtitle1" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                                  <MdGroup size={isMobile ? 20 : 24} />
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
                              <MdAlternateEmail size={isMobile ? 20 : 24} />
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
                      About Research Affairs Council
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, lineHeight: 1.7, textAlign: "justify", whiteSpace: "pre-wrap" }}>
                      With our institute ever-evolving, we have seen tremendous growth in the quantity and quality of research that takes place.
                      This also means constantly working on getting state-of-the-art research equipment to better facilitate the budding researchers of the future.

                      <br /><br />
                      In line with the growing needs of the research community, the institute instigated the Research Affairs Secretary post in October 2020.

                      <br /><br />
                      The post is currently being held by the former PG Affairs Secretary, Ms Aiswarya Pradeepkumar, who is currently pursuing her PhD in Philosophy.
                      And as the name of the post goes, the secretary will cater to all the needs and problems faced by the research students and bring it up to the institute’s attention alongside offering possible solutions to the problems as may have been suggested by the research community.

                      <br /><br />
                      The secretary also works closely with the Dean, Academic Research to provide better guidance and infrastructure to the post-graduates.
                      <br />
                      <strong>Dean, Academic Research:</strong> <a href="mailto:deanresearch@iitpkd.ac.in">deanresearch@iitpkd.ac.in</a>
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>

              {/* Gallery Section */}
              <Grid item xs={12}>
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                  <Box sx={{ p: { xs: 1, sm: 2 }, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Research Life at IITPKD
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Gallery
                      images={galleryImages}
                      galleryId="researchGallery"
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

export default Research;
