import React, { useEffect, useState } from "react";
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
  MyEventsApi,
  UpdateEventApi,
  DeleteEventApi,
} from "../../api/events"; // Adjust path accordingly

const UpdateEventForm = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [formData, setFormData] = useState({
    organizer: "",
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    venue: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const orange = "rgb(243,130,33)";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await MyEventsApi();
        if (res?.type === "ok") {
          setEvents(res.events || []);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleSelectEvent = (e) => {
    const id = e.target.value;
    setSelectedEventId(id);
    const event = events.find((ev) => ev.id === id);
    if (event) {
      setFormData({
        organizer: event.organizer || "",
        title: event.title || "",
        description: event.description || "",
        start_time: event.start_time?.slice(0, 16) || "",
        end_time: event.end_time?.slice(0, 16) || "",
        venue: event.venue || "",
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

    const required = ["organizer", "title", "description", "start_time", "end_time", "venue"];
    for (let field of required) {
      if (!formData[field]?.trim()) {
        setMessage({ type: "error", text: `Please enter ${field.replace("_", " ")}` });
        return;
      }
    }

    setLoading(true);
    try {
      const res = await UpdateEventApi({
        id: selectedEventId,
        ...formData,
      });
      if (res?.type === "ok") {
        setMessage({ type: "success", text: "Event updated successfully!" });
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
    if (!selectedEventId) return;
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await DeleteEventApi({ id: selectedEventId });
      if (res?.type === "ok") {
        setMessage({ type: "success", text: "Event deleted successfully." });
        setEvents((prev) => prev.filter((ev) => ev.id !== selectedEventId));
        setSelectedEventId("");
        setFormData({
          organizer: "",
          title: "",
          description: "",
          start_time: "",
          end_time: "",
          venue: "",
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
          Update Event
        </Typography>

        <TextField
          fullWidth
          select
          label="Select Event"
          value={selectedEventId}
          onChange={handleSelectEvent}
          sx={{ mb: 3 }}
        >
          {events.map((ev) => (
            <MenuItem key={ev.id} value={ev.id}>
              {ev.title} ({new Date(ev.start_time).toLocaleDateString()})
            </MenuItem>
          ))}
        </TextField>

        {selectedEventId && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} direction="column">
              {[
                { name: "organizer", label: "Organizer Email", type: "email" },
                { name: "title", label: "Title" },
                { name: "description", label: "Description", multiline: true, minRows: 4 },
                { name: "start_time", label: "Start Time", type: "datetime-local" },
                { name: "end_time", label: "End Time", type: "datetime-local" },
                { name: "venue", label: "Venue" },
              ].map(({ name, label, ...rest }) => (
                <Grid item key={name}>
                  <TextField
                    fullWidth
                    name={name}
                    label={label}
                    value={formData[name]}
                    onChange={handleChange}
                    {...rest}
                  />
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
                  {loading ? <CircularProgress size={20} /> : "Update Event"}
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
                  Delete Event
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default UpdateEventForm;
