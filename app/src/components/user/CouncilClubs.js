import React, { useCallback, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from "framer-motion";
import { ClubsListApi } from "../../api/public";
import { useNavigate } from "react-router-dom";

const CouncilClubs = () => {
  const navigate = useNavigate();
  const [councilMap, setCouncilMap] = useState({});
  const [loading, setLoading] = useState(true);
  
  const handleNavigation = useCallback((link) => {
      navigate(link);
    }, [navigate]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await ClubsListApi();
        if (response?.type === "ok") {
          const grouped = {};
          response.clubs.forEach(club => {
            const council = club.council_name || "Independent";
            if (!grouped[council]) grouped[council] = [];
            grouped[council].push({
              id: club.id,
              title: club.title,
              image: `/clubs/${club.name}/opaque_logo_square.png`,
              link: `/club/info?club_id=${club.id}`,
            });
          });
          setCouncilMap(grouped);
        }
      } catch (err) {
        console.error("Failed to load clubs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
        <Typography mt={2}>Loading Clubs...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 3, py: 2, fontFamily: "Poppins, sans-serif" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="left"
          sx={{ color: "rgba(255, 154, 65, 0.96)" }}
        >
          CLUBS BY COUNCIL
        </Typography>
      </motion.div>

      {Object.entries(councilMap).map(([councilName, clubs]) => (
        <Box key={councilName} mt={4}>
          <Typography variant="h6" fontWeight={600}>
            {councilName}
          </Typography>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "26%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Box
              sx={{
                backgroundColor: "rgb(243, 130, 33)",
                height: "6px",
                borderRadius: "10px",
                mb: 2,
              }}
            />
          </motion.div>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              "@media (max-width: 960px)": {
                gridTemplateColumns: "repeat(2, 1fr)",
              },
              "@media (max-width: 600px)": {
                gridTemplateColumns: "repeat(1, 1fr)",
              },
            }}
          >
            {clubs.map((club, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Box textAlign="center">
                  <Card
                    sx={{
                      width: "90%",
                      height: 200,
                      backgroundColor: "rgb(255,204,160)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                      cursor: "pointer",
                      mx: "auto",
                      "&:hover": {
                        backgroundColor: "rgb(255,153,65)",
                        boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                    onClick={() => handleNavigation(club.link)}
                  >
                    <Box
                      component="img"
                      src={club.image}
                      alt={club.title}
                      sx={{
                        width: "80%",
                        height: "80%",
                        objectFit: "contain",
                        padding: "10px",
                      }}
                    />
                  </Card>
                  <Typography
                    fontWeight={600}
                    fontSize={16}
                    mt={1}
                    component={motion.div}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.3 }}
                  >
                    {club.title}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CouncilClubs;
