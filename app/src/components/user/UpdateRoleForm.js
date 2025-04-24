import React, { useEffect, useState } from "react";
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
import { RolesListApi, UpdateRoleApi, DeleteRoleApi } from "../../api/club";
import timeAgo from "../../utils/parser";

const UpdateRoleForm = ({ userEmail }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    privilege: 10,
    description: "",
  });

  const [roleMeta, setRoleMeta] = useState({
    member_count: 0,
    created_at: "",
    updated_at: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const orange = "rgb(243,130,33)";
  const darkOrange = "rgb(220,110,25)";

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await RolesListApi();
        if (res?.type === "ok") {
          setRoles(res.roles);
        } else {
          setMessage({ type: "error", text: res.content?.details });
        }
      } catch (err) {
        console.error("Failed to fetch roles", err);
        setMessage({ type: "error", text: "Error fetching roles." });
      }
    };

    fetchRoles();
  }, [userEmail]);

  const handleSelectRole = (e) => {
    const roleId = e.target.value;
    const role = roles.find((r) => r.id === roleId);
    setSelectedRoleId(roleId);
    if (role) {
      setFormData({
        title: role.title || "",
        privilege: role.privilege || 10,
        description: role.description || "",
      });

      setRoleMeta({
        member_count: role.member_count || 0,
        created_at: role.created_at || "",
        updated_at: role.updated_at || "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (!selectedRoleId) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await DeleteRoleApi({ role_id: selectedRoleId });
      if (res?.type === "ok") {
        setMessage({ type: "success", text: "Role deleted successfully." });
        setRoles((prev) => prev.filter((r) => r.id !== selectedRoleId));
        setSelectedRoleId("");
        setFormData({ title: "", privilege: 10, description: "" });
        setRoleMeta({
          member_count: 0,
          created_at: "",
          updated_at: "",
        });
      } else {
        setMessage({ type: "error", text: res?.details || "Deletion failed" });
      }
    } catch (err) {
      console.error("Deletion error", err);
      setMessage({ type: "error", text: "An error occurred while deleting." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.title.trim() || !formData.description.trim()) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    if (formData.privilege < 5 || formData.privilege > 80) {
      setMessage({
        type: "error",
        text: "Privilege must be between 5 and 80.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await UpdateRoleApi({
        role_id: selectedRoleId,
        ...formData,
      });
      if (res?.type === "ok") {
        setMessage({ type: "success", text: "Role updated successfully!" });
      } else {
        setMessage({
          type: "error",
          text: res?.details || "Update failed",
        });
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
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.2)), url('/bg1.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <Typography variant="h5" align="center" sx={{ color: orange, mb: 3 }}>
          Update Role
        </Typography>

        <TextField
          fullWidth
          select
          label="Select Role"
          value={selectedRoleId}
          onChange={handleSelectRole}
          sx={{ mb: 3, ...textFieldSx }}
        >
          {roles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.title}
            </MenuItem>
          ))}
        </TextField>

        {selectedRoleId && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ flexDirection: "column" }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="title"
                  label="Title"
                  value={formData.title}
                  onChange={handleChange}
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="privilege"
                  type="number"
                  label="Privilege (5-80)"
                  value={formData.privilege}
                  onChange={handleChange}
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Description"
                  multiline
                  minRows={4}
                  value={formData.description}
                  onChange={handleChange}
                  sx={textFieldSx}
                />
              </Grid>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Member Count:</strong> {roleMeta.member_count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Created:</strong> {timeAgo(roleMeta.created_at)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Last Updated:</strong> {timeAgo(roleMeta.updated_at)}
                </Typography>
              </Box>

              {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                  {message.text}
                </Alert>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: orange }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : "Update Role"}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete Role
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default UpdateRoleForm;
