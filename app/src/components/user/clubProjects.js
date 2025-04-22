import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { formatToIST } from "../../utils/parser";

const ClubProjects = ({ projects }) => {
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
  );
  console.log(projects);

  if (!projects || projects.length == 0){
    return <Typography>No Projects found</Typography>
  }

  return (
    <Box
      sx={{
        mt: 2,
        maxHeight: "75vh",
        overflowY: "auto",
        px: { xs: 1, sm: 2 },
      }}
    >
      <Grid container spacing={2} sx={{flexDirection:"column"}}>
        {sortedProjects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              sx={{
                backgroundColor: "rgb(255, 189, 131)",
                borderRadius: "10px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent sx={{ p: 2 }}>
                {/* Title and Status */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    fontSize="1rem"
                  >
                    {project.title}
                  </Typography>
                  <Typography
                    sx={{
                      padding: "3px 8px",
                      fontSize: "11px",
                      color: "white",
                      borderRadius: "4px",
                      backgroundColor:
                        project.status === "Ongoing" ? "green" : "gray",
                    }}
                  >
                    {project.status}
                  </Typography>
                </Box>

                {/* Start Date */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {formatToIST(project.start_date)}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={1}
                  sx={{ fontSize: "0.85rem" }}
                >
                  {project.description}
                </Typography>

                {/* Skills and Join Button */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {project.skills.map((skill, i) => (
                      <Typography
                        key={i}
                        sx={{
                          backgroundColor: "white",
                          padding: "3px 8px",
                          fontSize: "11px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                        }}
                      >
                        {skill}
                      </Typography>
                    ))}
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" fontSize="0.8rem">
                      {project.current_members_count}/{project.max_members_count}
                    </Typography>
                    <Button
                      variant="contained"
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      sx={{
                        mt: 0.5,
                        backgroundColor:
                          project.status === "Ongoing" ? "white" : "gray",
                        color:
                          project.status === "Ongoing"
                            ? "rgb(245,164,94)"
                            : "white",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        textTransform: "none",
                        padding: "4px 10px",
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

export default ClubProjects;
