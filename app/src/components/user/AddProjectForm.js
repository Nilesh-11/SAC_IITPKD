import React, { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { AddProjectApi } from "../../api/projects";

const AddProjectForm = () => {
  const [formData, setFormData] = useState({
    proj_type: "",
    member_roles: [],
    proj_domain: "",
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    skills: [],
    max_members_count: 1,
  });

  const [roleInput, setRoleInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const orange = "rgb(243,130,33)";
  const darkOrange = "rgb(220,110,25)";

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fafafa",
      "& fieldset": {
        borderColor: "#d1d1d1",
      },
      "&:hover fieldset": {
        borderColor: "#b0b0b0",
      },
      "&.Mui-focused fieldset": {
        borderColor: orange,
        boxShadow: `0 0 0 2px rgba(243,130,33,0.2)`,
      },
      "& input": {
        fontFamily: "Roboto, sans-serif",
        padding: "10px",
      },
    },
    "& label": {
      color: "#666",
      fontFamily: "Roboto, sans-serif",
    },
    "& label.Mui-focused": {
      color: orange,
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "max_members_count" ? parseInt(value) : value,
    }));
  };

  const handleAddItem = (input, setInput, key) => {
    if (input.trim() !== "") {
      const trimmed = input.trim();
      if (!formData[key].includes(trimmed)) {
        setFormData((prev) => ({
          ...prev,
          [key]: [...prev[key], trimmed],
        }));
      }
      setInput("");
    }
  };

  const removeItem = (index, key) => {
    const updated = [...formData[key]];
    updated.splice(index, 1);
    setFormData({ ...formData, [key]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const requiredFields = [
      "proj_type",
      "proj_domain",
      "title",
      "description",
      "start_date",
      "end_date",
      "max_members_count",
    ];
    const missing = requiredFields.find((field) => !formData[field]);

    if (missing) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await AddProjectApi(formData);
      if (res?.type === "ok") {
        setSuccess("Project successfully added!");
        setFormData({
          proj_type: "",
          member_roles: [],
          proj_domain: "",
          title: "",
          description: "",
          start_date: "",
          end_date: "",
          skills: [],
          max_members_count: 1,
        });
      } else {
        setError(res?.details || "Error adding project.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.2)), url('/bg1.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 650,
          p: 4,
          borderRadius: 4,
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 600, mb: 3, color: orange }}
        >
          Add New Project
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} sx={{ flexDirection: "column" }}>
            {[
              { name: "proj_type", label: "Project Type" },
              { name: "proj_domain", label: "Project Domain" },
              { name: "title", label: "Project Title" },
              { name: "description", label: "Description", multiline: true, minRows: 4 },
              { name: "start_date", label: "Start Date", type: "date" },
              { name: "end_date", label: "End Date", type: "date" },
              { name: "max_members_count", label: "Max Members", type: "number" },
            ].map(({ name, label, ...rest }) => (
              <Grid item xs={12} key={name}>
                <TextField
                  fullWidth
                  name={name}
                  label={label}
                  value={formData[name]}
                  onChange={handleChange}
                  sx={textFieldSx}
                  InputLabelProps={(name === "start_date" || name === "end_date") ? { shrink: true } : {}}
                  {...rest}
                />
              </Grid>
            ))}

            {/* Member Roles Input */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Member Role"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                sx={textFieldSx}
                placeholder="e.g. Developer"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => handleAddItem(roleInput, setRoleInput, "member_roles")}
                        sx={{
                          minWidth: 40,
                          height: 40,
                          backgroundColor: orange,
                          "&:hover": { backgroundColor: darkOrange },
                        }}
                        variant="contained"
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {formData.member_roles.map((role, idx) => (
                  <Chip
                    key={idx}
                    label={role}
                    onDelete={() => removeItem(idx, "member_roles")}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Box>
            </Grid>

            {/* Skills Input */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Required Skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                sx={textFieldSx}
                placeholder="e.g. React, Python"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => handleAddItem(skillInput, setSkillInput, "skills")}
                        sx={{
                          minWidth: 40,
                          height: 40,
                          backgroundColor: orange,
                          "&:hover": { backgroundColor: darkOrange },
                        }}
                        variant="contained"
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {formData.skills.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    onDelete={() => removeItem(idx, "skills")}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Box>
            </Grid>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: orange,
                  borderRadius: 2,
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: darkOrange,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? "Submitting..." : "Add Project"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddProjectForm;
