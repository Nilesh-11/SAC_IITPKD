// MeetingList.js

import React from 'react';
import { Box, Card, Typography, Stack, Button, Chip } from '@mui/material';
import { FaLink, FaMapMarkerAlt } from "react-icons/fa";
import dayjs from 'dayjs';

const orange = "rgb(243,130,33)";

const MeetingList = ({ meetings, onEditMeeting, onDeleteMeeting }) => {
  return (
    <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1, mt: 2 }}>
      <Stack spacing={2}>
        {meetings.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No meetings found for this project.
          </Typography>
        ) : (
          meetings.map((meeting) => (
            <Card
              key={meeting.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {meeting.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time:{" "}
                  {dayjs(meeting.scheduled_at).format("dddd, MMM D, YYYY • h:mm A")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {meeting.description}
                </Typography>

                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {meeting.roles?.map((role, index) => (
                    <Chip key={index} label={role} color="primary" size="small" />
                  ))}
                </Box>

                {/* Venue or Link */}
                {meeting.meeting_type === "online" && meeting.meeting_link ? (
                  <a
                    href={meeting.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, display: "flex", alignItems: "center" }}
                    >
                      <FaLink fontSize="small" sx={{ mr: 0.5, color: orange }} />
                      Join Online Meeting
                    </Typography>
                  </a>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, display: "flex", alignItems: "center" }}
                    color="text.secondary"
                  >
                    <FaMapMarkerAlt fontSize="small" sx={{ mr: 0.5 }} />
                    Venue: {meeting.venue}
                  </Typography>
                )}
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onEditMeeting(meeting)}
                  sx={{
                    textTransform: "none",
                    borderColor: orange,
                    color: orange,
                    "&:hover": {
                      backgroundColor: "rgba(243,130,33,0.1)",
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onDeleteMeeting(meeting.id)}
                  sx={{
                    textTransform: "none",
                    borderColor: "red",
                    color: "red",
                    "&:hover": {
                      backgroundColor: "rgba(255,0,0,0.05)",
                    },
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default MeetingList;
