import React, { useState } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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

const CalendarComponent = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const generateMonthDays = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const daysInMonth = currentMonth.daysInMonth();

    const startDay = startOfMonth.day();
    const daysFromPrevMonth = startDay === 0 ? 6 : startDay - 1;

    const endDay = endOfMonth.day();
    const daysFromNextMonth = endDay === 0 ? 0 : 7 - endDay;

    const days = [];

    for (let i = daysFromPrevMonth; i > 0; i--) {
      days.push({
        date: startOfMonth.subtract(i, "day"),
        currentMonth: false,
        events: [],
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = currentMonth.date(i);
      days.push({
        date,
        currentMonth: true,
        events:
          events?.filter((e) => dayjs(e.start_time).isSame(date, "day")) || [],
      });
    }

    // Next month days
    for (let i = 1; i <= daysFromNextMonth; i++) {
      days.push({
        date: endOfMonth.add(i, "day"),
        currentMonth: false,
        events: [],
      });
    }

    return days;
  };

  const handleMonthChange = (monthsToAdd) => {
    setCurrentMonth(currentMonth.add(monthsToAdd, "month"));
  };

  const renderDay = (day) => {
    const hasEvents = day.events.length > 0;
    const councils = [...new Set(day.events.map((e) => e.council))];
    const primaryColor =
      councils.length === 1
        ? COUNCIL_COLORS[councils[0]] || COUNCIL_COLORS.default
        : COUNCIL_COLORS.default;

    const tooltipContent = day.events
      .map((e) => `${dayjs(e.start_time).format("HH:mm")} - ${e.title}`)
      .join("\n");

    return (
      <Tooltip
        key={day.date.toString()}
        title={
          hasEvents ? <pre style={{ margin: 0 }}>{tooltipContent}</pre> : ""
        }
        arrow
      >
        <Box
          sx={{
            width: "100%",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: hasEvents ? primaryColor : "transparent",
            color: hasEvents
              ? "white"
              : day.currentMonth
              ? "text.primary"
              : "text.disabled",
            cursor: hasEvents ? "pointer" : "default",
            "&:hover": {
              backgroundColor: hasEvents ? "#333" : "action.hover",
            },
          }}
        >
          {day.date.date()}
        </Box>
      </Tooltip>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        padding: 2,
      }}
    >
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

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          onClick={() => handleMonthChange(-1)}
          sx={{ color: "rgb(243, 130, 33)" }}
        >
          <FaChevronLeft fontSize="20px" />
        </Button>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {currentMonth.format("MMMM YYYY")}
        </Typography>
        <Button
          onClick={() => handleMonthChange(1)}
          sx={{ color: "rgb(243, 130, 33)" }}
        >
          <FaChevronRight fontSize="20px" />
        </Button>
      </Box>

      <Paper
        sx={{
          backgroundColor: "rgb(250, 199, 170)",
          borderRadius: "8px",
          padding: "10px",
          width: "90%",
          maxWidth: "400px",
          marginLeft: "auto",
          "@media (max-width: 600px)": {
            padding: "5px",
            width: "100%",
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            textAlign: "center",
            mb: 1,
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Typography key={day} variant="caption">
              {day}
            </Typography>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
          }}
        >
          {generateMonthDays().map(renderDay)}
        </Box>
      </Paper>
    </Box>
  );
};

export default CalendarComponent;
