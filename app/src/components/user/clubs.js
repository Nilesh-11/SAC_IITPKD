import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { motion } from "framer-motion"; // Importing animation library

const Clubs = ({ my_clubs, other_clubs, handleNavigation }) => {
  return (
    <Box sx={{ px: 3, py: 2, fontFamily: "Poppins, sans-serif" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h5" fontWeight={700} textAlign="left" color="black" sx={{
          fontFamily: "Poppins, sans-serif",
          color: "rgba(255, 154, 65, 0.96)",
        }}>
          CLUBS
        </Typography>
      </motion.div>

      {/* My Clubs Section */}
      <Box mt={3}>
        <Typography sx={{ fontFamily: "Poppins, sans-serif" }} variant="h6" fontWeight={600} textAlign="left">
          My Clubs
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
            gridTemplateColumns: "repeat(3, 1fr)", // Max 3 per row
            gap: 2,
            "@media (max-width: 960px)": {
              gridTemplateColumns: "repeat(2, 1fr)", // 2 per row for tablets
            },
            "@media (max-width: 600px)": {
              gridTemplateColumns: "repeat(1, 1fr)", // 1 per row on small screens
            },
          }}
        >
          {my_clubs.map((club, index) => (
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
                    backgroundColor: "rgb(255,204,160)", // Light Peach
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    transition: "0.3s ease-in-out",
                    cursor: "pointer",
                    mx: "auto",
                    "&:hover": {
                      backgroundColor: "rgb(255,153,65)", // Orange on Hover
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

      {/* Other Clubs Section */}
      <Box mt={4}>
        <Typography sx={{ fontFamily: "Poppins, sans-serif" }} variant="h6" fontWeight={600} textAlign="left">
          Other Clubs
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
            gridTemplateColumns: "repeat(3, 1fr)", // Max 3 per row
            gap: 2,
            "@media (max-width: 960px)": {
              gridTemplateColumns: "repeat(2, 1fr)", // 2 per row for tablets
            },
            "@media (max-width: 600px)": {
              gridTemplateColumns: "repeat(1, 1fr)", // 1 per row on small screens
            },
          }}
        >
          {other_clubs.map((club, index) => (
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
                    backgroundColor: "rgb(255,204,160)", // Light Peach
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    transition: "0.3s ease-in-out",
                    cursor: "pointer",
                    mx: "auto",
                    "&:hover": {
                      backgroundColor: "rgb(255,153,65)", // Orange on Hover
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
    </Box>
  );
};

export default Clubs;
