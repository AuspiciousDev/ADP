import React from "react";
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
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
// import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
const ErrorDialogue = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { errorDialog, setErrorDialog } = props;
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return setErrorDialog({ ...errorDialog, isOpen: false });
  };
  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={errorDialog.isOpen}
      onClose={handleClose}
    >
      <DialogTitle sx={{ margin: "0 30px" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* <Typography>Confirm Alert</Typography> */}
          <WarningAmberOutlinedIcon
            sx={{ fontSize: "100px", color: colors.black[100] }}
          />
          <Typography variant="h3">ERROR!</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ margin: "0 20px" }}>
        <Typography variant="h4">{errorDialog.title}</Typography>
        <Typography variant="h6">{errorDialog.message}</Typography>
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
          color="primary"
          variant="contained"
          onClick={() => setErrorDialog({ ...errorDialog, isOpen: false })}
        >
          Exit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialogue;
