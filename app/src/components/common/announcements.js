import React, { useState, useRef } from 'react';
import { Button, Box, Typography } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';

const AnnouncementSection = ({announcements}) => {
  const [startIndex, setStartIndex] = useState(0);

  const itemsToShow = 3;
  const containerRef = useRef(null);

  const displayedAnnouncements = announcements.slice(startIndex, startIndex + itemsToShow);

  const handleNext = () => {
    if (containerRef.current.scrollHeight <= containerRef.current.clientHeight + containerRef.current.scrollTop) {
      if (startIndex + itemsToShow < announcements.length) {
        setStartIndex(startIndex + itemsToShow);
      }
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - itemsToShow);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '8px',
        padding: '10px',
        width: '100%',
        maxWidth: '740px',
        minWidth: '300px', // Allow for smaller screens
        overflow: 'hidden',
        margin: '0 auto', // Center align the box
        '@media (max-width: 600px)': {
          minWidth: '100%',
          maxWidth: '100%',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <Typography
          variant="h6"
          sx={{
            marginRight: '10px',
            fontSize: { xs: '14px', sm: '16px', md: '18px' }, // Responsive font size for title
          }}
        >
          ANNOUNCEMENTS
        </Typography>

        <Button
          onClick={handlePrev}
          variant="outlined"
          sx={{
            width: '25px',
            height: '25px',
            minWidth: '20px',
            borderRadius: '10%',
            marginRight: '10px',
            display: startIndex > 0 ? 'block' : 'none',
            padding: 0,
            backgroundColor: 'rgb(243, 130, 33)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              backgroundColor: 'rgb(243, 130, 33)',
            },
          }}
        >
          <PlayArrowRoundedIcon
            sx={{ fontSize: '18px', transform: 'rotate(180deg)', color: 'rgb(250, 199, 170)' }}
          />
        </Button>

        <Button
          onClick={handleNext}
          variant="outlined"
          sx={{
            width: '25px',
            height: '25px',
            minWidth: '20px',
            borderRadius: '10%',
            display: startIndex + itemsToShow < announcements.length ? 'block' : 'none',
            padding: 0,
            backgroundColor: 'rgb(243, 130, 33)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              backgroundColor: 'rgb(243, 130, 33)',
            },
          }}
        >
          <PlayArrowRoundedIcon
            sx={{ fontSize: '18px', transform: 'rotate(0deg)', color: 'rgb(250, 199, 170)' }}
          />
        </Button>
      </Box>

      <Box
        sx={{
          backgroundColor: 'rgb(243, 130, 33)',
          width: '26%',
          marginBottom: '10px',
          height: '6px',
          borderRadius: '10px',
        }}
      ></Box>

      <Box
        sx={{
          marginBottom: '10px'
        }}
        ref={containerRef}
      >
        {displayedAnnouncements.map((announcement, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px', '@media (max-width: 600px)': {marginRight: "20px",},}}>
            <CircleRoundedIcon sx={{ marginRight: '10px', fontSize: '16px', color: 'rgb(243, 130, 33)' }} />
            <Typography
              sx={{
                wordWrap: 'break-word',
                fontSize: { xs: '12px', sm: '14px', md: '16px' }, // Responsive font size for announcements
              }}
            >
              {announcement}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AnnouncementSection;
