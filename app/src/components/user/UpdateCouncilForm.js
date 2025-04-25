import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import {
  CouncilListApi,
  UpdateCouncilApi,
  DeleteCouncilApi,
} from "../../api/admin"; // Adjust path accordingly

const UpdateCouncilForm = () => {
  const [councils, setCouncils] = useState([]);
  const [selectedCouncilId, setSelectedCouncilId] = useState("");
  const [formData, setFormData] = useState({
    council_id: "",
    email: "",
    password: "",
    name: "",
    title: "",
    description: "",
    faculty_advisor: "",
    secretary: "",
    deputy: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchCouncils = async () => {
      try {
        const res = await CouncilListApi();
        if (res?.type === "ok") {
          setCouncils(res.councils || []);
        }
      } catch (err) {
        console.error("Error fetching councils", err);
      }
    };
    fetchCouncils();
  }, []);

  const handleSelectCouncil = (e) => {
    const id = e.target.value;
    setSelectedCouncilId(id);
    const council = councils.find((c) => c.id === id);
    if (council) {
      setFormData({
        council_id: id,
        email: council.email || "",
        password: "",
        name: council.name || "",
        title: council.title || "",
        description: council.description || "",
        faculty_advisor: council.faculty_advisor || "",
        secretary: council.secretary || "",
        deputy: council.deputies || [],
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeputyChange = (e) => {
    const deputies = e.target.value.split(",").map((d) => d.trim());
    setFormData((prev) => ({ ...prev, deputy: deputies }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    setLoading(true);
    try {
      const res = await UpdateCouncilApi(formData);
      if (res?.type === "ok") {
        setMessage({ type: "success", text: "Council updated successfully!" });
      } else {
        setMessage({ type: "error", text: res?.details || "Update failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred during update." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCouncilId) return;
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await DeleteCouncilApi({ id: selectedCouncilId });
      if (res?.type === "ok") {
        setMessage({ type: "success", text: "Council deleted successfully." });
        setCouncils((prev) =>
          prev.filter((c) => c.council_id !== selectedCouncilId)
        );
        setSelectedCouncilId("");
        setFormData({
          council_id: "",
          email: "",
          password: "",
          name: "",
          title: "",
          description: "",
          faculty_advisor: "",
          secretary: "",
          deputy: [],
        });
      } else {
        setMessage({ type: "error", text: res?.details || "Deletion failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred during deletion." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <Typography
          variant="h5"
          align="center"
          sx={{ color: "rgb(243,130,33)", mb: 3 }}
        >
          Update Council
        </Typography>

        <TextField
          fullWidth
          select
          label="Select Council"
          value={selectedCouncilId}
          onChange={handleSelectCouncil}
          sx={{ mb: 3 }}
        >
          {councils.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name} ({c.title})
            </MenuItem>
          ))}
        </TextField>

        {selectedCouncilId && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} direction="column">
              {[
                { name: "email", label: "Email" },
                { name: "password", label: "Password", type: "password" },
                { name: "name", label: "Name" },
                { name: "title", label: "Title" },
                {
                  name: "description",
                  label: "Description",
                  multiline: true,
                  minRows: 3,
                },
                {
                  name: "faculty_advisor",
                  label: "Faculty Advisor (optional)",
                },
                { name: "secretary", label: "Secretary" },
              ].map(({ name, label, ...rest }) => (
                <Grid item key={name}>
                  <TextField
                    fullWidth
                    name={name}
                    label={label}
                    value={formData[name]}
                    onChange={handleChange}
                    {...rest}
                  />
                </Grid>
              ))}

              <Grid item>
                <TextField
                  fullWidth
                  name="deputy"
                  label="Deputies (comma separated)"
                  value={formData.deputy.join(", ")}
                  onChange={handleDeputyChange}
                />
              </Grid>

              {message.text && (
                <Alert severity={message.type} sx={{ mt: 2 }}>
                  {message.text}
                </Alert>
              )}

              <Grid item>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: "rgb(243,130,33)" }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : "Update Council"}
                </Button>
              </Grid>

              <Grid item>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete Council
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default UpdateCouncilForm;
