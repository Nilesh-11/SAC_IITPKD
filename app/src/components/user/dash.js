import React from "react";
import { Box, Typography, Button, Card, Grid, Divider, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import SquareGallery from "./squareGallery";

const Dashboard = ({ announcements, status, myClubs }) => {
  return (
    <Box sx={{ p: 3, fontFamily: "Poppins, sans-serif" }}>
      <Typography variant="h5" fontWeight={700} color="black">
        DASHBOARD
      </Typography>

      {/* Announcements Section */}
      <Box mt={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight={600} textAlign="left">
            Announcements
          </Typography>
          <Button 
            variant="contained" 
            color="warning" 
            size="small"
            sx={{ 
              transition: "0.3s ease-in-out",
              borderRadius: "20px",
              fontWeight: 600,
              boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
              "&:hover": { 
                backgroundColor: "#d97706", 
                transform: "scale(1.05)", 
                boxShadow: "0px 5px 10px rgba(0,0,0,0.2)" 
              } 
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
                px={3} 
                py={2} 
                sx={{ 
                  bgcolor: "#fff", 
                  transition: "0.3s", 
                  "&:hover": { bgcolor: "#f9f9f9", transform: "scale(1.02)" } 
                }}
              >
                <img 
                  src={announcement.logo} 
                  alt="logo" 
                  style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 12 }} 
                />
                <Box flexGrow={1}>
                  <Typography fontWeight={500} fontSize={14} textAlign="left">
                    {announcement.title}
                  </Typography>
                </Box>
                <Typography fontSize={12} color="text.secondary">{announcement.date}</Typography>
                <IconButton size="small" color="default">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              {index !== announcements.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card>
      </Box>

      {/* Status Label */}
      <Typography mt={3} variant="h6" fontWeight={600} textAlign="left">
        Status
      </Typography>

      {/* Status Section */}
      <Card elevation={2} sx={{ borderRadius: 2, p: 3, mt: 1, bgcolor: "#fafafa", px: 6 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          {status.map((item, index) => (
            <React.Fragment key={index}>
              <Grid item xs textAlign="center">
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center"
                  sx={{
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.05)" }
                  }}
                >
                  <LocalLibraryIcon sx={{ fontSize: 50, color: "orange", mb: 1 }} />
                  <Typography fontSize={14} fontWeight={500}>
                    <strong>{item.count}</strong> {item.title}
                  </Typography>
                </Box>
              </Grid>
              {index !== status.length - 1 && (
                <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: "#ddd" }} />
              )}
            </React.Fragment>
          ))}
        </Grid>
      </Card>

      {/* My Clubs Section */}
      <Box mt={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight={600} textAlign="left">
            My Clubs
          </Typography>
          <Button 
            variant="contained" 
            color="warning" 
            size="small"
            sx={{ 
              transition: "0.3s ease-in-out",
              borderRadius: "20px",
              fontWeight: 600,
              boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
              "&:hover": { 
                backgroundColor: "#d97706", 
                transform: "scale(1.05)", 
                boxShadow: "0px 5px 10px rgba(0,0,0,0.2)" 
              } 
            }}
          >
            VIEW ALL
          </Button>
        </Box>
        <SquareGallery images={myClubs} galleryId={"dashMyClubs"} />
      </Box>
    </Box>
  );
};

export default Dashboard;
