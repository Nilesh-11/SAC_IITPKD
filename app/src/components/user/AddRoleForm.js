import React, { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { FaIdBadge } from "react-icons/fa";
import { AddRoleApi } from "../../api/club";

const AddRoleForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    privilege: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const orange = "rgb(243,130,33)";
  const darkOrange = "rgb(220,110,25)";

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
      "& input, & textarea": {
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
      [name]: name === "privilege" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { title, description, privilege } = formData;
    if (!title || !description || !privilege ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await AddRoleApi(formData);
      if (res?.type === "ok") {
        setSuccess("Role successfully added!");
        setFormData({
          title: "",
          description: "",
          privilege: ""
        });
      } else {
        setError(res?.details || "Error adding role.");
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
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.2)), url('/bg1.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 4,
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
          Add Club Role
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} sx={{ flexDirection: "column" }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Role Title"
                value={formData.title}
                onChange={handleChange}
                sx={textFieldSx}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Role Description"
                value={formData.description}
                onChange={handleChange}
                sx={textFieldSx}
                multiline
                minRows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="privilege"
                label="Privilege Level (5-80)"
                type="number"
                value={formData.privilege}
                onChange={handleChange}
                sx={textFieldSx}
                inputProps={{ min: 5, max: 80 }}
              />
            </Grid>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

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
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <FaIdBadge />
                  )
                }
              >
                {loading ? "Submitting..." : "Add Role"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddRoleForm;
