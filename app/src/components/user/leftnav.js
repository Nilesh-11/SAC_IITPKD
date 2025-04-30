import React, { useState } from "react";
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router-dom";

const LeftNav = ({ menuItems, role }) => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleClick = (dash) => {
    navigate(`/${role}/dashboard?currSection=${dash}`)
  }

  return (
    <div>
      <Container>
          <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Logo */}
            <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
              <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "8px" }}>
                <img src="/sac/saclogo_horizontal.webp" alt="Logo" style={{ width: "auto", height: "auto" }} />
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
                  sx={{ mb: 1.1 }}
                >
                  <ListItemButton
                    onClick={() => handleClick(item.link)}
                    sx={{
                      transition: "background-color 0.3s ease, transform 0.2s ease",
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
                      "&:active": {
                        transform: "scale(0.97)", // 👈 Tapped shrink effect
                        transition: "transform 0.1s ease",
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
      </Container>
    </div>
  );
};

export default LeftNav;
