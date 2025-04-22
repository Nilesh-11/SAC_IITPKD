import React from "react";
import {
  Box,
  Typography,
  Card,
  Stack,
  Button,
  Chip,
} from "@mui/material";

const orange = "rgb(243,130,33)";

const ApprovedMembersList = ({ approvedMembers, onRemove }) => {
  return (
    <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1, mt: 2 }}>
      <Stack spacing={2}>
        {approvedMembers.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No approved members.
          </Typography>
        ) : (
          approvedMembers.map((member, index) => (
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
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Email: {member.email}
                </Typography>

                <Typography variant="body2" fontWeight="500">
                  Role:
                </Typography>
                <Chip label={member.role} color="primary" size="small" sx={{ mb: 1 }} />

                <Typography variant="body2" fontWeight="500">
                  Skills:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {member.skills.map((skill, idx) => (
                    <Chip key={idx} label={skill} variant="outlined" size="small" />
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onRemove(member)}
                  sx={{
                    textTransform: "none",
                    borderColor: "red",
                    color: "red",
                    "&:hover": {
                      backgroundColor: "rgba(255,0,0,0.05)",
                    },
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default ApprovedMembersList;
