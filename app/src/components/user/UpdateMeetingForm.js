import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Grid,
  Select,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
  Alert,
  CircularProgress
} from "@mui/material";

const meetingTypes = ["online", "offline"];

const UpdateMeetingForm = ({ project, meeting, onCancel, onSubmit }) => {
  const [form, setForm] = useState({
    meeting_id: meeting.meeting_id,
    title: meeting.title || "",
    description: meeting.description || "",
    meeting_type: meeting.meeting_type || "online",
    scheduled_at: meeting.scheduled_at || "",
    venue: meeting.venue || "",
    meeting_link: meeting.meeting_link || "",
    roles: meeting.roles || [],
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // For disabling submit button while submitting
  const orange = "rgb(243,130,33)";
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      meeting_id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      meeting_type: meeting.meeting_type,
      scheduled_at: meeting.scheduled_at,
      venue: meeting.venue,
      meeting_link: meeting.meeting_link,
      roles: meeting.roles,
    }));
  }, [meeting]);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    const {
      meeting_id,
      title,
      description,
      meeting_type,
      scheduled_at,
      meeting_link,
      venue,
      roles,
    } = form;

    if (
      !title ||
      !description ||
      !meeting_type ||
      !scheduled_at ||
      (meeting_type === "online" && !meeting_link) ||
      (meeting_type === "offline" && !venue) ||
      roles.length === 0
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setError(null); // Reset error message
    setLoading(true);

    onSubmit({ ...form, project_id: project.id })
      .then(() => {
        setLoading(false);
        onCancel(); // Close form upon successful submission
      })
      .catch((err) => {
        setLoading(false);
        setError("Something went wrong. Please try again.");
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Update Meeting
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} {/* Error Alert */}
      <Grid container spacing={2} sx={{ flexDirection: "column" }}>
        <Grid item xs={12}>
          <TextField fullWidth label="Title" value={form.title} onChange={handleChange("title")} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Description" value={form.description} onChange={handleChange("description")} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Meeting Type"
            value={form.meeting_type}
            onChange={handleChange("meeting_type")}
          >
            {meetingTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Scheduled At"
            type="datetime-local"
            value={form.scheduled_at}
            onChange={handleChange("scheduled_at")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Meeting Link (Required for ONLINE)"
            value={form.meeting_link}
            onChange={handleChange("meeting_link")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Venue (Required for OFFLINE)"
            value={form.venue}
            onChange={handleChange("venue")}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="roles-label">Roles</InputLabel>
            <Select
              labelId="roles-label"
              multiple
              value={form.roles}
              onChange={(e) => setForm((f) => ({ ...f, roles: e.target.value }))}
              input={<OutlinedInput label="Roles" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {project.member_roles?.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ backgroundColor: orange }}
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} /> : "Update"}
          </Button>
          <Button onClick={onCancel} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateMeetingForm;
