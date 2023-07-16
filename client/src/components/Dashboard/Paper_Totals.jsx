import { Paper, useTheme, Typography, Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";

import { tokens } from "../../theme";
import { useEffect } from "react";
const Paper_Totals = (props) => {
  const { value, description, to, icon } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const StyledPaper = styled(Paper)(({ theme }) => ({
    "&.MuiPaper-root ": {
      color: `${colors.black[100]}`,
      display: "flex",
      flexDirection: "column",
      borderRadius: 5,
      padding: "10px",
      borderBottom: `solid 1px ${colors.greenOnly[500] + 50}`,
      borderRight: `solid 1px ${colors.greenOnly[500] + 50}`,
      boxShadow: `${colors.greenOnly[500] + 40} 1.95px 1.95px 2.6px;`,
    },

    "& > svg": {
      fontSize: "80px",
      alignSelf: "center",
      transition: "transform 0.15s ease-in-out",
      "&:hover": {
        transform: "scale3d(1.2, 1.2, 1)",
        color: colors.greenOnly[500],
      },
    },
  }));

  return (
    <Box
      sx={{
        "& > a": {
          color: colors.greenOnly[500],
          textDecoration: "none",
        },
      }}
    >
      <Link to={to}>
        <StyledPaper>
          {icon}
          <Typography variant="h2" margin="20px" align="center">
            {value && value}
          </Typography>
          <Typography align="center" variant="h5">
            {description}
          </Typography>
        </StyledPaper>
      </Link>
    </Box>
  );
};

export default Paper_Totals;
