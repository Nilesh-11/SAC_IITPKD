import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import {
  MyAnnouncementListApi,
  UpdateAnnouncementApi,
  DeleteAnnouncementApi,
} from "../../api/announcement";

const UpdateAnnouncementForm = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    priority: "low",
    expires_at: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const orange = "rgb(243,130,33)";

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await MyAnnouncementListApi();
        if (res?.type === "ok") {
          setAnnouncements(res.announcements || []);
        }
      } catch (err) {
        console.error("Error fetching announcements", err);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleSelectAnnouncement = (e) => {
    const announcementId = e.target.value;
    setSelectedAnnouncementId(announcementId);
    const announcement = announcements.find((a) => a.id === announcementId);
    if (announcement) {
      setFormData({
        title: announcement.title || "",
        body: announcement.body || "",
        priority: announcement.priority || "low",
        expires_at: announcement.expires_at?.slice(0, 16) || "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const required = ["title", "body", "expires_at"];
    for (let field of required) {
      if (!formData[field]?.trim()) {
        setMessage({ type: "error", text: `Please enter ${field}` });
        return;
      }
    }

    setLoading(true);
    try {
      const res = await UpdateAnnouncementApi({
        id: selectedAnnouncementId,
        ...formData,
      });
      if (res?.type === "ok") {
        setMessage({ type: "success", text: "Announcement updated successfully!" });
      } else {
        setMessage({ type: "error", text: res?.details || "Update failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while updating." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAnnouncementId) return;
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await DeleteAnnouncementApi({
        id: selectedAnnouncementId
      });
      if (res?.type === "ok") {
        setMessage({ type: "success", text: "Announcement deleted successfully." });
        setAnnouncements((prev) =>
          prev.filter((a) => a.id !== selectedAnnouncementId)
        );
        setSelectedAnnouncementId("");
        setFormData({
          title: "",
          body: "",
          priority: "low",
          expires_at: "",
        });
      } else {
        setMessage({ type: "error", text: res?.details || "Deletion failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while deleting." });
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
        backgroundImage: `linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2)), url('/bg1.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <Typography variant="h5" align="center" sx={{ color: orange, mb: 3 }}>
          Update Announcement
        </Typography>

        <TextField
          fullWidth
          select
          label="Select Announcement"
          value={selectedAnnouncementId}
          onChange={handleSelectAnnouncement}
          sx={{ mb: 3 }}
        >
          {announcements.map((ann) => (
            <MenuItem key={ann.id} value={ann.id}>
              {ann.title} ({ann.status})
            </MenuItem>
          ))}
        </TextField>

        {selectedAnnouncementId && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} direction="column">
              {[
                { name: "title", label: "Title" },
                { name: "body", label: "Body", multiline: true, minRows: 4 },
                {
                  name: "priority",
                  label: "Priority",
                  select: true,
                  options: ["low", "normal", "high"],
                },
                {
                  name: "expires_at",
                  label: "Expires At",
                  type: "datetime-local",
                }
              ].map(({ name, label, options, ...rest }) => (
                <Grid item key={name}>
                  {options ? (
                    <TextField
                      fullWidth
                      select
                      name={name}
                      label={label}
                      value={formData[name]}
                      onChange={handleChange}
                      {...rest}
                    >
                      {options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      fullWidth
                      name={name}
                      label={label}
                      value={formData[name]}
                      onChange={handleChange}
                      {...rest}
                    />
                  )}
                </Grid>
              ))}

              {message.text && (
                <Alert severity={message.type} sx={{ mt: 2 }}>
                  {message.text}
                </Alert>
              )}

              <Grid item>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: orange }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : "Update Announcement"}
                </Button>
              </Grid>

              <Grid item>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete Announcement
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default UpdateAnnouncementForm;
