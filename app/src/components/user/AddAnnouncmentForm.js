import React, { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import { MdCampaign } from "react-icons/md";
import { AddAnnouncementApi } from "../../api/announcement";

const AddAnnouncementForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    priority: "normal",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const orange = "rgb(243,130,33)";
  const darkOrange = "rgb(220,110,25)";
  const priorities = ["low", "normal", "high", "critical"];

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { title, body } = formData;
    if (!title || !body) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await AddAnnouncementApi(formData);
      if (res?.type === "ok") {
        setSuccess("Announcement successfully posted!");
        setFormData({
          title: "",
          body: "",
          priority: "normal",
        });
      } else {
        setError(res?.details || "Error adding announcement.");
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
          Add Announcement
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} sx={{ flexDirection: "column" }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Announcement Title"
                value={formData.title}
                onChange={handleChange}
                sx={textFieldSx}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="body"
                label="Announcement Body"
                value={formData.body}
                onChange={handleChange}
                sx={textFieldSx}
                multiline
                minRows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                name="priority"
                label="Priority"
                value={formData.priority}
                onChange={handleChange}
                sx={textFieldSx}
              >
                {priorities.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
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
                    <MdCampaign size={20} />
                  )
                }
              >
                {loading ? "Posting..." : "Add Announcement"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddAnnouncementForm;
