import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { tokens } from "../../../theme";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MoreVert } from "@mui/icons-material";
import { format } from "date-fns-tz";
const UserRecord = () => {
  const { username } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [getUserDetails, setUserDetails] = useState([]);

  const getAge = (birthDate) =>
    Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get(`/api/users/${username}`);
        if (response.status === 200) {
          const json = await response.data;
          console.log("Employees GET : ", json);
          setLoadingDialog({ isOpen: false });
          setUserDetails(json);
        }
      } catch (error) {
        console.log(
          "🚀 ~ file: UserProfile.jsx:64 ~ getUsersDetails ~ error",
          error
        );
        if (!error.response) {
          console.log("no server response");
        } else if (error.response.status === 204) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          navigate(-1);
          console.log(error.response.data.message);
        } else if (error.response.status === 400) {
          console.log(error.response.data.message);
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
          console.log(error);
        }
        setLoadingDialog({ isOpen: false });
      }
    };
    getUsersDetails();
  }, []);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [successDialog, setSuccessDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [validateDialog, setValidateDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  
  return (
    <Box className="container-layout_body_contents">
      <ConfirmDialogue
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <ValidateDialogue
        validateDialog={validateDialog}
        setValidateDialog={setValidateDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
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
              USER &#62; {username}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          height: "100%",
          gap: 2,
          mt: 2,
        }}
      >
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Paper
              sx={{
                width: "250px",
                height: "250px",
                maxHeight: "250px",
                maxWidth: "250px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "125px",
                p: 3,
              }}
            >
              <Avatar
                alt="profile-user"
                sx={{ width: "100%", height: "100%" }}
                src={getUserDetails?.imgURL}
                style={{
                  objectFit: "contain",
                }}
              />
            </Paper>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                zIndex: 1,
              }}
            >
              <Typography
                variant="h3"
                textTransform="capitalize"
                fontWeight={600}
              >
                {getUserDetails?.middleName
                  ? getUserDetails?.firstName +
                    " " +
                    getUserDetails?.middleName.charAt(0) +
                    ". " +
                    getUserDetails?.lastName
                  : getUserDetails?.firstName + " " + getUserDetails?.lastName}
              </Typography>
              <Typography
                variant="h3"
                textTransform="capitalize"
                color="primary"
                fontWeight={600}
              >
                {getUserDetails?.username ? getUserDetails?.username : username}
              </Typography>
              <Paper
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mt: 1,
                  p: 1,
                  width: "200px",
                  backgroundColor: colors.greenOnly[500],
                  borderRadius: "20px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: colors.whiteOnly[500],
                    textTransform: "uppercase",
                  }}
                >
                  {getUserDetails?.userType || "user"}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Paper>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
            "& > .MuiPaper-root": {
              padding: "2em 4em 2em 4em",
            },
          }}
        >
          {/*  // ! Basic Information */}
          <Paper
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h3" alignSelf="start" fontWeight={600}>
              User Information
            </Typography>
            <Box sx={{ position: "absolute", top: 5, right: 5 }}>
              <IconButton onClick={handleClick}>
                <MoreVert sx={{ fontSize: "20pt" }} />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate(`/registrar/user/edit/${username}`);
                  }}
                >
                  <Typography>Edit Profile</Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  mt: 2,
                  gap: 1,
                }}
              >
                <Typography textTransform="uppercase" variant="h4">
                  Name
                </Typography>
                <Typography
                  textTransform="uppercase"
                  variant="h5"
                  fontWeight={600}
                >
                  {getUserDetails?.middleName
                    ? getUserDetails?.firstName +
                      " " +
                      getUserDetails?.middleName.charAt(0) +
                      ". " +
                      getUserDetails?.lastName
                    : getUserDetails?.firstName +
                      " " +
                      getUserDetails?.lastName}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  mt: 2,
                  gap: 1,
                }}
              >
                <Typography textTransform="uppercase" variant="h4">
                  Age
                </Typography>
                <Typography
                  textTransform="uppercase"
                  variant="h5"
                  fontWeight={600}
                >
                  {getUserDetails?.dateOfBirth
                    ? getAge(
                        format(
                          new Date(getUserDetails?.dateOfBirth),
                          " MMMM dd, yyyy"
                        )
                      ) + " yrs."
                    : "-"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  mt: 3,
                  gap: 1,
                }}
              >
                <Typography textTransform="uppercase" variant="h4">
                  Date of Birth
                </Typography>
                <Typography
                  textTransform="uppercase"
                  variant="h5"
                  fontWeight={600}
                >
                  {getUserDetails?.dateOfBirth
                    ? format(
                        new Date(getUserDetails?.dateOfBirth),
                        " MMMM dd, yyyy"
                      )
                    : "-"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  mt: 3,
                  gap: 1,
                }}
              >
                <Typography textTransform="uppercase" variant="h4">
                  Gender
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  textTransform="uppercase"
                >
                  {getUserDetails?.gender || "-"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default UserRecord;
