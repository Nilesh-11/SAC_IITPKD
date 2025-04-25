import React from "react";
import { motion } from "framer-motion";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { FaInfoCircle, FaUser, FaUsers, FaRegEnvelope, FaEnvelope } from "react-icons/fa";

const LeadershipSection = ({ council, councilTitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!council || !council.secretary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Grid container spacing={2}>
          {/* Avatar Column */}
          <Grid item xs={12} sm={4} md={3}>
            <Box
              display="flex"
              justifyContent={{ xs: "center", sm: "flex-start" }}
            >
              <Avatar
                alt={council.secretary.full_name}
                src={`/student/${council.secretary.email}/photo.webp`}
                sx={{
                  width: { xs: 96, sm: 128 },
                  height: { xs: 96, sm: 128 },
                  boxShadow: 2,
                }}
              />
            </Box>
          </Grid>

          {/* Info Column */}
          <Grid item xs={12} sm={8} md={9}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontSize: { xs: "1.3rem", sm: "1.5rem" },
                  mb: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <FaInfoCircle fontSize={isMobile ? "small" : "medium"} />
                {councilTitle}
              </Typography>

              <Box
                sx={{
                  "& > *:not(:last-child)": { mb: 1 },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  width: "100%",
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <FaUser fontSize={isMobile ? "small" : "medium"} />
                  <strong>Secretary:</strong>
                  <span>{council.secretary.full_name}</span>
                </Box>

                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <FaEnvelope fontSize={isMobile ? "small" : "medium"} />
                  <strong>Email:</strong>
                  <span style={{ wordBreak: "break-all" }}>
                    {council.secretary.email}
                  </span>
                </Box>

                {council.deputies?.length > 0 && (
                  <Box mt={1.5}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <FaUsers fontSize={isMobile ? "small" : "medium"} />
                      Deputy Secretaries
                    </Typography>
                    {council.deputies.map((deputy, index) => (
                      <Box
                        key={index}
                        sx={{
                          pl: 2,
                          mb: 1,
                          "& > *": {
                            fontSize: { xs: "0.875rem", sm: "0.95rem" },
                          },
                        }}
                      >
                        <div>
                          <strong>{deputy.full_name}</strong>
                        </div>
                        <div style={{ wordBreak: "break-all" }}>
                          {deputy.email}
                        </div>
                      </Box>
                    ))}
                  </Box>
                )}

                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  flexWrap="wrap"
                  mt={1.5}
                >
                  <FaRegEnvelope fontSize={isMobile ? "small" : "medium"} />
                  <strong>Council Email:</strong>
                  <span style={{ wordBreak: "break-all" }}>
                    {council.council_email}
                  </span>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
};

export default LeadershipSection;