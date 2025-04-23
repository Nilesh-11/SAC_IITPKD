import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import LeftNav from "../../components/user/leftnav";
import RightNavbar from "../../components/user/rightnav";

const Header = ({ menuItems, handleMenuNavigation, recentActivity, liveEvents, username, userrole }) => {
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={3} sx={{ bgcolor: "#fff", color: "black" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Menu Button */}
          <IconButton
            edge="start"
            onClick={() => setIsLeftDrawerOpen(true)}
            sx={{ color: "rgb(243, 130, 33)" }}
          >
            <MenuIcon />
          </IconButton>

          {/* Centered Logo */}
          <Box
            component="img"
            src="/sac/saclogo_horizontal.png"
            alt="Logo"
            sx={{
              height: 40,
              margin: "auto",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />

          {/* Right Avatar */}
          {!isRightDrawerOpen && (
            <IconButton
              edge="end"
              onClick={() => setIsRightDrawerOpen(true)}
              sx={{
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <Avatar src="logo192.png" sx={{ width: 40, height: 40 }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Left Drawer */}
      <Drawer
        anchor="left"
        open={isLeftDrawerOpen}
        onClose={() => setIsLeftDrawerOpen(false)}
        transitionDuration={400}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            backgroundColor: "#fff",
            minHeight: "100vh",
            p: 2,
            boxShadow: 4,
            overflowY: "auto",
          },
        }}
      >
        <LeftNav menuItems={menuItems} handleClick={handleMenuNavigation} />
      </Drawer>

      {/* Right Drawer */}
      <Drawer
        anchor="right"
        open={isRightDrawerOpen}
        onClose={() => setIsRightDrawerOpen(false)}
        transitionDuration={400}
        sx={{
            "& .MuiDrawer-paper": {
            width: { xs: "80vw", sm: 350 },
            maxWidth: 400,
            p: 2,
            boxShadow: 4,
            overflowY: "auto",
            },
        }}
        >

        <RightNavbar
          username={username}
          userrole={userrole}
          liveEvents={liveEvents}
          activity={recentActivity}
          onClose={() => setIsRightDrawerOpen(false)}
        />
      </Drawer>

      {/* Spacer for fixed AppBar */}
      <Toolbar />
    </Box>
  );
};

export default Header;
