import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
  Avatar,
  FormControl,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { motion } from "framer-motion";

const ProjectList = ({ projects }) => {
  const [filterType, setFilterType] = useState("All");

  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
  );

  const filteredProjects =
    filterType === "All"
      ? sortedProjects
      : sortedProjects.filter((proj) => proj.type === filterType);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ padding: 3, px: { xs: 2, sm: 5, md: 10 }, py: 3 }}>
      {/* Title */}
      <Typography
        variant="h4"
        fontWeight="bold"
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          fontFamily: "Poppins, sans-serif",
          color: "rgba(255, 154, 65, 0.96)",
          mb: 2,
          textAlign: isSmallScreen ? "center" : "left",
        }}
      >
        PROJECTS
      </Typography>

      {/* Filter Bar */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isSmallScreen ? "stretch" : "center",
          backgroundColor: "rgb(245,164,94)",
          padding: 2,
          borderRadius: "20px",
          gap: 2,
        }}
      >
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            backgroundColor: "white",
            borderRadius: "10px",
            minWidth: isSmallScreen ? "100%" : 150,
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            displayEmpty
            sx={{ borderRadius: "10px", "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
          >
            <MenuItem value="All"><strong>All Projects</strong></MenuItem>
            {[...new Set(projects.map((p) => p.type))].map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          component={motion.div}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            backgroundColor: "white",
            color: "rgb(245,164,94)",
            fontWeight: "bold",
            borderRadius: "20px",
            textTransform: "none",
            "&:hover": { backgroundColor: "#fff2e0" },
          }}
          startIcon={<Add />}
        >
          New Project
        </Button>
      </Box>

      {/* Project Grid */}
      <Grid container spacing={3} mt={3}>
        {filteredProjects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.015 }}
              sx={{
                backgroundColor: "rgb(255, 189, 131)",
                borderRadius: "10px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={project.logo} sx={{ width: 40, height: 40, mr: 1 }} />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">{project.clubname}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(project.dateCreated).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      padding: "5px 10px",
                      fontSize: "12px",
                      color: "white",
                      borderRadius: "5px",
                      backgroundColor: project.status === "Ongoing" ? "green" : "gray",
                    }}
                  >
                    {project.status}
                  </Typography>
                </Box>

                {/* Title and Description */}
                <Typography variant="h6" fontWeight="bold" mt={2}>
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>

                {/* Skills and Button */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, flexWrap: "wrap", gap: 1 }}>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {project.skills.map((skill, i) => (
                      <Typography
                        key={i}
                        sx={{
                          backgroundColor: "white",
                          padding: "5px 10px",
                          fontSize: "12px",
                          borderRadius: "5px",
                          fontWeight: "bold",
                          "&:hover": { transform: "scale(1.1)", backgroundColor: "#fff2e0" },
                        }}
                      >
                        {skill}
                      </Typography>
                    ))}
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2">
                      Members: {project.currentMembers}/{project.maxmembers}
                    </Typography>
                    <Button
                      variant="contained"
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      sx={{
                        mt: 1,
                        backgroundColor: project.status === "Ongoing" ? "white" : "gray",
                        color: project.status === "Ongoing" ? "rgb(245,164,94)" : "white",
                        fontWeight: "bold",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: project.status === "Ongoing" ? "#fff2e0" : "gray",
                        },
                      }}
                    >
                      {project.status === "Ongoing" ? "+JOIN" : "SEE"}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectList;
