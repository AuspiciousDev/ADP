import React from "react";
import "./Loading.css";
import { Dialog, DialogContent } from "@mui/material";
const LoadingDialogue = (props) => {
  const { loadingDialog, setLoadingDialog } = props;
  const handleClose = (event, reason) => {};
  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={loadingDialog.isOpen}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <DialogContent sx={{ p: 5 }}>
        <span className="loader"></span>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialogue;
