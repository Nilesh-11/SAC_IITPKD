import React, { useState, useMemo, useEffect } from "react";
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
import { getEventsList } from "../../api/events";
import CircularProgress from '@mui/material/CircularProgress';

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

export default function EventCalendar() {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getEventsList();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // normalize input events
  const normalizedEvents = useMemo(() => {
    return events.map(evt => {
      const start = dayjs(evt.start_time);
      const end = evt.end_time ? dayjs(evt.end_time) : start.add(1, 'hour');
      return {
        ...evt,
        id: evt.title.replace(/\s+/g, "-").toLowerCase(),
        title: evt.title,
        description: evt.description || "",
        startTime: start,
        endTime: end,
        councilTitle: evt.council_title || 'default',
      };
    });
  }, [events]);

  // filter by date & type
  const filteredEvents = useMemo(() => {
    return normalizedEvents.filter(evt => {
      const matchesDate =
        (!startDate || evt.startTime.isSameOrAfter(startDate, 'day')) &&
        (!endDate || evt.startTime.isSameOrBefore(endDate, 'day'));
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(evt.councilTitle);
      return matchesDate && matchesType;
    });
  }, [normalizedEvents, startDate, endDate, selectedTypes]);

  // segment multi-day events per day
  const segmentsByDate = useMemo(() => {
    const segs = {};
    filteredEvents.forEach(evt => {
      const start = evt.startTime;
      const end = evt.endTime;
      const daysSpan = end.startOf('day').diff(start.startOf('day'), 'day');
      for (let i = 0; i <= daysSpan; i++) {
        const day = start.startOf('day').add(i, 'day');
        const key = day.format('YYYY-MM-DD');
        const segStart = i === 0 ? start : day.hour(START_HOUR).minute(0);
        const segEnd = i === daysSpan ? end : day.hour(START_HOUR + HOURS.length).minute(0);
        if (!segs[key]) segs[key] = [];
        segs[key].push({ ...evt, segmentStart: segStart, segmentEnd: segEnd });
      }
    });
    return segs;
  }, [filteredEvents]);

  // assign lanes for overlaps
  const positionedEventsByDate = useMemo(() => {
    const result = {};
    Object.entries(segmentsByDate).forEach(([date, segs]) => {
      // sort by segmentStart
      const sorted = [...segs].sort((a, b) => a.segmentStart - b.segmentStart);
      const lanes = [];
      const positioned = sorted.map(seg => {
        let laneIndex = 0;
        while (laneIndex < lanes.length) {
          const last = lanes[laneIndex][lanes[laneIndex].length - 1];
          if (last.segmentEnd.isSameOrBefore(seg.segmentStart)) break;
          laneIndex++;
        }
        if (laneIndex === lanes.length) lanes.push([]);
        lanes[laneIndex].push(seg);
        return { ...seg, laneIndex };
      });
      positioned.forEach(evt => { evt.totalLanes = lanes.length; });
      result[date] = positioned;
    });
    return result;
  }, [segmentsByDate]);

  const dates = useMemo(() => Object.keys(positionedEventsByDate).sort(), [positionedEventsByDate]);

  const handleDateChange = setter => e => setter(e.target.value ? dayjs(e.target.value) : null);
  const clearFilters = () => { setStartDate(null); setEndDate(null); setSelectedTypes([]); };

  if (loading) return (
    <Box textAlign="center" mt={10}>
      <h2>Loading Calendar...</h2>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ p: 2, px: { xs: 2, sm: 5, md: 10 }, py: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(255,154,65,0.96)', mb: 4 }}>
        CALENDAR
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap' }}>
        <Grid item xs={12} sm="auto">
          <TextField label="Start Date" type="date" value={startDate?.format('YYYY-MM-DD')||''}
            onChange={handleDateChange(setStartDate)} InputLabelProps={{ shrink: true }} fullWidth />
        </Grid>
        <Grid item xs={12} sm="auto">
          <TextField label="End Date" type="date" value={endDate?.format('YYYY-MM-DD')||''}
            onChange={handleDateChange(setEndDate)} InputLabelProps={{ shrink: true }} fullWidth />
        </Grid>
        <Grid item xs={12} sm="auto">
          <FormControl sx={{ minWidth: { xs:150, sm:200 }, width:'100%' }}>
            <InputLabel id="council-label">Council</InputLabel>
            <Select labelId="council-label" multiple value={selectedTypes}
              onChange={e=>setSelectedTypes(e.target.value)} input={<OutlinedInput label="Council" />}
              renderValue={sel=>sel.join(', ')}>
              {Object.keys(COUNCIL_COLORS).filter(t=>t!=='default').map(type=> (
                <MenuItem key={type} value={type}>
                  <Checkbox checked={selectedTypes.includes(type)} />
                  <ListItemText primary={type} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Button variant="contained" color="error" onClick={clearFilters}>Clear Filters</Button>
        </Grid>
      </Grid>

      {/* Legend */}
      <Stack direction="row" spacing={2} sx={{ mb:2, flexWrap:'wrap' }}>
        {Object.entries(COUNCIL_COLORS).map(([type,color])=> type!=='default' && (
          <Chip key={type} label={type} sx={{ backgroundColor: color, color:'white' }} />
        ))}
      </Stack>

      {/* Calendar Grid */}
      <Box className="calendar-wrapper" sx={{ overflowX:'auto' }}>
        <Box className="calendar" sx={{ minWidth:{ xs:'600px', md:'100%' } }}>
          <Box className="time-column">
            {HOURS.map(hour=> (
              <Box key={hour} className="time-slot" sx={{ fontSize:{ xs:'10px', sm:'12px' } }}>
                {hour}
              </Box>
            ))}
          </Box>

          {dates.map(date=> (
            <Box className="day-column" key={date}>
              <Paper elevation={2} className="date-header">
                {dayjs(date).format('ddd, MMM D, YYYY')}
              </Paper>
              <Box className="events-column">
                {positionedEventsByDate[date].map((evt,i)=> {
                  const top = (evt.segmentStart.hour() + evt.segmentStart.minute()/60 - START_HOUR) * 60;
                  const height = (evt.segmentEnd.diff(evt.segmentStart, 'minute')); 
                  const widthPct = 100 / evt.totalLanes;
                  const leftPct = evt.laneIndex * widthPct;
                  const color = COUNCIL_COLORS[evt.councilTitle] || COUNCIL_COLORS.default;
                  return (
                    <Box key={i} className="event-block" sx={{
                      position:'absolute', top:`${top}px`, height:`${height}px`,
                      width:`${widthPct}%`, left:`${leftPct}%`,
                      backgroundColor:`${color}CC`, cursor:'pointer', transition:'transform 0.2s',
                    }} onMouseEnter={e=> e.currentTarget.style.transform='scale(1.03)'}
                       onMouseLeave={e=> e.currentTarget.style.transform='scale(1)'}>
                      <Typography variant="body2" fontWeight="bold" noWrap>{evt.title}</Typography>
                      <Typography variant="caption">
                        {evt.segmentStart.format('h:mm A')} - {evt.segmentEnd.format('h:mm A')}
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
}
