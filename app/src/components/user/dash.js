import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CircularProgress from '@mui/material/CircularProgress';
import { FaUniversity } from "react-icons/fa";
import timeAgo from "../../utils/parser";
import { ClubsListApi, StatusApi } from "../../api/public";
import { getAnnouncementsList } from "../../api/announcement";
import ClubsGallery from "./clubsGallery";

const Dashboard = ({
  role = "student",
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [announcements, setAnnouncements] = useState([]);
  const [status, setStatus] = useState("");
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAllAnnouncementClick = () => {
    navigate(`/${role}/dashboard?currSection=announcements`);
  };
  const handleAllClubLink = () => {
    navigate(`/${role}/dashboard?currSection=clubs`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [annData, statData, clubData] = await Promise.all([
          getAnnouncementsList(),
          StatusApi(),
          ClubsListApi()
        ]);
        setMyClubs(clubData.clubs.map(item => `/clubs/${item.name}/opaque_logo_square.webp`));
        setAnnouncements(annData);
        setStatus(statData);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <h2>Loading Announcements...</h2>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{
          fontFamily: "Poppins, sans-serif",
          color: "rgba(255, 154, 65, 0.96)",
        }}
      >
        DASHBOARD
      </Typography>

      <Box mt={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ fontFamily: "Poppins, sans-serif" }}
          >
            Announcements
          </Typography>
          <Button
            variant="contained"
            color="warning"
            size="small"
            disabled={!(role === "student" || role==="guest")}
            onClick={handleAllAnnouncementClick}
            sx={{
              borderRadius: "20px",
              fontWeight: 600,
              boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
              transition: "0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#d97706",
                transform: "scale(1.05)",
                boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
              },
            }}
          >
            VIEW ALL
          </Button>
        </Box>
        {announcements.length > 0 ? (
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            {announcements.map((announcement, index) => (
              <React.Fragment key={index}>
                <Box
                  display="flex"
                  alignItems="center"
                  px={{ xs: 2, sm: 3 }}
                  py={2}
                  sx={{
                    bgcolor: "#fff",
                    transition: "0.3s",
                    "&:hover": { bgcolor: "#f9f9f9", transform: "scale(1.02)" },
                  }}
                >
                  <img
                    src={`/roles/${announcement.author_role}_circular.webp`}
                    alt="logo"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      marginRight: 12,
                      flexShrink: 0,
                    }}
                  />
                  <Box flexGrow={1} minWidth={0}>
                    <Typography
                      fontWeight={500}
                      fontSize={14}
                      textAlign="left"
                      noWrap={isSmallScreen}
                    >
                      {announcement.title}
                    </Typography>
                  </Box>
                  <Typography
                    fontSize={12}
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    {timeAgo(announcement.created_at)}
                  </Typography>
                </Box>
                {index !== announcements.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card>
        ) : (
          <Typography variant="body2" color="text.secondary" mt={1}>
            No announcements at the moment.
          </Typography>
        )}
      </Box>

      <Typography
        mt={3}
        variant="h6"
        fontWeight={600}
        sx={{ fontFamily: "Poppins, sans-serif" }}
      >
        Status
      </Typography>
      {status.length > 0 ? (
        <Card
          elevation={2}
          sx={{
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
            mt: 1,
            bgcolor: "#fafafa",
          }}
        >
          <Grid
            container
            spacing={isSmallScreen ? 2 : 0}
            alignItems="center"
            justifyContent="space-between"
          >
            {status.map((item, index) => (
              <Grid item xs={12} sm={6} md textAlign="center" key={index}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  sx={{
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                    py: isSmallScreen ? 1 : 0,
                  }}
                >
                  <FaUniversity sx={{ fontSize: 50, color: "orange", mb: 1 }} />
                  <Typography fontSize={14} fontWeight={500}>
                    <strong>{item.count}</strong> {item.title}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      ) : (
        <Typography variant="body2" color="text.secondary" mt={1}>
          Status information not available.
        </Typography>
      )}

      <Box mt={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ fontFamily: "Poppins, sans-serif" }}
          >
            Clubs
          </Typography>
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={handleAllClubLink}
            disabled={!(role === "student")}
            sx={{
              borderRadius: "20px",
              fontWeight: 600,
              boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
              transition: "0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#d97706",
                transform: "scale(1.05)",
                boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
              },
            }}
          >
            VIEW ALL
          </Button>
        </Box>

        <ClubsGallery images={myClubs} galleryId="dashMyClubs" />
      </Box>
    </Box>
  );
};

export default Dashboard;
