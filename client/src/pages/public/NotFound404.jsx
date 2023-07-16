import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
const NotFound404 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
      flexDirection="column"
    >
      <Typography variant="h1" fontWeight="bold">
        404 NOT FOUND
      </Typography>
      <Typography variant="h3">The requested page is not found.</Typography>
      <br />
      <Button type="button" variant="contained" onClick={goBack}>
        Go Back
      </Button>
    </Box>
  );
};

export default NotFound404;
