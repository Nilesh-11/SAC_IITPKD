import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordApi, Api } from "../api/auth";
import {
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
import { FaSignInAlt } from "react-icons/fa"; // Login Icon from react-icons
import { FaUserAlt } from "react-icons/fa";  // Person Icon from react-icons

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
      } else {
        setError("Invalid credentials or server error.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGuestLogin = async () => {
    setLoading(true);
    setError("");
  
    try {
      const userType = "guest";
      const res = await Api(`/api/auth/${userType}/login`, {
        data: { email: "", password: "" },
      });
      const content = res?.content;
  
      if (content?.type === "ok" && content?.token) {
        loginUser(content.token);
      } else {
        setError("Guest login failed. Try again later.");
      }
    } catch (err) {
      setError("Something went wrong during guest login.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async () => {
    setLoading(true);
    try {
      const res = await ForgotPasswordApi({ email: forgotPasswordEmail });
      if (res?.type === "ok") {
        alert("Check your email for reset instructions.");
        setForgotPasswordOpen(false);
      } else {
        setError(res?.details || "Error sending reset link.");
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
        backgroundImage: `linear-gradient(rgba(255,255,255,0.15), rgba(255,255,255,0.25)), url('/bg2.webp')`,
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
          width: { xs: "100%", sm: 340 },
          boxShadow: 4,
          textAlign: "center",
          fontFamily: "Roboto, sans-serif",
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <img
          src="/sac_circular.webp"
          alt="SAC Logo"
          style={{ width: 80, marginBottom: 12 }}
        />

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            fontFamily: "Poppins, sans-serif",
            fontSize: "1.25rem",
          }}
        >
          Welcome to SAC Portal
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "gray" }}>
          Sign in to your account
        </Typography>

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          margin="dense"
          required
          sx={textFieldSx}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          margin="dense"
          required
          sx={textFieldSx}
        />

        <FormControl fullWidth margin="dense" sx={textFieldSx}>
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

        {error && (
          <Alert severity="error" sx={{ mt: 1.5, mb: 1 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          startIcon={<FaSignInAlt />}
          sx={{
            mt: 2,
            py: 1.2,
            backgroundColor: orange,
            borderRadius: "10px",
            fontWeight: 500,
            fontFamily: "Roboto, sans-serif",
            textTransform: "none",
            '&:hover': {
              backgroundColor: darkOrange,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
          }}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<FaUserAlt />}
          sx={{
            mt: 1.5,
            py: 1.2,
            borderRadius: "10px",
            borderColor: orange,
            color: orange,
            fontWeight: 500,
            textTransform: "none",
            fontFamily: "Roboto, sans-serif",
            '&:hover': {
              borderColor: darkOrange,
              backgroundColor: "rgba(243,130,33,0.08)",
            },
          }}
          onClick={handleGuestLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Continue as Guest"}
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don&apos;t have an account?{" "}
          <a href="/signup" style={{ textDecoration: "none", color: orange }}>
            Sign up
          </a>
        </Typography>

        <Typography
          variant="body2"
          sx={{
            cursor: "pointer",
            mt: 1,
            color: orange,
            '&:hover': { textDecoration: "underline" },
          }}
          onClick={() => setForgotPasswordOpen(true)}
        >
          Forgot password?
        </Typography>
      </Box>

      <Dialog
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      >
        <DialogTitle sx={{ fontFamily: "Roboto, sans-serif" }}>
          Reset Password
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Enter your email"
            value={forgotPasswordEmail}
            onChange={handleForgotPasswordChange}
            margin="normal"
            required
            sx={textFieldSx}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setForgotPasswordOpen(false)}
            disabled={loading}
            sx={{ color: orange }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleForgotPasswordSubmit}
            disabled={loading}
            sx={{
              backgroundColor: orange,
              color: "white",
              '&:hover': {
                backgroundColor: darkOrange,
              },
            }}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginDashboard;
