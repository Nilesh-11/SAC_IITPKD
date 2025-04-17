import React, { useState } from "react";
import "./bigcalendar.css";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const getHoursArray = () => {
  return Array.from({ length: 17 }, (_, i) => `${i + 7}:00`);
};

const startDisplayHour = 7;

const groupEventsByDate = (events) => {
  const grouped = {};
  events.forEach((event) => {
    if (!grouped[event.date]) {
      grouped[event.date] = [];
    }
    grouped[event.date].push(event);
  });
  return grouped;
};

const COUNCIL_COLORS = {
  "Technical Council": "#f38221",
  "Cultural Council": "#7e57c2",
  "Sports Council": "#43a047",
  "Hostel Council": "#ff7043",
  "Research Affairs": "#5c6bc0",
  "General Affairs": "#00897b",
  "Post Graduate Affairs": "#c2185b",
  default: "#546e7a",
};

const EventCalendar = ({ events = [] }) => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Normalize events
  const normalizedEvents = events.map((event) => {
    const start = new Date(event.start_time);
    const end = event.end_time
      ? new Date(event.end_time)
      : new Date(start.getTime() + 60 * 60 * 1000); // default 1 hour
    return {
      id: event.title.replace(/\s+/g, "-").toLowerCase(),
      title: event.title,
      description: event.description || "",
      date: start.toISOString().split("T")[0],
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      council: event.council || "default",
    };
  });

  const filteredEvents = normalizedEvents.filter((event) => {
    const eventDay = dayjs(event.date);
    const matchesDate =
      (!startDate || eventDay.isSameOrAfter(startDate, "day")) &&
      (!endDate || eventDay.isSameOrBefore(endDate, "day"));
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(event.council);

    return matchesDate && matchesType;
  });

  const eventsByDate = groupEventsByDate(filteredEvents);
  const dates = Object.keys(eventsByDate).sort();

  const hours = getHoursArray();

  return (
    <Box sx={{ padding: 2, px: { xs: 2, sm: 5, md: 10 }, py: 3 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          fontFamily: "Poppins, sans-serif",
          color: "rgba(255, 154, 65, 0.96)",
          mb: 4,
        }}
      >
        CALENDAR
      </Typography>

      {/* Filters */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{ mb: 2, flexWrap: "wrap" }}
      >
        <Grid item xs={12} sm={"auto"}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
        </Grid>
        <Grid item xs={12} sm={"auto"}>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
        </Grid>
        <Grid item xs={12} sm={"auto"}>
          <FormControl sx={{ minWidth: { xs: 150, sm: 200 }, width: "100%" }}>
            <InputLabel id="council-label">Council</InputLabel>
            <Select
              labelId="council-label"
              multiple
              value={selectedTypes}
              onChange={(e) => setSelectedTypes(e.target.value)}
              input={<OutlinedInput label="Council" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {Object.keys(COUNCIL_COLORS)
                .filter((type) => type !== "default")
                .map((type) => (
                  <MenuItem key={type} value={type}>
                    <Checkbox checked={selectedTypes.indexOf(type) > -1} />
                    <ListItemText primary={type} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={"auto"}>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              setSelectedTypes([]);
            }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>

      {/* Legend */}
      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
        {Object.entries(COUNCIL_COLORS).map(
          ([type, color]) =>
            type !== "default" && (
              <Chip
                key={type}
                label={type}
                sx={{ backgroundColor: color, color: "white" }}
              />
            )
        )}
      </Stack>

      {/* Calendar */}
      <Box className="calendar-wrapper" sx={{ overflowX: "auto" }}>
        <Box
          className="calendar"
          sx={{ minWidth: { xs: "600px", md: "100%" } }}
        >
          <Box className="time-column">
            {hours.map((hour) => (
              <Box
                key={hour}
                className="time-slot"
                sx={{ fontSize: { xs: "10px", sm: "12px" } }}
              >
                {hour}
              </Box>
            ))}
          </Box>

          {dates.map((date) => (
            <Box className="day-column" key={date}>
              <Paper elevation={2} className="date-header">
                {new Date(date).toDateString()}
              </Paper>
              <Box className="events-column">
                {eventsByDate[date].map((event, index) => {
                  const start = new Date(event.startTime);
                  const end = new Date(event.endTime);
                  const startHour =
                    start.getHours() + start.getMinutes() / 60;
                  const endHour = end.getHours() + end.getMinutes() / 60;
                  const color =
                    COUNCIL_COLORS[event.council] || COUNCIL_COLORS.default;

                  const top = `${(startHour - startDisplayHour) * 60}px`;
                  const height = `${(endHour - startHour) * 60}px`;

                  return (
                    <Box
                      key={index}
                      className="event-block"
                      onClick={() =>
                        window.location.href = `/event/${event.id}`
                      }
                      style={{
                        top,
                        height,
                        backgroundColor: `${color}CC`,
                        cursor: "pointer",
                        transition: "transform 0.2s ease-in-out",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.03)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {event.title}
                      </Typography>
                      <Typography variant="caption">
                        {start.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {end.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default EventCalendar;
