import React, { useState } from "react";
import { Container, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Divider } from "@mui/material";
import { Menu } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom"; // For navigation

// LeftNav Component with `handleClick` as a prop
const LeftNav = ({ menuItems, handleClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Default handleClick if not provided
  const defaultHandleClick = (link) => {
    if (handleClick) {
      handleClick(link); // Use passed-in handleClick function
    } else {
      console.error("handleClick prop is required!");
    }
    setIsOpen(false); // Close the drawer after navigation
  };

  return (
    <div>
      {/* Hamburger Menu Button */}
      <button
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 50,
          backgroundColor: "#F97316",
          padding: "8px",
          borderRadius: "8px",
          color: "white",
        }}
        onClick={() => setIsOpen(true)}
      >
        <Menu />
      </button>

      {/* Drawer with Menu Items */}
      <Container>
        <Drawer
          anchor="left"
          open={isOpen}
          onClose={() => setIsOpen(false)}
          transitionDuration={500}
          sx={{
            "& .MuiDrawer-paper": {
              width: 250,
              backgroundColor: "#ffffff",
              minHeight: "100vh",
              padding: 2,
              boxShadow: 3,
              overflow: "hidden", // Hide the scrollbar
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Logo */}
            <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
              <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "8px" }}>
                <img src="saclogo_horizontal.png" alt="Logo" style={{ width: "auto", height: "auto" }} />
              </div>
            </Box>

            <Divider sx={{ marginBottom: 2 }} />

            {/* Menu List */}
            <List>
              {menuItems.map((item, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <ListItemButton
                    onClick={() => defaultHandleClick(item.link)} // Calls the passed handleClick prop
                    sx={{
                      transition: "background-color 0.3s ease, transform 0.3s",
                      borderRadius: "8px",
                      backgroundColor:
                        hoveredIndex === index
                          ? "rgb(255, 153, 65)"
                          : hoveredIndex === index - 1 || hoveredIndex === index + 1
                          ? "rgb(255, 204, 160)"
                          : "rgb(255, 229, 215)",
                      "&:hover": {
                        backgroundColor: "rgb(255, 153, 65)",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Container>
    </div>
  );
};

export default LeftNav;
