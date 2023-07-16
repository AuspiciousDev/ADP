import React from "react";
import {
  useTheme,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../../theme";
import logo from "../../../assets/logo.png";
import {
  SettingsOutlined,
  LightModeOutlined,
  DarkModeOutlined,
  LogoutOutlined,
  Person2Outlined,
  LockOutlined,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { useState, useContext } from "react";
import useLogout from "../../../hooks/useLogout";
import useAuth from "../../../hooks/useAuth";
import LogoutDialogue from "../../../global/LogoutDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [anchorEl, setAnchorEl] = useState();
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const logout = useLogout();
  const signOut = async () => {
    setLogoutDialog({
      isOpen: true,
      message: `Are you sure you want to logout?`,
      onLogout: async () => {
        setLoadingDialog({ isOpen: true });
        await logout();
        navigate("/");
        setLoadingDialog({ isOpen: false });
      },
    });
  };

  const [logoutDialog, setLogoutDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  return (
    <Box
      display={{ xs: "none", sm: "flex" }}
      sx={{
        width: "100%",
        height: "50px",
        boxShadow: "rgba(0, 51, 51,0.15) 2px 2px 3.6px",
        p: { xs: "7.5px 10px", sm: "7.5px 20px" },
        borderBottom: `1px solid ${colors.primary[500]}`,
      }}
      justifyContent="space-between"
      alignItems="center"
    >
      <LogoutDialogue
        logoutDialog={logoutDialog}
        setLogoutDialog={setLogoutDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <img alt="" src={logo} style={{ height: "2em" }} />
        <Typography variant="h3" textTransform="uppercase">
          ADP Enrollment System
        </Typography>
      </Box>
      <IconButton
        sx={{
          "&:hover": {
            transform: "scale3d(1.5, 1.5, 1)",
            animation: "rotation 1s linear infinite",
            "@keyframes rotation": {
              "0%": {
                transform: "rotate(0deg)",
              },
              "100%": {
                transform: "rotate(360deg)",
              },
            },
            color: colors.primary[900],
          },
        }}
        onClick={handleClick}
      >
        <SettingsOutlined />
      </IconButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            navigate(`/registrar/user/profile/${auth.username}`);
          }}
          disableRipple
        >
          <Person2Outlined />
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(`/registrar/user/changePassword`);
          }}
          disableRipple
        >
          <LockOutlined />
          Change Password
        </MenuItem>
        <MenuItem onClick={colorMode.toggleColorMode} disableRipple sx={{}}>
          {theme.palette.mode === "dark" ? (
            <>
              <LightModeOutlined
                sx={{
                  fontSize: "20pt",
                }}
              />
              Light Mode
            </>
          ) : (
            <>
              <DarkModeOutlined sx={{ fontSize: "20pt" }} />
              Dark Mode
            </>
          )}
        </MenuItem>
        <MenuItem
          onClick={() => {
            signOut();
          }}
          disableRipple
        >
          <LogoutOutlined />
          Logout
        </MenuItem>
      </StyledMenu>
    </Box>
  );
};

export default Navbar;
