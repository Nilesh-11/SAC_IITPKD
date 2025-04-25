import React, { useState, useMemo } from "react";
import "./bigcalendar.css";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

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

const HOURS = Array.from({ length: 17 }, (_, i) => `${i + 7}:00`);
const START_HOUR = 7;

const EventCalendar = ({ events = [] }) => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const normalizedEvents = useMemo(() => {
    return events.map((event) => {
      const start = dayjs(event.start_time);
      const end = event.end_time ? dayjs(event.end_time) : start.add(1, 'hour');
      
      return {
        id: event.title.replace(/\s+/g, "-").toLowerCase(),
        title: event.title,
        description: event.description || "",
        date: start.format("YYYY-MM-DD"),
        startTime: start,
        endTime: end,
        council: event.council_name || "default",
        councilTitle: event.council_title || "default",
      };
    });
  }, [events]);

  const filteredEvents = useMemo(() => {
    return normalizedEvents.filter((event) => {
      const eventDay = dayjs(event.date);
      const matchesDate =
        (!startDate || eventDay.isSameOrAfter(startDate, "day")) &&
        (!endDate || eventDay.isSameOrBefore(endDate, "day"));
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(event.councilTitle);

      return matchesDate && matchesType;
    });
  }, [normalizedEvents, startDate, endDate, selectedTypes]);

  const eventsByDate = useMemo(() => {
    const grouped = {};
    filteredEvents.forEach((event) => {
      if (!grouped[event.date]) {
        grouped[event.date] = [];
      }
      grouped[event.date].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  const dates = useMemo(() => Object.keys(eventsByDate).sort(), [eventsByDate]);

  const handleDateChange = (setter) => (e) => {
    const value = e.target.value;
    setter(value ? dayjs(value) : null);
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedTypes([]);
  };

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

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: "wrap" }}>
        <Grid item xs={12} sm="auto">
          <TextField
            label="Start Date"
            type="date"
            value={startDate?.format("YYYY-MM-DD") || ""}
            onChange={handleDateChange(setStartDate)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm="auto">
          <TextField
            label="End Date"
            type="date"
            value={endDate?.format("YYYY-MM-DD") || ""}
            onChange={handleDateChange(setEndDate)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm="auto">
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
                    <Checkbox checked={selectedTypes.includes(type)} />
                    <ListItemText primary={type} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Button
            variant="contained"
            color="error"
            onClick={handleClearFilters}
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
        <Box className="calendar" sx={{ minWidth: { xs: "600px", md: "100%" } }}>
          <Box className="time-column">
            {HOURS.map((hour) => (
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
                {dayjs(date).format("ddd, MMM D, YYYY")}
              </Paper>
              <Box className="events-column">
                {eventsByDate[date].map((event, index) => {
                  const startHour = event.startTime.hour() + event.startTime.minute() / 60;
                  const endHour = event.endTime.hour() + event.endTime.minute() / 60;
                  const color = COUNCIL_COLORS[event.councilTitle] || COUNCIL_COLORS.default;
                  const top = `${(startHour - START_HOUR) * 60}px`;
                  const height = `${(endHour - startHour) * 60}px`;

                  return (
                    <Box
                      key={index}
                      className="event-block"
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
                        e.currentTarget.styleTransform = "scale(1)";
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {event.title}
                      </Typography>
                      <Typography variant="caption">
                        {event.startTime.format("h:mm A")} - {event.endTime.format("h:mm A")}
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