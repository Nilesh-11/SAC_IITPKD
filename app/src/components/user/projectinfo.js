import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import {
  ApplyProjectApi,
  ProjectInfoApi,
} from "../../api/projects";

const ProjectInfo = () => {
  const [searchParams] = useSearchParams();
  const project_id = searchParams.get("project_id");
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const data = await ProjectInfoApi({ project_id });
        if (data?.type === "ok") {
          setProjectData(data.data);
          setUserRole(data.data.your_status.role);
        } else {
          setError(data?.details || "Error occurred");
        }
      } catch (err) {
        setError("Failed to fetch project data");
      } finally {
        setIsLoading(false);
      }
    };

    if (project_id) fetchProjectData();
  }, [project_id]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoles([]);
    setSkills([]);
    setSkillInput("");
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  };

  const handleDeleteSkill = (chipToDelete) => {
    setSkills((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  const handleApplyProject = async () => {
    setIsSubmitting(true);
    try {
      const res = await ApplyProjectApi({
        project_id: parseInt(project_id),
        roles: selectedRoles,
        skills: skills,
      });

      if (res?.type === "ok") {
        const updatedData = await ProjectInfoApi({ project_id });
        setProjectData(updatedData.data);
        setUserRole(updatedData.data.your_status.role);
        setAlert({
          open: true,
          type: "success",
          message: res.details || "Successfully joined the project.",
        });
        handleCloseDialog();
      } else {
        setAlert({
          open: true,
          type: "error",
          message: res?.details || "Something went wrong.",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        type: "error",
        message: "An unexpected error occurred while joining the project.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!projectData) return <div>project not found</div>;

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, backgroundColor: "#fafafa" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontSize: { xs: "1.6rem", sm: "1.8rem", md: "2rem" },
        }}
      >
        {projectData.title}
      </Typography>

      <Box sx={{ px: { xs: 1, sm: 2, md: 4, lg: 6 } }}>
        <Grid
          container
          spacing={4}
          sx={{
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            justifyContent: "space-between",
          }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Box
              component="img"
              src={`/roles/${projectData.coordinator.role}_circular.png`}
              alt={`${projectData.coordinator.name} logo`}
              sx={{
                width: "100%",
                maxWidth: 260,
                height: "auto",
                borderRadius: 2,
              }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Card
              sx={{
                backgroundColor: "rgb(245,164,94)",
                color: "black",
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                ● Project Coordinator
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {projectData.coordinator.name}
              </Typography>
            </Card>

            <Card
              sx={{
                backgroundColor: "#5d5d5d",
                color: "white",
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                ● Skills
              </Typography>
              <Typography variant="body2">
                {projectData.requirements.skills.join(", ")}
              </Typography>
              <Divider sx={{ backgroundColor: "black", my: 1 }} />
              <Typography variant="h6" gutterBottom>
                ● Roles
              </Typography>
              <Typography variant="body2">
                {projectData.requirements.roles.join(", ")}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Description */}
        <Grid item xs={12} mt={4}>
          <Box
            sx={{
              backgroundColor: "#fff",
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: "1rem",
                lineHeight: 1.6,
                textAlign: "justify",
                color: "#444",
              }}
            >
              {projectData.description}
            </Typography>
          </Box>
        </Grid>
      </Box>

      {/* Meetings */}
      <Box sx={{ mt: 6, px: { xs: 2, sm: 5, md: 2 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: { xs: "1.4rem", sm: "1.6rem" },
            }}
          >
            Meetings
          </Typography>
        </Stack>

        {projectData.meetings.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "gray", fontStyle: "italic" }}
          >
            No meetings scheduled.
          </Typography>
        ) : (
          <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
            <Stack spacing={2}>
              {projectData.meetings.map((meeting, index) => (
                <Card
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {meeting.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meeting.type.charAt(0).toUpperCase() +
                        meeting.type.slice(1)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ minWidth: "150px", textAlign: "right" }}
                  >
                    {new Date(meeting.time).toLocaleString()}
                  </Typography>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Members */}
      <Box sx={{ mt: 2, px: { xs: 2, sm: 5, md: 2 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={5}
          mb={2}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: { xs: "1.4rem", sm: "1.6rem" },
            }}
          >
            Members
          </Typography>
        </Stack>

        <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1, mt: 2 }}>
          <Stack spacing={2}>
            {projectData.approved_members.map((member, index) => (
              <Card
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <Box
                    component="img"
                    src={`/roles/student_circular.png`}
                    alt="member"
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.email}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "gray",
                    fontSize: 11,
                    minWidth: "70px",
                    textAlign: "right",
                  }}
                >
                  {member.role}
                </Typography>
              </Card>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Sticky Footer Buttons */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "#fafafa",
          zIndex: 10,
          py: 2,
          mt: 5,
          borderTop: "1px solid #ddd",
        }}
      >
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ flexWrap: "wrap" }}
        >
          <Button
            variant="contained"
            onClick={handleOpenDialog}
            disabled={!!userRole}
            sx={{
              backgroundColor: userRole ? "#aaa" : "rgb(243,130,33)",
              color: "white",
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              "&:hover": {
                backgroundColor: userRole ? "#aaa" : "rgb(220,100,30)",
              },
            }}
          >
            {userRole ? `${userRole}` : "Join project"}
          </Button>
        </Stack>
      </Box>

      {/* Dialog for Applying to Project */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Join Project</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Stack spacing={2}>
            <Autocomplete
              multiple
              options={projectData.requirements.roles}
              getOptionLabel={(option) => option}
              value={selectedRoles}
              onChange={(e, value) => setSelectedRoles(value)}
              renderInput={(params) => (
                <TextField {...params} label="Select Roles" />
              )}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Enter Skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                fullWidth
              />
              <Button
                variant="outlined"
                onClick={handleAddSkill}
                sx={{
                  minWidth: 40,
                  height: "100%",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                }}
              >
                ➕
              </Button>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              {skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleDeleteSkill(skill)}
                />
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderColor: "gray",
              color: "gray",
              borderRadius: 2,
              textTransform: "none",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplyProject}
            variant="contained"
            disabled={isSubmitting}
            sx={{
              backgroundColor: "rgb(243,130,33)",
              color: "white",
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: isSubmitting
                  ? "rgb(243,130,33)"
                  : "rgb(220,100,30)",
              },
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.type}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectInfo;
