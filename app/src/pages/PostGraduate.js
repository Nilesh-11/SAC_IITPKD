import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Gallery from "../components/common/gallery";
import { PostgraduateInfo } from "../api/council";
import { motion } from "framer-motion";
import LeadershipSection from "../components/user/LeadershipSection";

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
    "/council/postgraduate/photo1.webp",
    "/council/postgraduate/photo2.webp",
    "/council/postgraduate/photo3.webp",
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: "url('/bg1.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
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
          {/* Leadership Section with Loading/Error States */}
          <Grid item xs={12}>
            {loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : (
              council?.secretary && (
                <LeadershipSection
                  council={council}
                  councilTitle={council.council_title}
                />
              )
            )}
          </Grid>

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
                  sx={{
                    fontSize: { xs: "1.25rem", sm: "1.4rem" },
                    mb: 2,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  About the Postgraduate Council
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    lineHeight: 1.7,
                    textAlign: "justify",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  The PG section has grown a lot with the institute currently
                  offering MS, M.Tech, M.Sc, and PhD degrees, with some M.Sc.
                  and M.Tech courses beginning only the previous year. Being
                  more experienced, PG students also become fundamental in the
                  process of creating a more hands-on culture in the institute
                  and some often offer guidance by assisting some professors in
                  their undergrad courses. Even so, most of the PG students are
                  usually working in labs and are always approachable and offer
                  guidance to any undergrad who is interested in further
                  studies. Secretary, Post Graduate (SPG) Affairs is unique in
                  itself as the secretary represents the welfare of the whole of
                  the PG student community in all regards: academic, cultural,
                  technical, sports and hostel too, except for research, which
                  is dedicatedly handled by the Secretary, Research Affairs. SPG
                  gives important advice and feedback from the PG students and
                  hence plays an integral, indispensable role in the proper
                  functioning of SAC. <br />
                  <br />The institute, in collaboration with the
                  SGP and SRA, organizes seminars, talks, institute colloquium,
                  etc which form an essential part of the day-to-day activities
                  for PG scholars. Research Scholar’s Day, like in other
                  esteemed institutes, is also celebrated at IIT Palakkad, under
                  the management of SGP. The secretary also works closely with
                  the Associate Dean (Academics, PG) and Dean (Students) to
                  provide better guidance and infrastructure to the
                  post-graduates. Associate Dean (Academics, PG):
                  adpg@iitpkd.ac.in Dean (Students): deanstudents@iitpkd.ac.in
                </Typography>
              </Box>
            </motion.div>
          </Grid>

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
                  sx={{
                    fontSize: { xs: "1.25rem", sm: "1.4rem" },
                    mb: 2,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
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
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default Postgraduate;
