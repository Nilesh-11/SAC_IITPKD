import React from "react";
import { Box, Typography, Card, CardContent, Grid, Chip } from "@mui/material";

const ProjectInfo = ({ title, club, projectIncharge, contact, members, skills, description, image, status }) => {
  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3, fontFamily: "Arial, sans-serif" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        PROJECTS
      </Typography>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>

      {/* Image, Project Details, and Members - Full Width Row */}
      <Grid container spacing={2} sx={{ width: "100%", flexWrap: "nowrap" }}>
        {/* Project Image */}
        <Grid item xs={4}>
          <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
            <img
              src={image}
              alt={title}
              style={{
                width: "100%",
                height: "350px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <Chip
              label={status}
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                backgroundColor:
                  status.toLowerCase() === "ongoing"
                    ? "green"
                    : status.toLowerCase() === "completed"
                    ? "blue"
                    : "orange",
                color: "white",
              }}
            />
          </Box>
        </Grid>

        {/* Project Details (Orange Card) */}
        <Grid item xs={4}>
          <Card sx={{ backgroundColor: "#f9a53d", height: "100%", borderRadius: 2, p: 2, width: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">• Club</Typography>
              <Typography>{club}</Typography>

              <Typography variant="h6" fontWeight="bold" mt={2}>• Project Incharge</Typography>
              <Typography>{projectIncharge.join(", ")}</Typography>

              <Typography variant="h6" fontWeight="bold" mt={2}>• Contact</Typography>
              <Typography>{contact.mail} | {contact.phone}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Project Members (Grey Card) */}
        <Grid item xs={4}>
          <Card sx={{ backgroundColor: "#4a4a4a", height: "100%", borderRadius: 2, p: 2, width: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="white">
                Members:
              </Typography>
              {members.map((member, index) => (
                <Typography key={index} color="white">
                  {member}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Project Description & Skills in Same Row */}
      <Grid container spacing={2} mt={3} sx={{ width: "100%", flexWrap: "nowrap", alignItems: "column" }}>
        {/* Project Description */}
        <Grid item xs={8}>
          <Card sx={{ borderRadius: 2, p: 3, width: "50%", minHeight: "250px", display: "flex", flexDirection: "column" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Project Description
              </Typography>
              <Typography sx={{ flexGrow: 1 }}>{description}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Skills Required (Next to Description) */}
        <Grid item xs={8}>
          <Card sx={{ backgroundColor: "rgb(248,191,143)", borderRadius: 2, p: 3, width: "100%", minHeight: "250px", display: "flex", flexDirection: "column" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">Skills Required</Typography>
              <Box component="ul" sx={{ listStyle: "none", padding: 0, margin: 0 }}>
                {skills.map((skill, index) => (
                  <Box key={index} component="li" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box component="span" sx={{ fontSize: "14px", mr: 1, color: "black" }}>•</Box>
                    {skill}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectInfo;
