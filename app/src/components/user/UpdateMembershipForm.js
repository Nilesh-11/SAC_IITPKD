import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { MemberInfoApi, UpdateMembershipApi, RolesListApi } from "../../api/club";

const UpdateMembershipForm = () => {
  const [email, setEmail] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const orange = "rgb(243,130,33)";

  const fetchMemberInfo = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await MemberInfoApi({ student_mail: email });
      if (res?.type === "ok") {
        setMemberData(res.data);
        const rolesRes = await RolesListApi();
        if (rolesRes?.type === "ok") setRoles(rolesRes.roles);
      } else {
        setMessage({ type: "error", text: res?.details || "Error fetching info" });
      }
    } catch (err) {
      console.error("Fetch error", err);
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedRole) {
      setMessage({ type: "error", text: "Please select a role to update." });
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await UpdateMembershipApi({ email, role: selectedRole });
      if (res?.type === "ok") {
        setMessage({ type: "success", text: "Membership updated successfully!" });
      } else {
        setMessage({ type: "error", text: res?.details || "Update failed" });
      }
    } catch (err) {
      console.error("Update error", err);
      setMessage({ type: "error", text: "An error occurred while updating." });
    } finally {
      setLoading(false);
    }
  };

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
    },
    "& label": { color: "#666" },
    "& label.Mui-focused": { color: orange },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.2)), url('/bg1.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <Typography variant="h5" align="center" sx={{ color: orange, mb: 3 }}>
          Update Member Role
        </Typography>

        <Grid container spacing={2} sx={{flexDirection:"column"}}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Student Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={textFieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={fetchMemberInfo}
              sx={{ backgroundColor: orange }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Fetch Member Info"}
            </Button>
          </Grid>
        </Grid>

        {memberData && (
          <>
            <Box mt={4}>
              <Typography variant="subtitle1" fontWeight="bold">
                Name: {memberData.student.name}
              </Typography>
              <Typography>Batch: {memberData.student.batch}</Typography>
              <Typography>Department: {memberData.student.department}</Typography>
              <Typography>Current Role: {memberData.role?.title || "None"}</Typography>
            </Box>

            <TextField
              fullWidth
              select
              label="Select New Role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              sx={{ mt: 3, ...textFieldSx }}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.title}>
                  {role.title}
                </MenuItem>
              ))}
            </TextField>

            {message.text && (
              <Alert severity={message.type} sx={{ mt: 2 }}>
                {message.text}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, backgroundColor: orange }}
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Update Membership"}
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default UpdateMembershipForm;
