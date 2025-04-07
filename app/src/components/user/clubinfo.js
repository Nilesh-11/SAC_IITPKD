import React from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  Divider,
} from "@mui/material";

const ClubInfo = ({ club, details, image, club_heads, club_leads, mail, contact_number, discussions }) => {
  return (
    <Box sx={{ p: 3, backgroundColor: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
      {/* Club Title */}
      <Typography variant="h4" fontWeight="bold" mb={2}>
        {club}
      </Typography>

      {/* Club Header Section */}
      <Stack direction="row" spacing={4} alignItems="flex-start">
        {/* Club Image */}
        <Box
          component="img"
          src={image}
          alt={`${club} logo`}
          sx={{ width: 240, height: 240, borderRadius: 2 }}
        />

        {/* Club Description */}
        <Box flex={1}>
          <Typography variant="body1" sx={{ fontSize: 15, lineHeight: 1.5, textAlign: "justify", color: "#333" }}>
            {details}
          </Typography>
        </Box>

        {/* Club Info Cards */}
        <Stack spacing={2}>
          {/* Club Heads & Leads - Orange Box */}
          <Card sx={{ backgroundColor: "rgb(245,164,94)", color: "black", p: 2, borderRadius: 2, width: 250 }}>
            <Typography variant="h6">
              ● <strong>Club Head(s)</strong>
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 15, lineHeight: 1.5, textAlign: "justify" }}>
              {club_heads.join(", ")}
            </Typography>
            <Divider sx={{ my: 1, backgroundColor: "black" }} />
            <Typography variant="h6">
              ● <strong>Club Lead(s)</strong>
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 15, lineHeight: 1.5, textAlign: "justify" }}>
              {club_leads.join(", ")}
            </Typography>
          </Card>

          {/* Contact Info - Grey Box */}
          <Card sx={{ backgroundColor: "#5d5d5d", color: "white", p: 2, borderRadius: 2, width: 250 }}>
            <Typography variant="h6">
              ● <strong>Club Mail ID</strong>
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 15, lineHeight: 1.5, textAlign: "justify" }}>
              {mail}
            </Typography>
            <Divider sx={{ my: 1, backgroundColor: "white" }} />
            <Typography variant="h6">
              ● <strong>Head Contact Number</strong>
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 15, lineHeight: 1.5, textAlign: "justify" }}>
              {contact_number}
            </Typography>
          </Card>
        </Stack>
      </Stack>

      {/* Forum Discussions Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3}>
        <Typography variant="h5">Forum Discussions</Typography>
        <Button sx={{ backgroundColor: "rgb(243,130,33)", color: "white", borderRadius: 2, "&:hover": { backgroundColor: "rgb(220,100,30)" } }}>
          View All
        </Button>
      </Stack>

      {/* Forum Discussions List */}
      <Box mt={2}>
        {discussions.map((discussion, index) => (
          <Card key={index} sx={{ display: "flex", alignItems: "center", p: 2, mb: 2, borderRadius: 2 }}>
            <Box component="img" src={discussion.logo} alt="Discussion logo" sx={{ width: 40, height: 40, mr: 2 }} />
            <Box flex={1}>
              <Typography variant="h6">{discussion.title}</Typography>
              <Typography variant="body2">by {discussion.student}</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "gray", fontSize: 12 }}>
              {discussion.date}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
        <Button sx={{ backgroundColor: "gray", color: "white", borderRadius: 2, px: 3, "&:hover": { backgroundColor: "#505050" } }}>
          Back
        </Button>
        <Button sx={{ backgroundColor: "orange", color: "white", borderRadius: 2, px: 3, "&:hover": { backgroundColor: "darkorange" } }}>
          Request to Join
        </Button>
      </Stack>
    </Box>
  );
};

export default ClubInfo;
