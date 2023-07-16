import { Paper, useTheme, Typography, Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
const Paper_Title = (props) => {
  const { title, buttonTitle, to, icon, button } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  return (
    <Paper
      elevation={2}
      sx={{
        width: "100%",
        padding: { xs: "10px", sm: "0 10px" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { sm: "end" },
            justifyContent: { xs: "center", sm: "start" },
            m: { xs: "20px 0" },
          }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              borderLeft: `5px solid ${colors.primary[900]}`,
              paddingLeft: 2,
              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography>
        </Box>
        {button && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <Button
              type="button"
              startIcon={icon}
              onClick={() => navigate(to)}
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "200px" },
                height: "50px",
                marginLeft: { xs: "0", sm: "20px" },
                marginTop: { xs: "20px", sm: "0" },
              }}
            >
              <Typography variant="h6" fontWeight="500">
                {buttonTitle}
              </Typography>
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default Paper_Title;
