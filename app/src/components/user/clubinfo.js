import React from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import timeAgo from "./../../utils/parser";
import ProjectList from "./projects";
import ClubProjects from "./clubProjects";

const ClubInfo = ({ club }) => {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: "#fafafa",
      }}
    >
      {/* Club Title */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontSize: { xs: "1.6rem", sm: "1.8rem", md: "2rem" },
        }}
      >
        {club.title}
      </Typography>

      {/* Club Info Section - Centered */}
      <Box sx={{ px: { xs: 1, sm: 2, md: 4, lg: 6 } }}>
        {/* Logo + Info Cards */}
        <Grid
          container
          spacing={4}
          sx={{
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            justifyContent: "space-between",
          }}
        >
          {/* Logo on Left */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Box
              component="img"
              src={`/clubs/${club.name}/logo.png`}
              alt={`${club.name} logo`}
              sx={{
                width: "100%",
                maxWidth: 260,
                height: "auto",
                borderRadius: 2,
              }}
            />
          </Grid>

          {/* Head/Mail Info Cards on Right */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Club Head/CoHeads Card */}
            <Card
              sx={{
                backgroundColor: "rgb(245,164,94)",
                color: "black",
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                ● Club Head
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {club.head}
              </Typography>
              <Divider sx={{ backgroundColor: "black", my: 1 }} />
              <Typography variant="h6" gutterBottom>
                ● Club CoHead(s)
              </Typography>
              <Typography variant="body2">{club.coheads.join(", ")}</Typography>
            </Card>

            {/* Email Card */}
            <Card
              sx={{
                backgroundColor: "#5d5d5d",
                color: "white",
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                ● Club Mail ID
              </Typography>
              <Typography variant="body2">{club.email}</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Full Width Description Below */}
        <Grid item xs={12} mt={4}>
          <Box
            sx={{
              backgroundColor: "#fff",
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: "1rem",
                lineHeight: 1.6,
                textAlign: "justify",
                color: "#444",
              }}
            >
              {club.description}
            </Typography>
          </Box>
        </Grid>
      </Box>
      <Box sx={{ mt: 2, px: { xs: 2, sm: 5, md: 2 } }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: { xs: "1.4rem", sm: "1.6rem" },
          }}
        >
          Projects
        </Typography>
        <ClubProjects projects={club.projects}></ClubProjects>
      </Box>

      <Box sx={{ mt: 2, px: { xs: 2, sm: 5, md: 2 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={5}
          mb={2}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: { xs: "1.4rem", sm: "1.6rem" },
            }}
          >
            Members
          </Typography>
        </Stack>

        <Box
          sx={{
            maxHeight: 400,
            overflowY: "auto",
            pr: 1,
            mt: 2,
          }}
        >
          <Stack spacing={2}>
            {club.members.map((member, index) => (
              <Card
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <Box
                    component="img"
                    src={`/roles/student_circular.png`}
                    alt="member"
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.email}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "gray",
                    fontSize: 11,
                    minWidth: "70px",
                    textAlign: "right",
                  }}
                >
                  {timeAgo(member.joined_date)}
                </Typography>
              </Card>
            ))}
          </Stack>
        </Box>
      </Box>
      {/* Members Section */}

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "#fafafa",
          zIndex: 10,
          py: 2,
          mt: 5,
          borderTop: "1px solid #ddd",
        }}
      >
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ flexWrap: "wrap" }}
        >
          <Button
            variant="outlined"
            sx={{
              borderColor: "gray",
              color: "gray",
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "rgb(243,130,33)",
              color: "white",
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgb(220,100,30)",
              },
            }}
          >
            Join as Member
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "rgb(243,130,33)",
              color: "white",
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgb(220,100,30)",
              },
            }}
          >
            Core Team
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ClubInfo;
