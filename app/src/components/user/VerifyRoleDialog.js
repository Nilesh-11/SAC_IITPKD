import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const orange = "rgb(243,130,33)";

const VerifyRoleDialog = ({ open, onClose, onConfirm, roles }) => {
  const [selectedRole, setSelectedRole] = useState("");

  const handleConfirm = () => {
    if (selectedRole) {
      onConfirm(selectedRole);
      setSelectedRole("");
    }
  };

  const handleClose = () => {
    setSelectedRole("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select Role</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          select
          label="Select a role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          sx={{ mt: 2 }}
        >
          {roles.map((role, idx) => (
            <MenuItem key={idx} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedRole}
          variant="contained"
          sx={{
            backgroundColor: orange,
            "&:hover": { backgroundColor: "rgba(243,130,33,0.8)" },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerifyRoleDialog;
