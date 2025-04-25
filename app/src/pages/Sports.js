import React, {
  useEffect,
  useState,
  lazy,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

import { SportsInfo } from "../api/council";
const Header = lazy(() => import("../components/common/header"));
const Footer = lazy(() => import("../components/common/footer"));
const Gallery = lazy(() => import("../components/common/gallery"));
const LeadershipSection = lazy(() =>
  import("../components/user/LeadershipSection")
);

const Sports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [council, setCouncil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCouncilData = useCallback(async () => {
    try {
      const res = await SportsInfo();
      res.type === "error"
        ? setError(res.details || "Failed to load council data")
        : setCouncil(res.council);
    } catch {
      setError("Network error - please try again later");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCouncilData();
  }, [fetchCouncilData]);

  const galleryImages = useMemo(
    () => [
      "/council/sports/photo1.webp",
      "/council/sports/photo2.webp",
      "/council/sports/photo3.webp",
      "/council/sports/photo4.webp",
    ],
    []
  );

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
      <Suspense fallback={<Skeleton variant="rectangular" height={64} />}>
        <Header />
      </Suspense>

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
              <Suspense fallback={<Skeleton height={180} />}>
                {council?.secretary && (
                  <LeadershipSection
                    council={council}
                    councilTitle={council.council_title}
                  />
                )}
              </Suspense>
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
                  About Sports Council
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
                  At IIT Palakkad, we believe that physical activity is just as
                  important as academics for a student’s overall development.
                  The Sports Council plays a pivotal role in fostering a vibrant
                  sporting culture on campus, encouraging students to pursue
                  excellence in a wide variety of sports and fitness activities.
                  <br />
                  <br />
                  The council organizes inter-hostel and inter-college
                  tournaments throughout the year, while also coordinating with
                  external bodies for participation in national-level events
                  like Inter-IIT Sports Meets. With well-equipped sports
                  facilities, including courts for badminton, basketball,
                  volleyball, and a dedicated gym, students are provided with
                  the infrastructure to train and excel.
                  <br />
                  <br />
                  The Sports Secretary, along with deputy secretaries and
                  student coordinators, ensures smooth conduct of all events and
                  continuously works to enhance sporting facilities and training
                  opportunities. Whether you're an experienced athlete or
                  someone who just wants to stay fit, the Sports Council is here
                  to help you stay active, competitive, and motivated.
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          {/* Gallery Section */}
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
        </Grid>
      </Container>

      <Suspense fallback={<Skeleton variant="rectangular" height={64} />}>
        <Footer />
      </Suspense>
    </Box>
  );
};

export default Sports;
