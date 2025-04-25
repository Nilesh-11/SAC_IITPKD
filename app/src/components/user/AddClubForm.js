import React, { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { AddClubApi } from "../../api/council";
import { MdClose, MdPersonAdd } from "react-icons/md";

const AddClubForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    email: "",
    password: "",
    faculty_advisor: "",
    head: "",
    coheads: [],
  });

  const [coheadInput, setCoheadInput] = useState("");
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
      "& textarea": {
        fontFamily: "Roboto, sans-serif",
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

  const handleCoheadInputChange = (e) => {
    setCoheadInput(e.target.value);
  };

  const handleAddCohead = () => {
    if (coheadInput.trim() !== "") {
      const newCohead = coheadInput.trim();
      if (!formData.coheads.includes(newCohead)) {
        setFormData((prev) => ({
          ...prev,
          coheads: [...prev.coheads, newCohead],
        }));
      }
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
    setError("");
    setSuccess("");
    setLoading(true);

    // basic field validation
    const requiredFields = [
      "name",
      "title",
      "description",
      "email",
      "password",
      "faculty_advisor",
      "head",
    ];
    const missing = requiredFields.find((field) => !formData[field]);

    if (missing) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await AddClubApi(formData);
      if (res?.type === "ok") {
        setSuccess("Club successfully added!");
        setFormData({
          name: "",
          title: "",
          description: "",
          email: "",
          password: "",
          faculty_advisor: "",
          head: "",
          coheads: [],
        });
      } else {
        setError(res?.details || "Error adding club.");
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
          Create a New Club
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
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
              { name: "email", label: "Email", type: "email" },
              { name: "password", label: "Password", type: "password" },
              { name: "faculty_advisor", label: "Faculty Advisor" },
              { name: "head", label: "Club Head" },
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
                label="Add Co-heads"
                value={coheadInput}
                onChange={handleCoheadInputChange}
                sx={textFieldSx}
                placeholder="Enter co-head's email"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        onClick={handleAddCohead}
                        sx={{
                          minWidth: 40,
                          height: 40,
                          backgroundColor: orange,
                          "&:hover": { backgroundColor: darkOrange },
                        }}
                      >
                        <MdPersonAdd fontSize="small" />
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.coheads.map((cohead, index) => (
                  <Chip
                    key={index}
                    label={cohead}
                    onDelete={() => removeCohead(index)}
                    deleteIcon={<MdClose />}
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "#f0f0f0",
                      fontSize: 14,
                      "& .MuiChip-deleteIcon": {
                        color: "#666",
                        "&:hover": { color: darkOrange },
                      },
                    }}
                  />
                ))}
              </Box>
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
                  ) : null
                }
              >
                {loading ? "Submitting..." : "Create Club"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddClubForm;
