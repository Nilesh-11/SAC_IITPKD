import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { keyframes } from "@mui/system";
import CircularProgress from '@mui/material/CircularProgress';
import { FaBell } from "react-icons/fa";
import { getAnnouncementsList } from "../../api/announcement";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnnouncementsDash = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [annData] = await Promise.all([getAnnouncementsList()]);
        setAnnouncements(annData);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <h2>Loading Announcements...</h2>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", textAlign: "center", p: 2 }}>
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{
            mb: 4,
            fontFamily: "Poppins, sans-serif",
            color: "rgba(255, 154, 65, 0.96)",
          }} // Increased space below heading
        >
          ANNOUNCEMENTS
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // Max 2 per row
          gap: 2,
          "@media (max-width: 600px)": {
            gridTemplateColumns: "repeat(1, 1fr)", // 1 per row on small screens
          },
        }}
      >
        {announcements.map((announcement, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: "rgb(246,165,95)", // Orange background
              borderRadius: 2,
              boxShadow: 2,
              display: "flex",
              flexDirection: "column", // Ensures text stacks properly
              p: 2,
              transition: "transform 0.3s, box-shadow 0.3s",
              animation: `${fadeIn} 0.4s ease-out ${index * 0.1}s`, // Staggered fade-in effect
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 4,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ textAlign: "left" }}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {announcement.author}
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {announcement.title}
                </Typography>
              </Box>
              <FaBell size={18} color="#000" />
            </Box>

            <Box
              sx={{
                width: "80%",
                mx: "auto",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                image={`/roles/${announcement.author_role}_circular.webp`}
                alt={announcement.title}
                sx={{
                  width: "100%", // Make it responsive
                  height: "auto", // Maintain aspect ratio
                  objectFit: "contain", // Prevents cropping
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)", // Slight zoom on hover
                  },
                }}
              />
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {announcement.body}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default AnnouncementsDash;
