import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { motion } from "framer-motion";
import { formatToIST } from "./../../utils/parser";
import { getProjectsList } from "../../api/projects";

const ProjectList = ( {handleAddProject} ) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All"); // ✅ NEW
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjectsList();
        setProjects(res);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
  );

  const filteredProjects = sortedProjects.filter((proj) => {
    const typeMatch = filterType === "All" || proj.proj_type === filterType;
    const roleMatch =
      filterRole === "All" || proj.coordinator_role === filterRole;
    const statusMatch = filterStatus === "All" || proj.status === filterStatus;
    return typeMatch && roleMatch && statusMatch;
  });

  if (loading) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <CircularProgress sx={{ color: "rgb(245,164,94)" }} />
        <Typography mt={2} color="text.secondary">
          Loading projects...
        </Typography>
      </Box>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          No projects available right now.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, px: { xs: 2, sm: 5, md: 10 }, py: 3 }}>
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
          flexWrap: "wrap",
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
            sx={{
              borderRadius: "10px",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <MenuItem value="All">
              <strong>All Projects</strong>
            </MenuItem>
            {[...new Set(projects.map((p) => p.proj_type))].map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            displayEmpty
            sx={{
              borderRadius: "10px",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <MenuItem value="All">
              <strong>All Roles</strong>
            </MenuItem>
            {[...new Set(projects.map((p) => p.coordinator_role))].map(
              (role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            displayEmpty
            sx={{
              borderRadius: "10px",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <MenuItem value="All">
              <strong>All Statuses</strong>
            </MenuItem>
            {[...new Set(projects.map((p) => p.status))].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          component={motion.div}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddProject}
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
      <Grid container spacing={3} mt={3} sx={{flexDirection: "column"}}>
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={`/roles/${project.coordinator_role}_circular.png`}
                      sx={{ width: 40, height: 40, mr: 1 }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {project.coordinator}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatToIST(project.start_date)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      padding: "5px 10px",
                      fontSize: "12px",
                      color: "white",
                      borderRadius: "5px",
                      backgroundColor:
                        project.status === "Ongoing" ? "green" : "gray",
                    }}
                  >
                    {project.status}
                  </Typography>
                </Box>

                <Typography variant="h6" fontWeight="bold" mt={2}>
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 3,
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
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
                          "&:hover": {
                            transform: "scale(1.1)",
                            backgroundColor: "#fff2e0",
                          },
                        }}
                      >
                        {skill}
                      </Typography>
                    ))}
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2">
                      Members: {project.current_members_count}/
                      {project.max_members_count}
                    </Typography>
                    <Button
                      variant="contained"
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      sx={{
                        mt: 1,
                        backgroundColor:
                          project.status === "Ongoing" ? "white" : "gray",
                        color:
                          project.status === "Ongoing"
                            ? "rgb(245,164,94)"
                            : "white",
                        fontWeight: "bold",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor:
                            project.status === "Ongoing" ? "#fff2e0" : "gray",
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
