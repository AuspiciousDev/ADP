import { Paper, useTheme, Typography, Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
const Paper_Icon = (props) => {
  const { title, icon, color } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Paper
      sx={{
        padding: "0.5em 1em",
        borderRadius: "20px",
        display: "flex",
        justifyContent: "center",
        backgroundColor: colors.whiteOnly[500],
        color: `${color ? color : "black"}`,
        alignItems: "center",
      }}
    >
      {icon}
      {title && (
        <Typography ml="5px" textTransform="uppercase">
          {title}
        </Typography>
      )}
    </Paper>
  );
};

export default Paper_Icon;
