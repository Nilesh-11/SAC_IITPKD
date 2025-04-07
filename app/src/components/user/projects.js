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
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { motion } from "framer-motion"; // Import animation library

const ProjectList = ({ projects }) => {
  const [filterType, setFilterType] = useState("All");

  // Sorting projects based on dateCreated (latest first)
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
  );

  // Filtering based on type
  const filteredProjects =
    filterType === "All"
      ? sortedProjects
      : sortedProjects.filter((proj) => proj.type === filterType);

  return (
    <Box sx={{ padding: 3, textAlign: "center" }}>
      {/* Projects Title */}
      <Typography
        variant="h4"
        fontWeight="bold"
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgb(245,164,94)",
          padding: 2,
          borderRadius: "20px",
          marginTop: 2,
        }}
      >
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: 150,
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            "&:hover": { transform: "scale(1.05)", transition: "0.3s ease" },
          }}
        >
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            displayEmpty
            sx={{
              borderRadius: "10px",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <MenuItem value="All">
              <strong>All Projects</strong>
            </MenuItem>
            {[...new Set(projects.map((p) => p.type))].map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
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

      {/* Project List */}
      <Box sx={{ marginTop: 5 }}>
        {filteredProjects.map((project, index) => (
          <Card
            key={index}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03, boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" }}
            sx={{
              backgroundColor: "rgb(245,164,94)",
              borderRadius: "10px",
              marginBottom: 2,
              padding: 2,
              transition: "0.3s ease",
            }}
          >
            <CardContent>
              {/* Project Header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={project.logo} alt="Club Logo" sx={{ width: 40, height: 40, marginRight: 1 }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {project.clubname}
                    </Typography>
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

              {/* Project Details */}
              <Typography variant="h6" fontWeight="bold" mt={2}>
                {project.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {project.description}
              </Typography>

              {/* Footer (Skills & Join Button) */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
                {/* Skills on Bottom Left */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {project.skills.map((skill, i) => (
                    <Typography
                      key={i}
                      sx={{
                        backgroundColor: "white",
                        padding: "5px 10px",
                        fontSize: "12px",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        transition: "0.3s ease",
                        "&:hover": { transform: "scale(1.1)", backgroundColor: "#fff2e0" },
                      }}
                    >
                      {skill}
                    </Typography>
                  ))}
                </Box>

                {/* Join Button on Bottom Right */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2">
                    Members: {project.currentMembers}/{project.maxmembers}
                  </Typography>
                  {project.status === "Ongoing" ? (
                    <Button
                      variant="contained"
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      sx={{
                        backgroundColor: "white",
                        color: "rgb(245,164,94)",
                        fontWeight: "bold",
                        textTransform: "none",
                        mt: 1,
                        "&:hover": { backgroundColor: "#fff2e0" },
                      }}
                    >
                      +JOIN
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "gray",
                        color: "white",
                        textTransform: "none",
                        mt: 1,
                      }}
                    >
                      SEE
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ProjectList;
