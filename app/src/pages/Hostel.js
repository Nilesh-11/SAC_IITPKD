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
import { motion } from "framer-motion";
import { HostelInfo } from "../api/council";

const Header = lazy(() => import("../components/common/header"));
const Footer = lazy(() => import("../components/common/footer"));
const Gallery = lazy(() => import("../components/common/gallery"));
const LeadershipSection = lazy(() =>
  import("../components/user/LeadershipSection")
);

const Hostel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [council, setCouncil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCouncilData = useCallback(async () => {
    try {
      const res = await HostelInfo();
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
      "/council/hostel/photo1.webp",
      "/council/hostel/photo2.webp",
      "/council/hostel/photo3.webp",
      "/council/hostel/photo4.webp",
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
                  About Hostel Affairs Council
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
                  At IIT Palakkad, we firmly believe that a supportive and
                  nurturing environment is fundamental to enhancing the
                  productivity and well-being of our students. In pursuit of
                  this vision, the Hostel Affairs Council, under the leadership
                  of the Hostel Affairs Secretary, is committed to fostering a
                  hostel environment that promotes academic excellence,
                  innovation, and holistic development.
                  <br />
                  <br />
                  The Institute currently operates across two campuses: the{" "}
                  <strong>Nila Campus</strong> and the{" "}
                  <strong>Sahyadri Campus</strong>.
                  <br />• The <strong>Nila Campus</strong> houses two hostels:{" "}
                  <strong>Tilang</strong> (subdivided into{" "}
                  <strong>Tilang A</strong> and <strong>Tilang B</strong>) and{" "}
                  <strong>Brindavani</strong>.
                  <br />• The <strong>Sahyadri Campus</strong> accommodates two
                  hostels: <strong>Saveri</strong> and <strong>Malhar</strong>.
                  <br />
                  <br />
                  To ensure effective communication and swift resolution of
                  student concerns, each hostel has designated wing-wise
                  representatives. These representatives act as the primary
                  liaison between the students and the Hostel Affairs Council,
                  facilitating the reporting and addressing of issues related to
                  hostel facilities and mess services. Furthermore, a dedicated
                  coordinator supervises hostel affairs across both campuses,
                  assisting the Hostel Affairs Secretary in identifying and
                  addressing student needs promptly and efficiently.
                  <br />
                  <br />
                  Through these measures, we strive to create a residential
                  environment that empowers students to achieve their fullest
                  potential.
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
                  component="h2"
                  sx={{
                    fontSize: { xs: "1.25rem", sm: "1.4rem" },
                    mb: 2,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Hostel Life at IITPKD
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Suspense
                  fallback={<Skeleton variant="rectangular" height={300} />}
                >
                  <Gallery
                    images={galleryImages}
                    galleryId="hostelGallery"
                    columns={isMobile ? 1 : 3}
                    imageStyle={{ borderRadius: 8 }}
                  />
                </Suspense>
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

export default React.memo(Hostel);
