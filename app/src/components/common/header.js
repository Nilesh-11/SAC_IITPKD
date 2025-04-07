import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, useMediaQuery, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);

  // Detect screen size using media queries
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const opacity = Math.min(scrollY / 500, 1);
  const textColor = scrollY > 100 ? '#fff' : 'black';

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  return (
    <AppBar
      position="sticky"
      sx={{
        background: `rgba(0, 0, 0, ${opacity})`,
        backgroundImage: 'url("/background.jpg")',
        backgroundSize: 'cover',
        padding: '10px 0',
        transition: 'background 0.3s ease',
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <img src="/sac/saclogo_horizontal.png" alt="Logo" height={isSmallScreen ? 30 : 40} />
        </Box>

        {/* If on small screen, show hamburger menu */}
        {isSmallScreen ? (
          <IconButton
            color="inherit"
            onClick={toggleDrawer}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              color="inherit"
              href="#home"
              sx={{
                '&:hover': {
                  color: '#fff',
                  backgroundColor: 'transparent',
                },
                color: textColor,
                textTransform: 'none',
                transition: 'color 0.3s ease',
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              href="#about-us"
              sx={{
                '&:hover': {
                  color: '#fff',
                  backgroundColor: 'transparent',
                },
                color: textColor,
                textTransform: 'none',
                transition: 'color 0.3s ease',
              }}
            >
              About Us
            </Button>
            <Button
              color="inherit"
              href="#councils"
              sx={{
                '&:hover': {
                  color: '#fff',
                  backgroundColor: 'transparent',
                },
                color: textColor,
                textTransform: 'none',
                transition: 'color 0.3s ease',
              }}
            >
              Councils
            </Button>
            <Button
              color="inherit"
              href="#announcements"
              sx={{
                '&:hover': {
                  color: '#fff',
                  backgroundColor: 'transparent',
                },
                color: textColor,
                textTransform: 'none',
                transition: 'color 0.3s ease',
              }}
            >
              Announcements
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'rgb(243, 130, 33)',
                color: 'black',
                textTransform: 'none',
                border: 'none',
                '&:hover': {
                  backgroundColor: 'rgb(243, 130, 33)',
                  color: '#fff',
                },
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
            >
              Sign In
            </Button>
          </Box>
        )}
      </Toolbar>

      {/* Drawer for small screen navigation */}
      <Drawer
  anchor="right"
  open={openDrawer}
  onClose={toggleDrawer}
  sx={{
    '& .MuiDrawer-paper': {
      width: '240px', // Width of the drawer
      padding: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Slightly transparent dark background
      transition: 'background-color 0.3s ease', // Smooth transition for background color
    },
  }}
>
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <Button
      color="inherit"
      href="#home"
      sx={{
        color: '#fff',
        textTransform: 'none',
        marginBottom: '10px',
        transition: 'color 0.3s ease', // Smooth color transition for buttons
      }}
    >
      Home
    </Button>
    <Button
      color="inherit"
      href="#about-us"
      sx={{
        color: '#fff',
        textTransform: 'none',
        marginBottom: '10px',
        transition: 'color 0.3s ease', // Smooth color transition for buttons
      }}
    >
      About Us
    </Button>
    <Button
      color="inherit"
      href="#councils"
      sx={{
        color: '#fff',
        textTransform: 'none',
        marginBottom: '10px',
        transition: 'color 0.3s ease', // Smooth color transition for buttons
      }}
    >
      Councils
    </Button>
    <Button
      color="inherit"
      href="#announcements"
      sx={{
        color: '#fff',
        textTransform: 'none',
        marginBottom: '10px',
        transition: 'color 0.3s ease', // Smooth color transition for buttons
      }}
    >
      Announcements
    </Button>
    <Button
      variant="contained"
      sx={{
        backgroundColor: 'rgb(243, 130, 33)',
        color: 'black',
        textTransform: 'none',
        border: 'none',
        '&:hover': {
          backgroundColor: 'rgb(243, 130, 33)',
          color: '#fff',
        },
        transition: 'background-color 0.3s ease, color 0.3s ease', // Smooth hover transition
      }}
    >
      Sign In
    </Button>
  </Box>
</Drawer>

    </AppBar>
  );
};

export default Header;
