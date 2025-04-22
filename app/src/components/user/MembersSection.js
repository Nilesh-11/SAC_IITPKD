import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Alert,
  Grid,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Fade,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { MembersListApi } from "../../api/club";

const MembersSection = () => {
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOption, setSortOption] = useState("joined");

  const orange = "rgb(243,130,33)";
  const darkOrange = "rgb(220,110,25)";

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await MembersListApi();
        if (res?.type === "ok") {
          setMembers(res.members || []);
        } else {
          setError(res?.details || "Failed to load members");
        }
      } catch (err) {
        setError("Something went wrong while fetching members.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    let filteredList = [...members];
    if (roleFilter !== "all") {
      filteredList = filteredList.filter(
        (m) => m.role?.title.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    switch (sortOption) {
      case "name":
        filteredList.sort((a, b) =>
          (a.student?.name || "").localeCompare(b.student?.name || "")
        );
        break;
      case "joined":
        filteredList.sort(
          (a, b) => new Date(a.joined_date) - new Date(b.joined_date)
        );
        break;
      case "role":
        filteredList.sort((a, b) =>
          (b.role?.privilege || 0) - (a.role?.privilege || 0)
        );
        break;
    }

    setFiltered(filteredList);
  }, [members, roleFilter, sortOption]);

  const uniqueRoles = [
    ...new Set(members.map((m) => m.role?.title).filter(Boolean)),
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.2)), url('/bg1.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 1000,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          backgroundColor: "white",
          boxShadow: 6,
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: 600,
            mb: 3,
            fontFamily: "Poppins, sans-serif",
            color: orange,
          }}
        >
          Club Members
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Filter by Role"
              >
                <MenuItem value="all">All Roles</MenuItem>
                {uniqueRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                label="Sort by"
              >
                <MenuItem value="joined">Join Date</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="role">Role Privilege</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filtered.length === 0 ? (
          <Fade in>
            <Alert severity="info">No members match your criteria.</Alert>
          </Fade>
        ) : (
          <Grid container spacing={2}>
            {filtered.map((member, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Fade in timeout={400}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "#fafafa",
                      borderLeft: `4px solid ${
                        member.role?.is_active ? orange : "#ccc"
                      }`,
                      transition: "0.2s",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      {member.student?.name || "Unknown Member"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {member.student?.email}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Batch: {member.student?.batch} | Dept:{" "}
                      {member.student?.department}
                    </Typography>
                    {member.role && (
                      <Box
                        sx={{
                          mt: 1,
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          icon={<PersonIcon />}
                          label={`${member.role.title}`}
                          sx={{
                            backgroundColor: member.role.is_active
                              ? orange
                              : "#e0e0e0",
                            color: member.role.is_active ? "white" : "black",
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                    )}
                    <Typography
                      variant="caption"
                      sx={{ mt: 1, display: "block", color: "#555" }}
                    >
                      Joined on:{" "}
                      {new Date(member.joined_date).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default MembersSection;
