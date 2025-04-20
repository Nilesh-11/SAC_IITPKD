import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ResetPasswordApi } from "../api/auth";
import { validatePassword } from "../utils/auth";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const orange = "rgb(243,130,33)";
  const darkOrange = "rgb(220,110,25)";

  const passwordValidations = validatePassword(newPassword);
  const isPasswordValid = Object.values(passwordValidations).every(Boolean);

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

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!isPasswordValid) {
      setError("Password does not meet the required criteria.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await ResetPasswordApi({ new_password: newPassword, token });
      if (res?.type === "ok") {
        setMessage("Your password has been reset successfully.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        switch (res.details) {
          case "TokenInvalid":
            setError(
              "This password reset link is invalid. Please request a new one."
            );
            break;
          case "TokenUsed":
            setError(
              "This reset link has already been used. Please request a new one."
            );
            break;
          case "TokenExpired":
            setError("This reset link has expired. Please request a new one.");
            break;
          case "User not found.":
            setError("The user associated with this reset link was not found.");
            break;
          default:
            setError("Something went wrong. Please try again.");
        }
      }
    } catch (err) {
      setError("Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.15), rgba(255,255,255,0.25)), url('/bg2.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          p: 3,
          width: { xs: "100%", sm: 360 },
          boxShadow: 4,
          textAlign: "center",
          fontFamily: "Roboto, sans-serif",
        }}
        component="form"
        onSubmit={handleReset}
      >
        <Box sx={{ mb: 2 }}>
          <img
            src="/sac_circular.jpg"
            alt="SAC Logo"
            style={{ height: "64px", objectFit: "contain" }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            fontFamily: "Poppins, sans-serif",
            fontSize: "1.25rem",
          }}
        >
          Reset Your Password
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "gray" }}>
          Please enter a new password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <TextField
          fullWidth
          label="New Password"
          type="password"
          margin="dense"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={textFieldSx}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          margin="dense"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={textFieldSx}
        />

        <Box mt={2} sx={{ textAlign: "left" }}>
          <Typography variant="body2" gutterBottom>
            Password must include:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="✅ At least 8 characters"
                sx={{ color: passwordValidations.length ? "green" : "red" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="✅ At least one digit"
                sx={{ color: passwordValidations.digit ? "green" : "red" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="✅ At least one lowercase letter"
                sx={{ color: passwordValidations.lowercase ? "green" : "red" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="✅ At least one uppercase letter"
                sx={{ color: passwordValidations.uppercase ? "green" : "red" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="✅ At least one special character"
                sx={{ color: passwordValidations.special ? "green" : "red" }}
              />
            </ListItem>
          </List>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            mt: 2,
            py: 1.2,
            backgroundColor: orange,
            borderRadius: "10px",
            fontWeight: 500,
            fontFamily: "Roboto, sans-serif",
            textTransform: "none",
            "&:hover": {
              backgroundColor: darkOrange,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
          }}
        >
          {loading ? "Submitting..." : "Reset Password"}
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPassword;
