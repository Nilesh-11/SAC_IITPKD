import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Chip,
  InputAdornment,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import {
  OwnProjectsApi,
  UpdateProjectApi,
  DeleteProjectApi,
} from "../../api/projects";

const UpdateProjectForm = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    proj_type: "",
    proj_domain: "",
    skills: [],
    member_roles: [],
    start_date: "",
    end_date: "",
    max_members_count: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const orange = "rgb(243,130,33)";
  const darkOrange = "rgb(220,110,25)";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await OwnProjectsApi();
        if (res?.type === "ok") {
          setProjects(res.projects);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchProjects();
  }, []);

  const handleSelectProject = (e) => {
    const projectId = e.target.value;
    const project = projects.find((p) => p.id === projectId);
    setSelectedProjectId(projectId);
    if (project) {
      setFormData({
        id: project.id,
        title: project.title || "",
        description: project.description || "",
        proj_type: project.project_type || "",
        proj_domain: project.domain || "",
        skills: project.skills_required || [],
        member_roles: project.member_roles || [],
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        max_members_count: project.max_members_count || "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addToList = (input, setInput, listKey) => {
    const trimmed = input.trim();
    if (trimmed && !formData[listKey].includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        [listKey]: [...prev[listKey], trimmed],
      }));
      setInput("");
    }
  };

  const removeFromList = (index, listKey) => {
    const updated = [...formData[listKey]];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [listKey]: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await UpdateProjectApi(formData);
      if (res?.type === "ok") {
        setMessage({ type: "success", text: "Project updated successfully!" });
      } else {
        setMessage({ type: "error", text: res?.details || "Update failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error while updating." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await DeleteProjectApi({ id: selectedProjectId });
      if (res?.type === "ok") {
        setMessage({ type: "success", text: "Project deleted successfully." });
        setProjects((prev) =>
          prev.filter((p) => p.id !== selectedProjectId)
        );
        setSelectedProjectId("");
        setFormData({
          id: null,
          title: "",
          description: "",
          proj_type: "",
          proj_domain: "",
          skills: [],
          member_roles: [],
          start_date: "",
          end_date: "",
          max_members_count: "",
        });
      } else {
        setMessage({ type: "error", text: res?.details || "Deletion failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error while deleting." });
    } finally {
      setLoading(false);
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fafafa",
      "& fieldset": { borderColor: "#d1d1d1" },
      "&:hover fieldset": { borderColor: "#b0b0b0" },
      "&.Mui-focused fieldset": {
        borderColor: orange,
        boxShadow: `0 0 0 2px rgba(243,130,33,0.2)`,
      },
    },
    "& label": { color: "#666" },
    "& label.Mui-focused": { color: orange },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <Typography variant="h5" align="center" sx={{ color: orange, mb: 3 }}>
          Update Project
        </Typography>

        <TextField
          fullWidth
          select
          label="Select Project"
          value={selectedProjectId}
          onChange={handleSelectProject}
          sx={{ mb: 3, ...textFieldSx }}
        >
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.title}
            </MenuItem>
          ))}
        </TextField>

        {selectedProjectId && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ flexDirection: "column" }}>
              {[
                { name: "title", label: "Project Title" },
                {
                  name: "description",
                  label: "Description",
                  multiline: true,
                  minRows: 4,
                },
                { name: "proj_type", label: "Project Type" },
                { name: "proj_domain", label: "Project Domain" },
                { name: "start_date", label: "Start Date", type: "date" },
                { name: "end_date", label: "End Date", type: "date" },
                {
                  name: "max_members_count",
                  label: "Max Members",
                  type: "number",
                },
              ].map(({ name, label, ...rest }) => (
                <Grid item xs={12} key={name}>
                  <TextField
                    fullWidth
                    name={name}
                    label={label}
                    value={formData[name]}
                    onChange={handleChange}
                    sx={textFieldSx}
                    {...rest}
                    InputLabelProps={
                      rest.type === "date" ? { shrink: true } : undefined
                    }
                  />
                </Grid>
              ))}

              {[
                {
                  label: "Add Skill",
                  value: skillInput,
                  onChange: setSkillInput,
                  onAdd: () => addToList(skillInput, setSkillInput, "skills"),
                  list: formData.skills,
                  onRemove: (i) => removeFromList(i, "skills"),
                },
                {
                  label: "Add Member Role",
                  value: roleInput,
                  onChange: setRoleInput,
                  onAdd: () =>
                    addToList(roleInput, setRoleInput, "member_roles"),
                  list: formData.member_roles,
                  onRemove: (i) => removeFromList(i, "member_roles"),
                },
              ].map(({ label, value, onChange, onAdd, list, onRemove }, idx) => (
                <React.Fragment key={idx}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={label}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      sx={textFieldSx}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              onClick={onAdd}
                              sx={{
                                backgroundColor: orange,
                                "&:hover": { backgroundColor: darkOrange },
                              }}
                              variant="contained"
                            >
                              <FaUserPlus />
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {list.map((item, i) => (
                        <Chip
                          key={i}
                          label={item}
                          onDelete={() => onRemove(i)}
                          deleteIcon={<FaTimes />}
                        />
                      ))}
                    </Box>
                  </Grid>
                </React.Fragment>
              ))}

              {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                  {message.text}
                </Alert>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: orange }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : "Update Project"}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete Project
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default UpdateProjectForm;
