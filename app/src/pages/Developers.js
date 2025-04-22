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

const developers = {
  coordinator: [
    {
      name: "Nilesh Jamre",
      role: "Frontend + Backend developer",
      image: "/developers/nilesh.jpg",
      github: "https://github.com/Nilesh-11",
      linkedin: "https://linkedin.com/in/nileshjamre",
    },
  ],
  leads: [
    {
      name: "Hemant Pathak",
      role: "Frontend Lead",
      image: "/developers/hemantpathak.jpg",
      github: "https://github.com/hemant030406",
      linkedin: "https://www.linkedin.com/in/hemant030406/",
    },
    {
      name: "Kaushik Rawat",
      role: "Backend Lead",
      image: "/developers/kaushikrawat.jpg",
      github: "https://github.com/enchanteddev",
      linkedin: "https://www.linkedin.com/in/kaushik-rawat/",
    },
  ],
  developers: [
    {
      name: "Devapriya Pradeep",
      role: "Frontend Developer",
      image: "/developers/girl.jpg",
      github: "https://github.com/aadi-sun",
      linkedin: "https://www.linkedin.com/in/devapriya-pradeep-36a643331/",
    },
    {
      name: "Vishesh Srivastava",
      role: "Frontend Developer",
      image: "/developers/vishesh.jpg",
      github: "https://github.com/Iambeastofhell",
      linkedin: "https://www.linkedin.com/in/vishesh-srivastava-85a799301/",
    },
    {
      name: "Zeeshan Mohammed Rangrej",
      role: "Frontend Developer",
      image: "/developers/zeeshan.jpg",
      github: "https://github.com/Zeeshan1903",
      linkedin: "https://www.linkedin.com/in/zeeshan-mohammed-rangrej-946ab927b/",
    },
    {
      name: "Abhishek Iyer",
      role: "Frontend Developer",
      image: "/developers/abhishek.jpg",
      github: "https://github.com/Abhi-Iyer10",
      linkedin: "https://www.linkedin.com/in/abhishek-iyer-9394a0321/",
    },
    {
      name: "Shubham Yadav",
      role: "Frontend Developer",
      image: "/developers/boy.jpg",
      github: "https://github.com/Shubham04567",
      linkedin: "https://www.linkedin.com/in/abhishek-iyer-9394a0321/",
    },
  ],
};

const renderSection = (title, devList) => (
  <>
    <Typography
      variant="h5"
      fontWeight={600}
      sx={{ mt: 6, mb: 3, fontFamily: "Poppins, sans-serif" }}
      align="center"
    >
      {title}
    </Typography>
    <Grid container spacing={4} justifyContent="center">
      {devList.map((dev, index) => (
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
              <Typography variant="h6" fontWeight={600} sx={{fontFamily: "Poppins, sans-serif"}}>
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
  </>
);

const Developers = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/bg1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header />
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

        {renderSection("Coordinator", developers.coordinator)}
        {renderSection("Team Leads", developers.leads)}
        {renderSection("Developers", developers.developers)}
      </Container>
    </Box>
  );
};

export default Developers;
