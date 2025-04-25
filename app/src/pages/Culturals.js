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
import { CulturalInfo } from "../api/council";
import { motion } from "framer-motion";
import LeadershipSection from "../components/user/LeadershipSection";
import useMediaQuery from '@mui/material/useMediaQuery';

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

          {/* About the Council Section - Always Visible */}
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
                  About the Cultural Council
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
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default Cultural;