import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AddStudentApi } from "../../api/admin";
import { MdPersonAdd } from "react-icons/md";
const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    full_name: "",
    email: "",
    password: "",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { name, full_name, email, password } = formData;
    if (!name || !full_name || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await AddStudentApi(formData);
      if (res?.type === "ok") {
        setSuccess("Student added successfully!");
        setFormData({
          name: "",
          full_name: "",
          email: "",
          password: "",
        });
      } else {
        setError(res?.details || "Failed to add student.");
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
          Add Student
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} sx={{ flexDirection: "column" }}>
            {["name", "full_name", "email", "password"].map((field) => (
              <Grid item xs={12} key={field}>
                <TextField
                  fullWidth
                  name={field}
                  label={
                    field === "full_name"
                      ? "Full Name"
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  type={field === "password" ? "password" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  sx={textFieldSx}
                />
              </Grid>
            ))}

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
                    <MdPersonAdd />
                  )
                }
              >
                {loading ? "Adding..." : "Add Student"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddStudentForm;
