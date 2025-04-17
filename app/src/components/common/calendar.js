import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { Box, Typography, Tooltip, Chip } from "@mui/material";

// Color map for different councils
const COUNCIL_COLORS = {
  "Technical Council": "#f38221",
  "Cultural Council": "#7e57c2",
  "Sports Council": "#43a047",
  "Academic Council": "#039be5",
  default: "#546e7a",
};

const CalendarComponent = ({ events }) => {
  const requestAbortController = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDaysMap, setHighlightedDaysMap] = useState({});

  const fetchHighlightedDays = (date) => {
    setIsLoading(true);
    const map = {};

    events.forEach((event) => {
      const eventDate = dayjs(event.start_time);
      if (
        eventDate.month() === date.month() &&
        eventDate.year() === date.year()
      ) {
        const day = eventDate.date();
        if (!map[day]) map[day] = [];
        map[day].push(event);
      }
    });

    setHighlightedDaysMap(map);
    setIsLoading(false);
  };

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }
    fetchHighlightedDays(date);
  };

  useEffect(() => {
    fetchHighlightedDays(dayjs());
    return () => requestAbortController.current?.abort();
  }, [events]);

  function CustomDay(props) {
    const { day, outsideCurrentMonth, ...other } = props;
    const dayNum = day.date();
    const dayEvents = highlightedDaysMap[dayNum] || [];
    const isHighlighted = !outsideCurrentMonth && dayEvents.length > 0;
  
    // Get all involved councils for the day
    const councils = [...new Set(dayEvents.map((e) => e.council))];
    const primaryColor =
      councils.length === 1
        ? COUNCIL_COLORS[councils[0]] || COUNCIL_COLORS["default"]
        : COUNCIL_COLORS["default"];
  
    const tooltipContent = dayEvents
      .map((e) => `${dayjs(e.start_time).format("HH:mm")} - ${e.title}`)
      .join("\n");
  
    const pickersDay = (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        sx={{
          ...(isHighlighted && {
            backgroundColor: primaryColor,
            color: "white",
            "&:hover": {
              backgroundColor: dayjs().isSame(day, 'day') ? primaryColor : "#333",
              color: "white",
            },
          }),
          "&.Mui-selected": {
            backgroundColor: primaryColor + " !important",
            color: "white",
          },
          "&.Mui-focusVisible": {
            backgroundColor: primaryColor + " !important",
            color: "white",
          },
        }}
      />
    );
  
    return isHighlighted ? (
      <Tooltip title={<pre style={{ margin: 0 }}>{tooltipContent}</pre>} arrow>
        {pickersDay}
      </Tooltip>
    ) : (
      pickersDay
    );
  }
  

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          margin: "0 auto",
          padding: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            marginBottom: 2,
            "@media (max-width: 600px)": {
              alignItems: "center",
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: "5px",
              fontSize: { xs: "16px", sm: "18px", md: "20px" },
            }}
          >
            CALENDAR
          </Typography>
          <Box
            sx={{
              backgroundColor: "#f38221",
              width: "30%",
              height: "6px",
              borderRadius: "10px",
              "@media (max-width: 600px)": {
                width: "50%",
              },
            }}
          />
        </Box>

        <DateCalendar
          defaultValue={dayjs()}
          loading={isLoading}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          sx={{
            backgroundColor: "rgb(250, 199, 170)",
            borderRadius: "8px",
            padding: "10px",
            width: "90%",
            maxWidth: "400px",
            height: "300px",
            marginLeft: "auto",
            "@media (max-width: 600px)": {
              padding: "5px",
              width: "100%",
              height: "250px",
            },
          }}
          slots={{ day: CustomDay }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default CalendarComponent;
