import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

const RightNavbar = ({ username, liveEvents, userrole }) => {

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        py: 2,
        maxHeight: "100vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* User Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={1}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, fontFamily: 'Poppins, sans-serif' }}
        >
          {username}
        </Typography>
        <Avatar
          src={`/roles/${userrole}_circular.png`}
          sx={{
            width: 50,
            height: 50,
            transition: "all 0.3s",
            "&:hover": { transform: "scale(1.1)" },
          }}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Live Events Section */}
      <Typography
        variant="subtitle1"
        color="text.secondary"
        fontWeight="bold"
        gutterBottom
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      >
        Live Events
      </Typography>
      {liveEvents && liveEvents.length > 0 ? (
      liveEvents.map((event, index) => (
        <Paper
          key={index}
          elevation={3}
          sx={{
            bgcolor: "rgb(255,204,160)",
            p: 2,
            borderRadius: 2,
            mb: 2,
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              bgcolor: "rgb(255,153,65)",
              transform: "scale(1.02)",
            },
          }}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            gap={2}
          >
            <Avatar
              src={`/logo/event.png`}
              sx={{
                width: 40,
                height: 40,
                transition: "all 0.3s",
                "&:hover": { transform: "scale(1.1)" },
              }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
              >
                {event.council}
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, fontFamily: 'Poppins, sans-serif' }}
              >
                {event.title}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            mt={1}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
          >
            {event.description}
          </Typography>
        </Paper>
      )) ) : (
        <Typography variant="body2" color="text.secondary" mt={1}>
          No live events at the moment.
        </Typography>
      )}
    </Box>
  );
};

export default RightNavbar;
