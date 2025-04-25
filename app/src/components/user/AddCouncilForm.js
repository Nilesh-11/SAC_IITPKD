import React, { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { AddCouncilApi } from "../../api/admin"; // Replace with actual path
import { FaUserPlus } from "react-icons/fa";
const AddCouncilForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    title: "",
    password: "",
    description: "",
    faculty_advisor: "",
    secretary: "",
    deputy: "",
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

    const required = ["email", "name", "title", "password", "description", "secretary"];
    for (let field of required) {
      if (!formData[field]?.trim()) {
        setError(`Please fill the ${field} field.`);
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        deputy: formData.deputy
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
      };
      const res = await AddCouncilApi(payload);
      if (res?.type === "ok") {
        setSuccess("Council successfully added!");
        setFormData({
          email: "",
          name: "",
          title: "",
          password: "",
          description: "",
          faculty_advisor: "",
          secretary: "",
          deputy: "",
        });
      } else {
        setError(res?.details || "Error adding council.");
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
        p: 2,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.3)), url('/bg1.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
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
          Add Council
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} sx={{ flexDirection: "column" }}>
            {[
              { name: "email", label: "Council Email" },
              { name: "name", label: "Council Name" },
              { name: "title", label: "Council Title" },
              { name: "password", label: "Password", type: "password" },
              { name: "description", label: "Description", multiline: true, minRows: 3 },
              { name: "faculty_advisor", label: "Faculty Advisor (Optional)" },
              { name: "secretary", label: "Secretary" },
              {
                name: "deputy",
                label: "Deputies (Comma-separated emails)",
              },
            ].map(({ name, label, ...rest }) => (
              <Grid item key={name}>
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

            <Grid item>
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
                    <FaUserPlus />
                  )
                }
              >
                {loading ? "Adding..." : "Add Council"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddCouncilForm;
