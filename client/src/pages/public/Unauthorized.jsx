import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
const Unauthorized = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      minWidth="100vw"
      flexDirection="column"
    >
      <Typography variant="h1">Unauthorized</Typography>
      <Typography variant="h3">
        You do not have access to the requested page.
      </Typography>
      <br />
      <Button type="button" variant="outlined" onClick={goBack}>
        Go Back
      </Button>
    </Box>
  );
};

export default Unauthorized;
