import { FaPlus } from "react-icons/fa";

import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  MyProjectListApi,
  AddProjectMeetingApi,
  DeleteMeetingApi,
  UpdateMeetingApi,
} from "../../api/projects";
import AddMeetingForm from "./AddMeetingForm";
import UpdateMeetingForm from "./UpdateMeetingForm";
import MeetingList from "./MeetingsList"; // Import the new MeetingList component
import UnverifiedMembersList from "./UnverifiedMembersList"; // Import UnverifiedMembersList component
import { ShortlistMemberApi } from "../../api/projects"; // Add this line
import VerifyRoleDialog from "./VerifyRoleDialog"; // Add this line
import ApprovedMembersList from "./ApprovedMembersList";
import { RemoveMemberApi } from "../../api/projects"; // New import

const orange = "rgb(243,130,33)";

const ManageProject = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editMeeting, setEditMeeting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await MyProjectListApi();
      if (res?.type === "ok") {
        setProjects(res.projects);
        if (selectedProject) {
          const refreshedProject = res.projects.find(
            (p) => p.id === selectedProject.id
          );
          setSelectedProject(refreshedProject);
        }
      }
    } catch (err) {
      console.error("Error fetching projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddMeeting = async (formData) => {
    const res = await AddProjectMeetingApi(formData);
    if (res?.type === "ok") {
      fetchProjects();
      setOpenAddDialog(false);
    }
  };

  const handleDeleteMeeting = async (meeting_id) => {
    if (!selectedProject) return;

    const res = await DeleteMeetingApi({
      project_id: selectedProject.id,
      meeting_id: meeting_id,
    });

    if (res?.type === "ok") {
      fetchProjects();
      setOpenAddDialog(false);
    }
  };

  const handleUpdateMeeting = async (formData) => {
    const res = await UpdateMeetingApi(formData);
    if (res?.type === "ok") {
      fetchProjects();
      setEditMeeting(null);
    }
  };

  const handleVerify = (member) => {
    setSelectedMember(member);
    setVerifyDialogOpen(true);
  };

  const handleConfirmVerification = async (role) => {
    if (!selectedProject || !selectedMember) return;
    const payload = {
      participant_id: selectedMember.id,
      project_id: selectedProject.id,
      is_approved: true,
      role,
    };

    const res = await ShortlistMemberApi(payload);
    if (res?.type === "ok") {
      fetchProjects();
    }

    setVerifyDialogOpen(false);
    setSelectedMember(null);
  };

  const handleRemove = async (member) => {
    if (!selectedProject) return;

    const payload = {
      participant_id: member.id,
      project_id: selectedProject.id,
      is_approved: false,
      role: "",
    };

    const res = await ShortlistMemberApi(payload);
    if (res?.type === "ok") {
      fetchProjects();
    }
  };

  const handleRemoveApprovedMember = async (member) => {
    if (!selectedProject) return;

    const res = await RemoveMemberApi({
      project_id: selectedProject.id,
      member: member.email,
    });

    if (res?.type === "ok") {
      fetchProjects();
    }
  };

  return (
    <Box sx={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.2)), url('/bg1.webp')`,
        p: 4,
      }}>
      <Typography variant="h4" sx={{ color: orange, mb: 3 }}>
        Manage Projects
      </Typography>

      <TextField
        fullWidth
        select
        label="Select Project"
        value={selectedProject?.id || ""}
        onChange={(e) => {
          const proj = projects.find((p) => p.id === parseInt(e.target.value));
          setSelectedProject(proj);
        }}
        sx={{ mb: 3 }}
      >
        {projects.map((project) => (
          <MenuItem key={project.id} value={project.id}>
            {project.title}
          </MenuItem>
        ))}
      </TextField>

      {loading ? (
        <CircularProgress />
      ) : selectedProject ? (
        <>
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

            <Button
              variant="contained"
              onClick={() => setOpenAddDialog(true)}
              sx={{
                backgroundColor: orange,
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(243,130,33,0.8)" },
              }}
              startIcon={<FaPlus />}
            >
              New Meeting
            </Button>
          </Stack>

          <MeetingList
            meetings={selectedProject?.meetings || []}
            onEditMeeting={setEditMeeting}
            onDeleteMeeting={handleDeleteMeeting}
          />

          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: { xs: "1.4rem", sm: "1.6rem" },
              mt: 4,
            }}
          >
            Unverified Members
          </Typography>

          <UnverifiedMembersList
            unverifiedMembers={selectedProject?.unverified_participants || []}
            onVerify={handleVerify}
            onRemove={handleRemove}
          />

          <VerifyRoleDialog
            open={verifyDialogOpen}
            onClose={() => setVerifyDialogOpen(false)}
            onConfirm={handleConfirmVerification}
            roles={selectedMember?.roles_applied || []}
          />

          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: { xs: "1.4rem", sm: "1.6rem" },
              mt: 4,
            }}
          >
            Approved Members
          </Typography>

          <ApprovedMembersList
            approvedMembers={selectedProject?.approved_participants || []}
            onRemove={handleRemoveApprovedMember}
          />
        </>
      ) : (
        <Typography>Select a project to manage meetings.</Typography>
      )}

      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <AddMeetingForm
          project={selectedProject}
          onCancel={() => setOpenAddDialog(false)}
          onSubmit={handleAddMeeting}
        />
      </Dialog>

      <Dialog
        open={!!editMeeting}
        onClose={() => setEditMeeting(null)}
        maxWidth="sm"
        fullWidth
      >
        {editMeeting && (
          <UpdateMeetingForm
            meeting={editMeeting}
            project={selectedProject}
            onCancel={() => setEditMeeting(null)}
            onSubmit={handleUpdateMeeting}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default ManageProject;
