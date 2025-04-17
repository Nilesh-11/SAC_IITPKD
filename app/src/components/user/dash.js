import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import SquareGallery from "./squareGallery";
import timeAgo from "../../utils/parser";
const Dashboard = ({
  announcements,
  status,
  myClubs,
  handleAllAnnouncementClick,
  handleAllClubLink,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

      {/* Announcements Section */}
      <Box mt={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
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
                  src={`/roles/${announcement.author_role}_circular.png`}
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
                <Typography fontSize={12} color="text.secondary" sx={{ ml: 1 }}>
                  {timeAgo(announcement.created_at)}
                </Typography>
              </Box>
              {index !== announcements.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card>
      </Box>

      {/* Status Section */}
      <Typography
        mt={3}
        variant="h6"
        fontWeight={600}
        sx={{ fontFamily: "Poppins, sans-serif" }}
      >
        Status
      </Typography>

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
                <LocalLibraryIcon
                  sx={{ fontSize: 50, color: "orange", mb: 1 }}
                />
                <Typography fontSize={14} fontWeight={500}>
                  <strong>{item.count}</strong> {item.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* My Clubs Section */}
      <Box mt={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ fontFamily: "Poppins, sans-serif" }}
          >
            My Clubs
          </Typography>
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={handleAllClubLink}
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

        <SquareGallery images={myClubs} galleryId="dashMyClubs" />
      </Box>
    </Box>
  );
};

export default Dashboard;
