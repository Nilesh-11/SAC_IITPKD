import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { Box, Typography } from '@mui/material';

const CalendarComponent = ({ events }) => {
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([]);

  // Fetch events and highlight the dates for the current month
  const fetchHighlightedDays = (date) => {
    setIsLoading(true);
    const daysToHighlight = events
      .filter((event) => dayjs(event.date).month() === date.month() && dayjs(event.date).year() === date.year())
      .map((event) => dayjs(event.date).date());

    setHighlightedDays(daysToHighlight);
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
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
    const isSelected = !outsideCurrentMonth && highlightedDays.includes(day.date());

    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={isSelected ? '🌚' : undefined}
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
          sx={{
            ...(isSelected && {
              backgroundColor: 'rgb(243, 130, 33)', // Highlight selected day with the specified color
              color: 'white', // Change text color to white for better contrast
              '&:hover': {
                backgroundColor: 'rgb(243, 130, 33)', // Ensure hover state maintains the highlight
              },
            }),
            // Override default focus and selected state to prevent blue background
            '&.Mui-selected': {
              backgroundColor: 'rgb(243, 130, 33) !important', // Override default selected state
              color: 'white',
            },
            '&.Mui-focusVisible': {
              backgroundColor: 'rgb(243, 130, 33) !important', // Override default focus state
              color: 'white',
            },
          }}
        />
      </Badge>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ 
          width: '100%', 
          maxWidth: 600, // Limit the max width on larger screens
          margin: '0 auto', // Center align the box
          padding: 2,
          '@media (max-width: 600px)': { // Ensure the container is full width on smaller screens
              padding: 1,
          }
      }}>
          {/* Header with Calendar text and thick line */}
          <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-end', // Align the title to the right
              marginBottom: 2,
              '@media (max-width: 600px)': {
                  alignItems: 'center',
              },
          }}>
              <Typography 
                  variant="h6" 
                  sx={{ 
                      marginBottom: '5px',
                      fontSize: { xs: '16px', sm: '18px', md: '20px' }, // Responsive typography
                  }}
              >
                  CALENDAR
              </Typography>
              <Box sx={{ 
                  backgroundColor: 'rgb(243, 130, 33)', 
                  width: '30%', 
                  height: '6px', 
                  borderRadius: '10px',
                  '@media (max-width: 600px)': {
                      width: '50%', // Adjust width of line for small screens
                  }
              }}></Box>
          </Box>
          
          <DateCalendar
              defaultValue={dayjs()}
              loading={isLoading}
              onMonthChange={handleMonthChange}
              renderLoading={() => <DayCalendarSkeleton />}
              sx={{
                  backgroundColor: 'rgb(250, 199, 170)', // Set background color of the calendar
                  borderRadius: '8px', // Optional: Make the calendar have rounded corners
                  padding: '10px',
                  width: '90%', // Reduce the width of the calendar
                  maxWidth: '400px', // Set a maximum width for the calendar
                  height: '300px', // Set a fixed height for the calendar
                  marginLeft: 'auto', // Align the calendar to the right
                  '@media (max-width: 600px)': {
                      padding: '5px', // Less padding on small screens
                      width: '100%', // Full width on smaller screens
                      height: '250px', // Adjust height for smaller screens
                  },
              }}
              slots={{
                  day: CustomDay,
              }}
              slotProps={{
                  day: {
                      highlightedDays,
                  },
              }}
          />
      </Box>


    </LocalizationProvider>
  );
};

export default CalendarComponent;
