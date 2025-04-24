import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Button, Box, useMediaQuery, IconButton, Drawer, Menu, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MdMenu, MdArrowDropDown } from 'react-icons/md';

const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorElPG, setAnchorElPG] = useState(null);
  const [anchorElMore, setAnchorElMore] = useState(null);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = Math.min(scrollY / 500, 1);
  const textColor = scrollY > 100 ? '#fff' : 'black';
  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const handleMenuOpen = (setter) => (event) => setter(event.currentTarget);
  const handleMenuClose = (setter) => () => setter(null);

  const navButton = (label, path) => (
    <Button
      color="inherit"
      onClick={() => navigate(path)}
      sx={{
        '&:hover': { color: '#fff', backgroundColor: 'transparent' },
        color: textColor,
        textTransform: 'none',
        transition: 'color 0.3s ease',
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        background: `rgba(0, 0, 0, ${opacity})`,
        backgroundImage: 'url("/background.webp")',
        backgroundSize: 'cover',
        padding: '10px 0',
        transition: 'background 0.3s ease',
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <img src="/sac/saclogo_horizontal.png" alt="Logo" height={isSmallScreen ? 30 : 40} />
        </Box>

        {isSmallScreen ? (
          <IconButton
            color="inherit"
            onClick={toggleDrawer}
            sx={{ color: 'rgb(243, 130, 33)' }}
          >
            <MdMenu size={24} />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {navButton('Home', '/')}
            {navButton('Academics', '/academics')}

            <Button
              color="inherit"
              onClick={handleMenuOpen(setAnchorElPG)}
              endIcon={<MdArrowDropDown />}
              sx={{
                '&:hover': { color: '#fff', backgroundColor: 'transparent' },
                color: textColor,
                textTransform: 'none',
                transition: 'color 0.3s ease',
              }}
            >
              PG/Research
            </Button>
            <Menu anchorEl={anchorElPG} open={Boolean(anchorElPG)} onClose={handleMenuClose(setAnchorElPG)}>
              <MenuItem onClick={() => { navigate('/post-graduate'); setAnchorElPG(null); }}>PG</MenuItem>
              <MenuItem onClick={() => { navigate('/research'); setAnchorElPG(null); }}>Research</MenuItem>
            </Menu>

            {navButton('Technical', '/technical')}
            {navButton('Cultural', '/cultural')}
            {navButton('Hostel', '/hostel')}
            {navButton('Sports', '/sports')}

            <Button
              color="inherit"
              onClick={handleMenuOpen(setAnchorElMore)}
              endIcon={<MdArrowDropDown />}
              sx={{
                '&:hover': { color: '#fff', backgroundColor: 'transparent' },
                color: textColor,
                textTransform: 'none',
                transition: 'color 0.3s ease',
              }}
            >
              More
            </Button>
            <Menu anchorEl={anchorElMore} open={Boolean(anchorElMore)} onClose={handleMenuClose(setAnchorElMore)}>
              <MenuItem onClick={() => { navigate('/developers'); setAnchorElMore(null); }}>Developers</MenuItem>
            </Menu>

            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                backgroundColor: 'rgb(243, 130, 33)',
                color: 'black',
                textTransform: 'none',
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

      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: '240px',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {[ 
            { label: 'Home', path: '/' },
            { label: 'Academics', path: '/academics' },
            { label: 'PG', path: '/post-graduate' },
            { label: 'Research', path: '/research' },
            { label: 'Technical', path: '/technical' },
            { label: 'Cultural', path: '/cultural' },
            { label: 'Hostel', path: '/hostel' },
            { label: 'Sports', path: '/sports' },
            { label: 'Developers', path: '/developers' },
          ].map(({ label, path }) => (
            <Button
              key={path}
              color="inherit"
              onClick={() => {
                navigate(path);
                toggleDrawer();
              }}
              sx={{
                color: '#fff',
                textTransform: 'none',
                marginBottom: '10px',
                transition: 'color 0.3s ease',
              }}
            >
              {label}
            </Button>
          ))}

          <Button
            variant="contained"
            onClick={() => {
              navigate('/login');
              toggleDrawer();
            }}
            sx={{
              backgroundColor: 'rgb(243, 130, 33)',
              color: 'black',
              textTransform: 'none',
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
      </Drawer>
    </AppBar>
  );
};

export default Header;
