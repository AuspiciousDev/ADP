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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
export const SuccessDialogue = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { successDialog, setSuccessDialog } = props;
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return setSuccessDialog({ ...successDialog, isOpen: false });
  };
  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={successDialog.isOpen}
      onClose={handleClose}
    >
      <DialogTitle sx={{ margin: "0 30px" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* <Typography>Confirm Alert</Typography> */}
          <CheckCircleOutlinedIcon
            sx={{ fontSize: "100px", color: colors.primary[500] }}
          />
          <Typography variant="h3">
            {successDialog?.message || "Changes has been made!"}
          </Typography>
        </Box>
      </DialogTitle>
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
          onClick={() => setSuccessDialog({ ...successDialog, isOpen: false })}
          // onClick={successDialog.onConfirm}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default SuccessDialogue;
