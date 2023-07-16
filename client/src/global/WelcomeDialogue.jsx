import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import welcome from "../assets/welcome.svg";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
export const WelcomeDialogue = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { welcomeDialog, setWelcomeDialog } = props;
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return setWelcomeDialog({ ...welcomeDialog, isOpen: false });
  };
  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={welcomeDialog.isOpen}
      onClose={handleClose}
    >
      <DialogTitle sx={{ margin: "3em 10em" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* <Typography>Confirm Alert</Typography> */}
          <img src={welcome} alt="welcome" style={{ width: "300px" }} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h3">
          {welcomeDialog?.message}
          <span style={{ textTransform: "capitalize" }}>
            {welcomeDialog?.type}!
          </span>
        </Typography>
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
          variant="contained"
          onClick={() => setWelcomeDialog({ ...welcomeDialog, isOpen: false })}
          // onClick={welcomeDialog.onConfirm}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default WelcomeDialogue;
