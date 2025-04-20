import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Api, { ForgotPasswordApi } from "../api/auth";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const LoginDashboard = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    userType: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { email, password, userType } = form;
      const res = await Api(`/api/auth/${userType}/login`, {
        data: { email, password },
      });
      const content = res?.content;

      if (content?.type === "ok" && content?.token) {
        loginUser(content.token);
        console.log(
          "Token stored in localStorage:",
          localStorage.getItem("token")
        );
      } else {
        setError("Invalid credentials or server error.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await ForgotPasswordApi({ email: forgotPasswordEmail });
      if (res?.type === "ok") {
        alert("Please check your email for reset instructions.");
        setForgotPasswordOpen(false);
      } else {
        setError(res?.details || "Error sending reset link. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          bgcolor: "white",
          boxShadow: 3,
          borderRadius: 2,
          width: "100%",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>User Type</InputLabel>
          <Select
            name="userType"
            value={form.userType}
            label="User Type"
            onChange={handleChange}
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="council">Council</MenuItem>
            <MenuItem value="club">Club</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Don&apos;t have an account?{" "}
            <a href="#" style={{ textDecoration: "none", color: "#1976d2" }}>
              Sign up
            </a>
          </Typography>

          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", mt: 2 }}
            onClick={() => setForgotPasswordOpen(true)}
          >
            Forgot password?
          </Typography>
        </Box>
      </Box>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Enter your email"
            value={forgotPasswordEmail}
            onChange={handleForgotPasswordChange}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setForgotPasswordOpen(false)}
            color="secondary"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleForgotPasswordSubmit}
            color="primary"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoginDashboard;
