import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
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

  const passwordValidations = validatePassword(newPassword);
  const isPasswordValid = Object.values(passwordValidations).every(Boolean);

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
            setError("This password reset link is invalid. Please request a new one.");
            break;
          case "TokenUsed":
            setError("This reset link has already been used. Please request a new one.");
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
        backgroundImage: "url('/bg2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 4,
            bgcolor: "white",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Reset Password
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

          <form onSubmit={handleReset}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Box mt={2}>
              <Typography variant="body2" gutterBottom>Password must include:</Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="✅ At least 8 characters" style={{ color: passwordValidations.length ? "green" : "red" }} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="✅ At least one digit" style={{ color: passwordValidations.digit ? "green" : "red" }} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="✅ At least one lowercase letter" style={{ color: passwordValidations.lowercase ? "green" : "red" }} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="✅ At least one uppercase letter" style={{ color: passwordValidations.uppercase ? "green" : "red" }} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="✅ At least one special character" style={{ color: passwordValidations.special ? "green" : "red" }} />
                </ListItem>
              </List>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Submitting..." : "Reset Password"}
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default ResetPassword;
