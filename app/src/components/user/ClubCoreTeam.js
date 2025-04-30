import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputAdornment from '@mui/material/InputAdornment';
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import {
  FaTimes as Close,
  FaInfoCircle as InfoOutlined,
  FaSearch as Search,
  FaUsers as Groups,
  FaFilter as FilterAltOutlined,
} from "react-icons/fa";
import { CoreTeamApi } from "../../api/club";
import { useSearchParams } from "react-router-dom";
import CoreTeamHeader from "./ClubHeader";

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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },
  },
});

const ClubCoreTeam = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [searchParams] = useSearchParams();
  const clubEmail = searchParams.get("club_email");
  const clubTitle = searchParams.get("club_title");
  const [coreTeam, setCoreTeam] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedMember, setSelectedMember] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchCoreTeam = async () => {
      setLoading(true);
      setMessage({ type: "", text: "" });

      try {
        const res = await CoreTeamApi({ club_email: clubEmail });
        if (res?.type === "ok") {
          setCoreTeam(res.core_team);
          setFilteredTeam(res.core_team);
        } else {
          setMessage({
            type: "error",
            text: res?.details || "Failed to fetch core team",
          });
        }
      } catch (err) {
        setMessage({
          type: "error",
          text: "An error occurred while fetching the core team.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (clubEmail) fetchCoreTeam();
  }, [clubEmail]);

  useEffect(() => {
    filterMembers();
  }, [searchTerm, roleFilter, coreTeam]);

  const filterMembers = () => {
    let result = [...coreTeam];

    if (searchTerm) {
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (member.role_title &&
            member.role_title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((member) => {
        if (roleFilter === "regular") {
          return member.role_title && !member.role_title.startsWith("ex-");
        } else if (roleFilter === "ex") {
          return member.role_title && member.role_title.startsWith("ex-");
        }
        return true;
      });
    }

    setFilteredTeam(result);
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMember(null);
  };

  const getGridColumns = () => {
    if (isMobile) return 12;
    if (isTablet) return 6;
    return 4;
  };

  const getAvatarSize = () => {
    return isMobile ? 40 : 48;
  };

  return (
    <ThemeProvider theme={orangeTheme}>
      <CoreTeamHeader
        memberCount={filteredTeam.length}
        title={clubTitle}
      ></CoreTeamHeader>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: isMobile ? 1 : 3,
          pt: isMobile ? 1 : 2, // smaller top padding
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.2)), url('/bg1.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 2 : 4,
            width: "100%",
            maxWidth: 1200,
            borderRadius: 4,
            backgroundColor: "background.paper",
            boxShadow: "0 8px 24px rgba(243, 130, 33, 0.1)",
          }}
        >
          {/* Message Alert */}
          {message.text && (
            <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
              {message.text}
            </Alert>
          )}

          {/* Filters Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              mb: 4,
              p: 3,
              backgroundColor: "action.hover",
              borderRadius: 3,
            }}
          >
            <TextField
              size="small"
              placeholder="Search members..."
              fullWidth={isMobile}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search style={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              select
              size="small"
              label="Filter by role"
              fullWidth={isMobile}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterAltOutlined
                      style={{
                        fontSize: "1rem",
                        color: theme.palette.text.secondary,
                      }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="regular">Current Members</MenuItem>
              <MenuItem value="ex">Former Members</MenuItem>
            </TextField>
          </Box>

          {/* Content Section */}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 300,
              }}
            >
              <CircularProgress size={isMobile ? 40 : 50} color="primary" />
            </Box>
          ) : filteredTeam.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 300,
                textAlign: "center",
                p: 3,
                backgroundColor: "action.hover",
                borderRadius: 3,
              }}
            >
              <Groups
                style={{
                  fontSize: 48,
                  color: theme.palette.text.disabled,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "text.disabled",
                  mt: 2,
                  fontWeight: 500,
                }}
              >
                No members found matching your criteria
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 3 }}
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                }}
                size={isMobile ? "small" : "medium"}
              >
                Reset Filters
              </Button>
            </Box>
          ) : (
            <Grid
              container
              spacing={isMobile ? 2 : 3}
              sx={{
                mt: 1,
                mb: 2,
              }}
            >
              {filteredTeam.map((member) => (
                <Grid item xs={getGridColumns()} key={member.user_id}>
                  <Card
                    elevation={0}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      borderRadius: 3,
                      transition: "all 0.2s ease",
                      backgroundColor: "background.paper",
                      border: `1px solid ${theme.palette.divider}`,
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 20px rgba(243, 130, 33, 0.15)",
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        cursor: "pointer",
                        pb: 0,
                      }}
                      onClick={() => handleMemberClick(member)}
                    >
                      <Avatar
                        sx={{
                          width: getAvatarSize(),
                          height: getAvatarSize(),
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          fontSize: isMobile ? 16 : 20,
                        }}
                      >
                        {member.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant={isMobile ? "subtitle1" : "h6"}
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                        >
                          {member.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Chip
                            label={member.role_title || "No role"}
                            size={isMobile ? "small" : "medium"}
                            color={
                              member.role_title?.startsWith("ex-")
                                ? "default"
                                : "primary"
                            }
                            variant="outlined"
                            sx={{
                              fontWeight: 500,
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end", p: 1 }}>
                      <Tooltip title="View details">
                        <IconButton
                          onClick={() => handleMemberClick(member)}
                          size="small"
                          sx={{
                            color: "text.secondary",
                            "&:hover": {
                              color: "primary.main",
                            },
                          }}
                        >
                          <InfoOutlined
                            fontSize={isMobile ? "0.875rem" : "1rem"}
                          />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Member Details Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            fullWidth
            fullScreen={isMobile}
            maxWidth="sm"
            PaperProps={{
              sx: {
                borderRadius: isMobile ? 0 : 3,
                backgroundColor: "background.paper",
              },
            }}
          >
            {selectedMember && (
              <>
                <DialogTitle
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    p: isMobile ? 1.5 : 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: "background.paper",
                        color: "primary.main",
                        width: isMobile ? 32 : 40,
                        height: isMobile ? 32 : 40,
                      }}
                    >
                      {selectedMember.name.charAt(0)}
                    </Avatar>
                    <Typography variant={isMobile ? "subtitle1" : "h6"}>
                      {selectedMember.name}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={handleCloseDialog}
                    sx={{ color: "primary.contrastText" }}
                  >
                    <Close />
                  </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Grid container spacing={isMobile ? 1 : 3}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          mb: 1,
                        }}
                      >
                        Basic Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              fontWeight: 500,
                              mb: 0.5,
                            }}
                          >
                            Email
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {selectedMember.email}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              fontWeight: 500,
                              mb: 0.5,
                            }}
                          >
                            Club
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {selectedMember.club_name}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          mb: 1,
                        }}
                      >
                        Role Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 500,
                            mb: 0.5,
                          }}
                        >
                          Role Title
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedMember.role_title || "No role assigned"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: isMobile ? 1.5 : 2 }}>
                  <Button
                    onClick={handleCloseDialog}
                    variant="contained"
                    color="primary"
                    fullWidth={isMobile}
                  >
                    Close
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ClubCoreTeam;
