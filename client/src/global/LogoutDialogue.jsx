import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import logout from "../assets/logout.svg";
const LogoutDialogue = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { logoutDialog, setLogoutDialog } = props;
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return setLogoutDialog({ ...logoutDialog, isOpen: false });
  };
  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={logoutDialog.isOpen}
      onClose={handleClose}
    >
      <DialogTitle sx={{ margin: "3em 10em" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* <Typography>Confirm Alert</Typography> */}
          <img src={logout} alt="logout" style={{ width: "300px" }} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h3">{logoutDialog?.message}</Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          mb: "10px",
          gap: 2,
          padding: "10px 50px",
        }}
      >
        <Button
          fullWidth
          color="secondary"
          variant="contained"
          onClick={() => setLogoutDialog({ ...logoutDialog, isOpen: false })}
        >
          Cancel
        </Button>
        <Button fullWidth variant="contained" onClick={logoutDialog.onLogout}>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialogue;
