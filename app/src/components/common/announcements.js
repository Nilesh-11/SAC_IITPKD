import React, { useState, useCallback, useRef, memo } from 'react';
import { Typography, Divider, Box, Button } from '@mui/material';
import { MdPlayArrow, MdCircle } from 'react-icons/md';

const AnnouncementItem = memo(({ announcement }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px', '@media (max-width: 600px)': { mr: '20px' } }}>
    <MdCircle style={{ marginRight: '10px', fontSize: '16px', color: 'rgb(243, 130, 33)' }} />
    <Typography sx={{ wordWrap: 'break-word', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
      {announcement.body}
    </Typography>
  </Box>
));

const NavButton = memo(({ onClick, visible, rotate }) => (
  <Button
    onClick={onClick}
    variant="outlined"
    sx={{
      width: '25px',
      height: '25px',
      minWidth: '20px',
      borderRadius: '10%',
      mr: rotate ? '10px' : 0,
      display: visible ? 'flex' : 'none',
      p: 0,
      backgroundColor: 'rgb(243, 130, 33)',
      border: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': { backgroundColor: 'rgb(243, 130, 33)' },
    }}
  >
    <MdPlayArrow style={{
      fontSize: '18px',
      transform: rotate ? 'rotate(180deg)' : 'rotate(0deg)',
      color: 'rgb(250, 199, 170)',
    }} />
  </Button>
));

const AnnouncementSection = ({ announcements = [] }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 3;
  const containerRef = useRef(null);

  const displayedAnnouncements = announcements.slice(startIndex, startIndex + itemsToShow);
  const canGoNext = startIndex + itemsToShow < announcements.length;
  const canGoPrev = startIndex > 0;

  const handleNext = useCallback(() => {
    if (containerRef.current?.scrollHeight <= containerRef.current?.clientHeight + containerRef.current?.scrollTop) {
      if (canGoNext) setStartIndex(prev => prev + itemsToShow);
    }
  }, [canGoNext]);

  const handlePrev = useCallback(() => {
    if (canGoPrev) setStartIndex(prev => prev - itemsToShow);
  }, [canGoPrev]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '8px',
      p: '10px',
      width: '100%',
      maxWidth: '740px',
      minWidth: '300px',
      overflow: 'hidden',
      margin: '0 auto',
      '@media (max-width: 600px)': { minWidth: '100%', maxWidth: '100%' },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
        <Typography sx={{ mr: 2, fontFamily: 'Poppins, sans-serif', fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' } }}>
          Announcements
        </Typography>

        <NavButton onClick={handlePrev} visible={canGoPrev} rotate />
        <NavButton onClick={handleNext} visible={canGoNext} rotate={false} />
      </Box>

      <Box sx={{ backgroundColor: 'rgb(243, 130, 33)', width: '26%', mb: '10px', height: '6px', borderRadius: '10px' }} />

      <Box sx={{ mb: '10px' }} ref={containerRef}>
        {announcements.length === 0 ? (
          <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, fontStyle: 'italic', color: 'gray', textAlign: 'center', mt: '20px' }}>
            No announcements available.
          </Typography>
        ) : (
          displayedAnnouncements.map((announcement, index) => (
            <React.Fragment key={announcement.id}>
              <AnnouncementItem announcement={announcement} />
              {index < displayedAnnouncements.length - 1 && <Divider sx={{ m: '15px auto', width: '80%' }} />}
            </React.Fragment>
          ))
        )}
      </Box>
    </Box>
  );
};

export default memo(AnnouncementSection);
