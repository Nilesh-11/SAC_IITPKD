import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Gallery from "../components/common/gallery";
import { AcademicInfo } from "../api/council";
import { motion } from "framer-motion";
import LeadershipSection from "../components/user/LeadershipSection";
import useMediaQuery from '@mui/material/useMediaQuery';

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
    "/council/academic/photo4.webp",
  ];

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      backgroundImage: "url('/bg1.webp')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat", 
    }}>
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
                  Academics play a central role in any students' college life; and at a premiere institute 
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
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default Academic;