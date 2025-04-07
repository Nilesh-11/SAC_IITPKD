import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RightNavbar = ({ username, userLogo, liveEvents, activity, onClose }) => {
  return (
    <Box>

      {/* User Profile */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          {username}
        </Typography>
        <Avatar src={userLogo} sx={{ width: 50, height: 50, transition: "all 0.3s", "&:hover": { transform: "scale(1.1)" } }} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Live Events Section */}
      <Typography variant="subtitle1" color="text.secondary" fontWeight="bold" gutterBottom>
        Live Events
      </Typography>
      {liveEvents.map((event, index) => (
        <Paper
          key={index}
          elevation={3}
          sx={{
            bgcolor: "rgb(255,204,160)",
            p: 2,
            borderRadius: 2,
            mb: 2,
            transition: "all 0.3s ease-in-out",
            "&:hover": { bgcolor: "rgb(255,153,65)", transform: "scale(1.02)" },
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Avatar src={event.club_logo_src} sx={{ width: 40, height: 40, transition: "all 0.3s", "&:hover": { transform: "scale(1.1)" } }} />
            <Box sx={{ flexGrow: 1, mx: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {event.club}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {event.title}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              sx={{
                bgcolor: "#ff6600",
                transition: "all 0.3s ease-in-out",
                "&:hover": { bgcolor: "#e65c00", transform: "scale(1.1)" },
              }}
              href={event.link}
            >
              Join
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" mt={1}>
            {event.info}
          </Typography>
        </Paper>
      ))}

      {/* Activity Section */}
      <Typography variant="subtitle1" color="text.secondary" fontWeight="bold" gutterBottom>
        Activity
      </Typography>
      {activity.map((act, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          mb={2}
          sx={{ transition: "all 0.3s ease-in-out", "&:hover": { transform: "scale(1.02)" } }}
        >
          <Box
            sx={{
              width: 4,
              height: 40,
              bgcolor: "rgb(183,102,32)",
              borderRadius: 2,
              mr: 2,
            }}
          />
          <Avatar src={act.club_logo_src} sx={{ width: 30, height: 30, mr: 2, transition: "all 0.3s", "&:hover": { transform: "scale(1.1)" } }} />
          <Typography variant="body2">
            <b>{act.user}</b> has replied on <b>{act.club}</b>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default RightNavbar;
