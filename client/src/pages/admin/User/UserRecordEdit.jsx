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
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  ButtonBase,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ModeEditOutline, MoreVert } from "@mui/icons-material";
import { format } from "date-fns-tz";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";

import { storage } from "../../public/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import useAuth from "../../../hooks/useAuth";
const UserRecordEdit = () => {
  const { username } = useParams();
  const { auth } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [getUserDetails, setUserDetails] = useState([]);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState("");
  const [userType, setUserType] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState(false);

  const handleDate = (newValue) => {
    setDateOfBirth(newValue);
    setDateOfBirthError(false);
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
          setFirstName(json?.firstName);
          setMiddleName(json?.middleName || "");
          setLastName(json?.lastName);
          setDateOfBirth(json?.dateOfBirth);
          setGender(json?.gender);
          setUserType(json?.userType);
          setEmail(json?.email);
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

  const [imageUpload, setImageUpload] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [changeIMG, setChangeIMG] = useState(false);

  const uploadImage = async () => {
    setLoadingDialog({
      isOpen: true,
    });

    if (imageUpload == null) {
      return (
        setLoadingDialog({
          isOpen: false,
        }),
        setErrorDialog({
          isOpen: true,
          message: `Please choose an image.`,
        })
      );
    }
    try {
      const imageRef = ref(storage, `ADP/users/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          console.log("Download link to your file: ", downloadURL);
          await imageToDB(downloadURL);
          await setImageUpload(null);
        });
      });
      setLoadingDialog({
        isOpen: false,
      });
    } catch (error) {
      console.log("🚀 ~ file: Profile.jsx:106 ~ uploadImage ~ error", error);
      setLoadingDialog({
        isOpen: false,
      });
      setErrorDialog({
        isOpen: true,
        message: `${error}`,
      });
    }
  };
  const imageToDB = async (downloadURL) => {
    setLoadingDialog({
      isOpen: true,
    });
    const object = {
      username: username,
      imgURL: downloadURL,
    };
    console.log(object);
    try {
      const response = await axiosPrivate.patch(
        `/api/users/update/img/${username}`,
        JSON.stringify(object)
      );
      if (response.status === 200) {
        const json = await response.data;
        console.log("response;", json);
        setSuccessDialog({
          isOpen: true,
          message: "Image Profile has been updated!",
        });
      }
      setChangeIMG((e) => !e);
      setLoadingDialog({
        isOpen: false,
      });
    } catch (error) {
      setLoadingDialog({
        isOpen: false,
      });
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    try {
      const data = {
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        userType,
        email,
      };

      const response = await axiosPrivate.patch(
        `/api/users/update/${username}`,
        JSON.stringify(data)
      );

      if (response.status === 200) {
        const json = await response.data;
        console.log("response;", json);
        setSuccessDialog({
          isOpen: true,
          message: `User ${username} has been updated!`,
        });
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      console.log(
        "🚀 ~ file: StudentEdit.jsx:137 ~ handleSubmit ~ error",
        error
      );
      setLoadingDialog({ isOpen: false });
      const errMessage = error.response.data.message;
      if (!error?.response) {
        console.log("no server response");
      } else if (error.response.status === 400) {
        console.log(errMessage);
      } else if (error.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
        console.log();
      } else if (error.response.status === 409) {
        setLRNError(true);
        console.log(errMessage);
      } else {
        console.log(error);
        console.log(error.response);
      }
    }
  };

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
              USER &#62; edit &#62; {username}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gridTemplateRows: "2fr 2fr",
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
            height: "100%",
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
                width: "200px",
                height: "200px",
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
                src={imgFile ? imgFile : getUserDetails?.imgURL}
                style={{
                  objectFit: "contain",
                }}
              />

              <Paper
                sx={{
                  bottom: 15,
                  right: 15,
                  display: "flex",
                  width: "30px",
                  height: "30px",
                  position: "absolute",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "25px",
                }}
              >
                <ButtonBase
                  onClick={() => {
                    setChangeIMG((e) => !e);
                  }}
                >
                  <ModeEditOutline />
                </ButtonBase>
              </Paper>
            </Paper>
            {changeIMG && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  accept="image/*"
                  id="profilePhoto"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    setImageUpload(e.target.files[0]);
                    setImgFile(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                <Button variant="contained" type="button" onClick={uploadImage}>
                  Upload
                </Button>
              </Box>
            )}
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

        {/*  // ! Basic Information */}
        <form onSubmit={handleSubmit}>
          <Paper
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: "2em 4em 2em 4em",
            }}
          >
            <Typography variant="h3" alignSelf="start" fontWeight={600}>
              User Information
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "5fr 1fr",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    mt: 2,
                    gap: 1,
                    gridColumn: "1 / span 3",
                  }}
                >
                  <Typography textTransform="uppercase" variant="h4">
                    Name
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      gap: 2,
                    }}
                  >
                    <TextField
                      required
                      autoComplete="off"
                      variant="outlined"
                      label="First Name"
                      placeholder="Given Name"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                      inputProps={{ style: { textTransform: "capitalize" } }}
                    />
                    <TextField
                      autoComplete="off"
                      variant="outlined"
                      label="Middle Name"
                      placeholder="Optional"
                      value={middleName}
                      onChange={(e) => {
                        setMiddleName(e.target.value);
                      }}
                      inputProps={{ style: { textTransform: "capitalize" } }}
                    />
                    <TextField
                      required
                      autoComplete="off"
                      variant="outlined"
                      label="Last Name"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                      inputProps={{ style: { textTransform: "capitalize" } }}
                    />
                    <TextField
                      required
                      autoComplete="off"
                      variant="outlined"
                      type="email"
                      label="Email"
                      placeholder="Active and Valid email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    mt: 2,
                    gap: 1,
                    width: "100%",
                  }}
                >
                  <Typography textTransform="uppercase" variant="h4">
                    Date of Birth
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label="Date of Birth"
                      inputFormat="MM/DD/YYYY"
                      error={dateOfBirthError}
                      value={dateOfBirth}
                      onChange={handleDate}
                      renderInput={(params) => (
                        <TextField required disabled {...params} />
                      )}
                    />
                  </LocalizationProvider>
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
                    Gender
                  </Typography>

                  <FormControl required fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Gender
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={gender}
                      label="Gender"
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                    >
                      <MenuItem value={"male"}>Male</MenuItem>
                      <MenuItem value={"female"}>Female</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {auth && auth.userType === "registrar" ? (
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
                      User Type
                    </Typography>
                    <FormControl required fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        User Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={userType}
                        label="User Type"
                        onChange={(e) => {
                          setUserType(e.target.value);
                        }}
                      >
                        {/* <MenuItem value={"registrar"}>Registrar</MenuItem> */}
                        <MenuItem value={"teacher"}>Teacher</MenuItem>
                        <MenuItem value={"staff"}>Staff</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "end",
                  gridColumn: 4,
                  gap: 2,
                  "& > button": {
                    width: "200px",
                    height: "4em",
                  },
                }}
              >
                <Button type="submit" variant="contained">
                  <Typography variant="h4">Update</Typography>
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={(e) => {
                    navigate(`/registrar/user/profile/${username}`);
                  }}
                >
                  <Typography variant="h4">Cancel</Typography>
                </Button>
              </Box>
            </Box>
          </Paper>
        </form>
      </Box>
    </Box>
  );
};

export default UserRecordEdit;
