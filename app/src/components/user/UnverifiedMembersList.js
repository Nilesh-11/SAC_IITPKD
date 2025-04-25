import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

const orange = "rgb(243,130,33)";

const UnverifiedMembersList = ({ unverifiedMembers, onVerify, onRemove }) => {
  return (
    <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1, mt: 2 }}>
      <Stack spacing={2}>
        {unverifiedMembers.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No unverified members.
          </Typography>
        ) : (
          unverifiedMembers.map((member, index) => (
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
              {/* Left section: Member info */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Email: {member.email}
                </Typography>

                <Typography variant="body2" fontWeight="500">
                  Roles Applied:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                  {member.roles_applied.map((role, idx) => (
                    <Chip key={idx} label={role} color="primary" size="small" />
                  ))}
                </Stack>

                <Typography variant="body2" fontWeight="500">
                  Skills:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {member.skills.map((skill, idx) => (
                    <Chip key={idx} label={skill} variant="outlined" size="small" />
                  ))}
                </Stack>
              </Box>

              {/* Right section: Buttons */}
              <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onVerify(member)}
                  sx={{
                    textTransform: "none",
                    borderColor: orange,
                    color: orange,
                    "&:hover": {
                      backgroundColor: "rgba(243,130,33,0.1)",
                    },
                  }}
                >
                  Verify
                </Button>
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

export default UnverifiedMembersList;
