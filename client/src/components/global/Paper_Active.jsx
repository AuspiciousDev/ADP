import { Paper, useTheme, Typography, Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
const Paper_Active = (props) => {
  const { title, icon } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      {title === "active" ? (
        <Paper
          sx={{
            display: "flex",
            padding: "5px 10px",
            backgroundColor: colors.greenOnly[500],
            color: colors.whiteOnly[500],
            borderRadius: "20px",
            alignItems: "center",
            width: "120px",
            justifyContent: "center",
          }}
        >
          {icon}
          <Typography ml="5px" textTransform="uppercase">
            {title}
          </Typography>
        </Paper>
      ) : (
        <Paper
          sx={{
            display: "flex",
            padding: "2px 10px",
            borderRadius: "20px",
            alignItems: "center",
            width: "120px",
            justifyContent: "center",
          }}
        >
          {icon}
          <Typography ml="5px" textTransform="uppercase">
            {title}
          </Typography>
        </Paper>
      )}
    </>
  );
};

export default Paper_Active;
