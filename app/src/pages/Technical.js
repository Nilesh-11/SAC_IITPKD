import React, {
  useEffect,
  useState,
  Suspense,
  lazy,
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
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { TechnicalInfo } from "../api/council";
import { motion } from "framer-motion";

const Header = lazy(() => import("../components/common/header"));
const Footer = lazy(() => import("../components/common/footer"));
const Gallery = lazy(() => import("../components/common/gallery"));
const LeadershipSection = lazy(() =>
  import("../components/user/LeadershipSection")
);

const Technical = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [council, setCouncil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCouncilData = useCallback(async () => {
    try {
      const res = await TechnicalInfo();
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
    () => ["/council/technical/photo1.webp", "/council/technical/photo2.webp"],
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
              <Suspense
                fallback={<Skeleton variant="rectangular" height={200} />}
              >
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
                  technology in India, IIT Palakkad constantly strives to live
                  up to the IIT tag and to constantly raise the standards by
                  tirelessly working towards creating, sustaining and recreating
                  a healthy, technocratic atmosphere to help the curiosity of
                  budding innovators and engineers of the future. <br />
                  <br />
                  The Technical Council of IIT Palakkad actively advocates and
                  handles all the technical initiatives, events and activities
                  held in the Institute. The council comprises the student
                  representatives, coordinators and faculty, each of who
                  passionately work towards progressively transcending the
                  institute in the field of technology. With this view in mind,
                  the Council also works toward securing a sustainable budget
                  from the Student Affairs Council (SAC) Budget. <br />
                  <br />
                  The Council also takes pride in maintaining the Innovation
                  Lab, which forms the central hub for all creative activities
                  of the students. The lab is well-equipped with modern
                  equipment, tools and material with the facility being
                  student-run and maintained under the supervision of the
                  Technical Affairs Secretary (TAS), appointed under the SAC to
                  drive the growth of technical knowledge at the campus.
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
        </Grid>
      </Container>
      <Suspense fallback={<Skeleton variant="rectangular" height={64} />}>
        <Footer />
      </Suspense>
    </Box>
  );
};

export default React.memo(Technical);
