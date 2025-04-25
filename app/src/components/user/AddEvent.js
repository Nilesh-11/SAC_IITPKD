import React, { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { AddEventApi } from "../../api/events"; // Make sure this is the correct path
import {FaRegCalendarAlt} from 'react-icons/fa';

const AddEventForm = () => {
  const [formData, setFormData] = useState({
    organizer: "",
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    venue: "",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const requiredFields = ["title", "description", "start_time", "end_time", "venue"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await AddEventApi(formData);
      if (res?.type === "ok") {
        setSuccess("Event successfully added!");
        setFormData({
          organizer: "",
          title: "",
          description: "",
          start_time: "",
          end_time: "",
          venue: "",
        });
      } else {
        setError(res?.details || "Error adding event.");
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
          maxWidth: 700,
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
          Add Event
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} sx={{flexDirection: "column"}}>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="organizer"
                label="Organizer Email"
                value={formData.organizer}
                onChange={handleChange}
                sx={textFieldSx}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Event Title"
                value={formData.title}
                onChange={handleChange}
                sx={textFieldSx}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                sx={textFieldSx}
                multiline
                minRows={3}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="start_time"
                label="Start Time"
                type="datetime-local"
                value={formData.start_time}
                onChange={handleChange}
                sx={textFieldSx}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="end_time"
                label="End Time"
                type="datetime-local"
                value={formData.end_time}
                onChange={handleChange}
                sx={textFieldSx}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="venue"
                label="Venue"
                value={formData.venue}
                onChange={handleChange}
                sx={textFieldSx}
              />
            </Grid>

            {error && (
              <Alert severity="error" sx={{ width: "100%" }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ width: "100%" }}>
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
                    <FaRegCalendarAlt />
                  )
                }
              >
                {loading ? "Adding..." : "Add Event"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddEventForm;
