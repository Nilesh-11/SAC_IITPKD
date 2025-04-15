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
  ListItemText
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

const ORGANIZER_COLORS = {
  club: "#4caf50",        // green
  department: "#2196f3",  // blue
  student: "#ff9800",     // orange
  admin: "#9c27b0",       // purple
  default: "#607d8b"      // grey-blue fallback
};

const EventCalendar = ({ events }) => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const hours = getHoursArray();

  const filteredEvents = events.filter((event) => {
    const eventDay = dayjs(event.date);
    const matchesDate =
      (!startDate || eventDay.isSameOrAfter(startDate, "day")) &&
      (!endDate || eventDay.isSameOrBefore(endDate, "day"));
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(event.organizer_type);

    return matchesDate && matchesType;
  });

  const eventsByDate = groupEventsByDate(filteredEvents);
  const dates = Object.keys(eventsByDate).sort();

  return (
    <Box sx={{ padding: 2, px: { xs: 2, sm: 5, md: 10 }, py: 3 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          fontFamily: "Poppins, sans-serif",
          color: "rgba(255, 154, 65, 0.96)",
          mb: 4
        }}
      >
        CALENDAR
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap' }}>
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
          <FormControl sx={{ minWidth: { xs: 150, sm: 200 }, width: '100%' }}>
            <InputLabel id="organizer-type-label">Organizer Type</InputLabel>
            <Select
              labelId="organizer-type-label"
              multiple
              value={selectedTypes}
              onChange={(e) => setSelectedTypes(e.target.value)}
              input={<OutlinedInput label="Organizer Type" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {Object.keys(ORGANIZER_COLORS).filter(type => type !== "default").map((type) => (
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
      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
        {Object.entries(ORGANIZER_COLORS).map(([type, color]) => (
          type !== "default" && (
            <Chip
              key={type}
              label={type}
              sx={{ backgroundColor: color, color: "white" }}
            />
          )
        ))}
      </Stack>

      {/* Calendar */}
      <Box className="calendar-wrapper" sx={{ overflowX: 'auto' }}>
        <Box className="calendar" sx={{ minWidth: { xs: "600px", md: "100%" } }}>
          <Box className="time-column">
            {hours.map((hour) => (
              <Box key={hour} className="time-slot" sx={{ fontSize: { xs: "10px", sm: "12px" } }}>
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
                  const startHour = start.getHours() + start.getMinutes() / 60;
                  const endHour = end.getHours() + end.getMinutes() / 60;
                  const color = ORGANIZER_COLORS[event.organizer_type] || ORGANIZER_COLORS.default;

                  const top = `${(startHour - startDisplayHour) * 60}px`;
                  const height = `${(endHour - startHour) * 60}px`;

                  return (
                    <Box
                      key={index}
                      className="event-block"
                      onClick={() => window.location.href = `/event/${event.id}`}
                      style={{
                        top,
                        height,
                        backgroundColor: `${color}CC`,
                        cursor: "pointer",
                        transition: "transform 0.2s ease-in-out"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.03)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">{event.title}</Typography>
                      <Typography variant="caption">
                        {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
