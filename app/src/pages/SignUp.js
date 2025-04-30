import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../api/auth";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import InputAdornment from "@mui/material/InputAdornment";
import { FaInfoCircle } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [isOtp, setIsOtp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [resending, setResending] = useState(false);

  const handleResendOtp = async () => {
    setResendStatus("");
    setResending(true);

    try {
      const data = {
        email: SignupForm.email,
      };
      const res = await Api("/api/auth/student/resend-otp", { data });
      const content = res;

      if (content.type === "ok") {
        setResendStatus("OTP resent successfully. Check your email.");
      } else {
        setResendStatus(content.detail || "Unable to resend OTP.");
      }
    } catch (err) {
      console.error(err);
      setResendStatus("Something went wrong while resending OTP.");
    } finally {
      setResending(false);
    }
  };

  const [SignupForm, setSignupForm] = useState({
    name: "",
    full_name: "",
    email: "",
    password: "",
  });

  const [OtpForm, setOtpForm] = useState({ otp_code: "" });

  const passwordValidations = {
    length: SignupForm.password.length >= 8,
    digit: /\d/.test(SignupForm.password),
    lowercase: /[a-z]/.test(SignupForm.password),
    uppercase: /[A-Z]/.test(SignupForm.password),
    special: /[^A-Za-z0-9]/.test(SignupForm.password),
  };

  const allValid = Object.values(passwordValidations).every(Boolean);

  const handleSignupChange = (e) =>
    setSignupForm({ ...SignupForm, [e.target.name]: e.target.value });

  const handleOtpChange = (e) =>
    setOtpForm({ ...OtpForm, [e.target.name]: e.target.value });

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!allValid) {
      setError("Please enter a valid password.");
      return;
    }

    setLoading(true);
    try {
      const data = {
        name: SignupForm.name,
        full_name: SignupForm.full_name,
        password: SignupForm.password,
        email: SignupForm.email,
      };
      const res = await Api("/api/auth/student/signup", { data });
      const content = res;

      if (content.type === "ok") {
        setIsOtp(true);
        alert("OTP sent! Please verify.");
      } else if (content.type === "invalid" && content.verdict === "otpfound") {
        alert("OTP already sent");
        setIsOtp(true);
      } else {
        setError(content.detail || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Signup error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        otp_code: OtpForm.otp_code,
        email: SignupForm.email,
      };
      const res = await Api("/api/auth/student/verify-otp", { data });
      const content = res;

      if (content.type === "ok") {
        alert("User registered successfully");
        navigate("/login");
      } else {
        setError(content.detail || "OTP verification failed.");
      }
    } catch (err) {
      console.error(err);
      setError("OTP verification error");
    } finally {
      setLoading(false);
    }
  };

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
        component="form"
        onSubmit={isOtp ? handleOtpSubmit : handleSignupSubmit}
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          p: 3,
          width: { xs: "100%", sm: 360 },
          boxShadow: 4,
          textAlign: "center",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <img
            src="/sac_circular.webp"
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
          {isOtp ? "Verify OTP" : "Create your Account"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "gray" }}>
          {isOtp ? "Check your email for the code" : "Sign up to get started"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!isOtp ? (
          <>
            <TextField
              fullWidth
              label="Username"
              name="name"
              value={SignupForm.name}
              onChange={handleSignupChange}
              margin="dense"
              required
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={SignupForm.full_name}
              onChange={handleSignupChange}
              margin="dense"
              required
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={SignupForm.email}
              onChange={handleSignupChange}
              margin="dense"
              required
              sx={textFieldSx}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={SignupForm.password}
              onChange={handleSignupChange}
              margin="dense"
              required
              sx={textFieldSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={`Password must contain: 
  - At least 8 characters
  - One digit
  - One uppercase
  - One lowercase
  - One special character`}
                    >
                      <IconButton
                        onClick={() =>
                          setShowPasswordCriteria(!showPasswordCriteria)
                        }
                        edge="end"
                        size="small"
                      >
                        <FaInfoCircle fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />

            {showPasswordCriteria && (
              <List dense sx={{ textAlign: "left", mt: 1 }}>
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
                    sx={{
                      color: passwordValidations.lowercase ? "green" : "red",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="✅ At least one uppercase letter"
                    sx={{
                      color: passwordValidations.uppercase ? "green" : "red",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="✅ At least one special character"
                    sx={{
                      color: passwordValidations.special ? "green" : "red",
                    }}
                  />
                </ListItem>
              </List>
            )}
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="Enter OTP"
              name="otp_code"
              value={OtpForm.otp_code}
              onChange={handleOtpChange}
              margin="dense"
              required
              sx={textFieldSx}
            />

            {resendStatus && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {resendStatus}
              </Typography>
            )}

            <Button
              onClick={handleResendOtp}
              disabled={resending}
              variant="text"
              size="small"
              sx={{ mt: 1.5, color: orange }}
            >
              {resending ? "Resending..." : "Resend OTP"}
            </Button>
          </>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
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
          disabled={loading}
        >
          {loading ? "Submitting..." : isOtp ? "Verify OTP" : "Sign Up"}
        </Button>

        {!isOtp && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <a href="/login" style={{ textDecoration: "none", color: orange }}>
              Log in
            </a>
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Signup;
