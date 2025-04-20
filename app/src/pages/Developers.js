import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Link,
  IconButton,
} from "@mui/material";
import { GitHub, LinkedIn } from "@mui/icons-material";
import Header from "../components/common/header";

const developers = [
  {
    name: "Jane Doe",
    role: "Frontend Developer",
    image: "/developers/nilesh.jpg",
    github: "https://github.com/janedoe",
    linkedin: "https://linkedin.com/in/janedoe",
  },
  {
    name: "John Smith",
    role: "Backend Developer",
    image: "/developers/nilesh.jpg",
    github: "https://github.com/johnsmith",
    linkedin: "https://linkedin.com/in/johnsmith",
  },
  {
    name: "John Smith",
    role: "Backend Developer",
    image: "/developers/nilesh.jpg",
    github: "https://github.com/johnsmith",
    linkedin: "https://linkedin.com/in/johnsmith",
  },
];

const Developers = () => {
  return (
    <Box>
        <Header></Header>
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant="h4"
        align="center"
        fontWeight={600}
        gutterBottom
        sx={{ fontFamily: "Poppins, sans-serif" }}
      >
        Meet the Developers
      </Typography>

      <Typography
        variant="body1"
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        The amazing team that built and maintains this platform.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {developers.map((dev, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={3}
              sx={{
                borderRadius: 4,
                height: "100%",
                textAlign: "center",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <CardMedia
                component="img"
                image={dev.image}
                alt={dev.name}
                sx={{
                  width: "100%",
                  height: 280,
                  objectFit: "cover",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {dev.name}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {dev.role}
                </Typography>
                <Box>
                  {dev.github && (
                    <IconButton
                      component={Link}
                      href={dev.github}
                      target="_blank"
                      rel="noopener"
                      aria-label="GitHub"
                    >
                      <GitHub />
                    </IconButton>
                  )}
                  {dev.linkedin && (
                    <IconButton
                      component={Link}
                      href={dev.linkedin}
                      target="_blank"
                      rel="noopener"
                      aria-label="LinkedIn"
                    >
                      <LinkedIn />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    </Box>

  );
};

export default Developers;
