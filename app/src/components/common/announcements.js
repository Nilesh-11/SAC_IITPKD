import React, { useState, useRef } from 'react';
import { Button, Box, Typography, Divider, ThemeProvider } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';

const AnnouncementSection = ({announcements}) => {
  console.log(announcements);
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
            marginRight={2}
            sx={{ fontFamily: 'Poppins, sans-serif', fontSize: {xs: '1.4rem', sm: '1.6rem', md: '1.8rem',}}}>
            Announcements
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
            <React.Fragment key={announcement.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  '@media (max-width: 600px)': {
                    marginRight: '20px',
                  },
                }}
                >
                <CircleRoundedIcon
                  sx={{
                    marginRight: '10px',
                    fontSize: '16px',
                    color: 'rgb(243, 130, 33)',
                  }}
                  />
                <Typography
                  sx={{
                    wordWrap: 'break-word',
                    fontSize: {
                      xs: '0.8rem',
                      sm: '0.9rem',
                      md: '1rem',
                    },
                  }}
                  >
                  {announcement.body}
                </Typography>
              </Box>
              {index < displayedAnnouncements.length - 1 && (
                <Divider sx={{ margin: '15px auto', width: '80%' }} />
              )}
            </React.Fragment>
          ))}

        </Box>
      </Box>
  );
};

export default AnnouncementSection;
