import {
  AppBar,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme,
  Chip,
  Typography,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { FaUsers as Groups } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const orangeTheme = createTheme({
  palette: {
    primary: {
      main: "rgb(243, 130, 33)",
      contrastText: "#fff",
    },
    secondary: {
      main: "rgb(255, 167, 97)",
    },
    background: {
      default: "rgb(255, 248, 243)",
      paper: "#ffffff",
    },
    text: {
      primary: "rgb(51, 51, 51)",
      secondary: "rgb(102, 102, 102)",
    },
    action: {
      hover: "rgba(243, 130, 33, 0.08)",
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

const CoreTeamHeader = ({ memberCount, title }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={orangeTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            bgcolor: "#fff",
            color: "text.primary",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box
              component="img"
              src="/sac/saclogo_horizontal.png"
              alt="Logo"
              onClick={() => navigate("/")}
              sx={{
                height: 40,
                cursor: "pointer",
                mr: 2,
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: 'rgb(243, 130, 33)',
                }}
              >
                <Groups fontSize={isMobile ? 20 : 24} />
                {!isMobile && (
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {title}
                  </Typography>
                )}
              </Box>

              <Chip
                label={`${memberCount} Members`}
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        <Toolbar />
      </Box>
    </ThemeProvider>
  );
};

export default CoreTeamHeader;