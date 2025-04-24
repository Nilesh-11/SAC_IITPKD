import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Chip,
  InputAdornment,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import { ClubListApi, UpdateClubApi, DeleteClubApi } from "../../api/council";

const UpdateClubForm = ({ userEmail }) => {
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    email: "",
    faculty_advisor: "",
    head: "",
    coheads: [],
    password: "",
  });

  const [coheadInput, setCoheadInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const orange = "rgb(243,130,33)";
  const darkOrange = "rgb(220,110,25)";

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await ClubListApi();
        if (res?.type === "ok") {
          setClubs(res.clubs);
        }
      } catch (err) {
        console.error("Failed to fetch clubs", err);
      }
    };
    fetchClubs();
  }, [userEmail]);

  const handleSelectClub = (e) => {
    const clubId = e.target.value;
    const club = clubs.find((c) => c.id === clubId);
    setSelectedClubId(clubId);
    if (club) {
      setFormData({
        name: club.name || "",
        title: club.title || "",
        description: club.description || "",
        email: club.email || "",
        faculty_advisor: club.faculty_advisor || "",
        head: club.head?.email || "",
        coheads: club.coheads.map((co) => co.email) || [],
        password: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCohead = () => {
    const trimmed = coheadInput.trim();
    if (trimmed && !formData.coheads.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, coheads: [...prev.coheads, trimmed] }));
      setCoheadInput("");
    }
  };

  const removeCohead = (index) => {
    const updated = [...formData.coheads];
    updated.splice(index, 1);
    setFormData({ ...formData, coheads: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validate all required fields
    const requiredFields = [
      "name",
      "title",
      "description",
      "email",
      "faculty_advisor",
      "head",
      "password",
    ];
    for (let field of requiredFields) {
      if (!formData[field]?.trim()) {
        setMessage({
          type: "error",
          text: `Please fill out the ${field.replace("_", " ")}.`,
        });
        return;
      }
    }

    setLoading(true);

    try {
      const res = await UpdateClubApi({ ...formData });
      if (res?.type === "ok") {
        setMessage({ type: "success", text: "Club updated successfully!" });
      } else {
        setMessage({ type: "error", text: res?.details || "Update failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while updating." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClubId) return;
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await DeleteClubApi({ club_id: selectedClubId });
      if (res?.type === "ok") {
        setMessage({ type: "success", text: "Club deleted successfully." });
        setClubs((prev) => prev.filter((c) => c.id !== selectedClubId));
        setSelectedClubId("");
        setFormData({
          name: "",
          title: "",
          description: "",
          email: "",
          faculty_advisor: "",
          head: "",
          coheads: [],
          password: "",
        });
      } else {
        setMessage({
          type: "error",
          text: res?.details || "Deletion failed",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while deleting." });
    } finally {
      setLoading(false);
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fafafa",
      "& fieldset": { borderColor: "#d1d1d1" },
      "&:hover fieldset": { borderColor: "#b0b0b0" },
      "&.Mui-focused fieldset": {
        borderColor: orange,
        boxShadow: `0 0 0 2px rgba(243,130,33,0.2)`,
      },
    },
    "& label": { color: "#666" },
    "& label.Mui-focused": { color: orange },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.2)), url('/bg1.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <Typography variant="h5" align="center" sx={{ color: orange, mb: 3 }}>
          Update Club
        </Typography>

        <TextField
          fullWidth
          select
          label="Select Club"
          value={selectedClubId}
          onChange={handleSelectClub}
          sx={{ mb: 3, ...textFieldSx }}
        >
          {clubs.map((club) => (
            <MenuItem key={club.id} value={club.id}>
              {club.name}
            </MenuItem>
          ))}
        </TextField>

        {selectedClubId && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ flexDirection: "column" }}>
              {[
                { name: "name", label: "Club Name" },
                { name: "title", label: "Club Title" },
                {
                  name: "description",
                  label: "Description",
                  multiline: true,
                  minRows: 4,
                },
                { name: "email", label: "Email" },
                { name: "faculty_advisor", label: "Faculty Advisor" },
                { name: "head", label: "Club Head Email" },
                { name: "password", label: "Password", type: "password" },
              ].map(({ name, label, ...rest }) => (
                <Grid item xs={12} key={name}>
                  <TextField
                    fullWidth
                    name={name}
                    label={label}
                    value={formData[name]}
                    onChange={handleChange}
                    sx={textFieldSx}
                    {...rest}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Add Co-head Email"
                  value={coheadInput}
                  onChange={(e) => setCoheadInput(e.target.value)}
                  sx={textFieldSx}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={handleAddCohead}
                          sx={{
                            backgroundColor: orange,
                            "&:hover": { backgroundColor: darkOrange },
                          }}
                          variant="contained"
                        >
                          <FaUserPlus />
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {formData.coheads.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      onDelete={() => removeCohead(index)}
                      deleteIcon={<FaTimes />}
                    />
                  ))}
                </Box>
              </Grid>
              {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                  {message.text}
                </Alert>
              )}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: orange }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : "Update Club"}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete Club
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default UpdateClubForm;
