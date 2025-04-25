import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import { FaBars } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

import LeftNav from "../../components/user/leftnav";
import RightNavbar from "../../components/user/rightnav";

const Header = ({
  menuItems,
  userrole,
}) => {
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={3}
        sx={{ bgcolor: "#fff", color: "black" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            onClick={() => setIsLeftDrawerOpen(true)}
            sx={{ color: "rgb(243, 130, 33)" }}
          >
            <FaBars size={24} />
          </IconButton>

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

          {!isRightDrawerOpen && (
            <IconButton
              edge="end"
              onClick={() => setIsRightDrawerOpen(true)}
              sx={{
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <FaUserCircle size={40} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

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
        <LeftNav menuItems={menuItems} role={userrole} />
      </Drawer>

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
          onClose={() => setIsRightDrawerOpen(false)}
        />
      </Drawer>

      <Toolbar />
    </Box>
  );
};

export default Header;
