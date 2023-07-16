import { useState } from "react";
import {
  Box,
  useTheme,
  Paper,
  Divider,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { tokens } from "../../../theme";
import { useUsersContext } from "../../../hooks/useUserContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { Email } from "@mui/icons-material";
const UserCreate = () => {
  const isLetters = (str) => /^[A-Za-z\s]*$/.test(str);
  const isNumber = (str) => /^[0-9]*$/.test(str);
  const getAge = (birthDate) =>
    Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const { users, userDispatch } = useUsersContext();

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState("");
  const [userType, setUserType] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [genderError, setGenderError] = useState(false);

  const handleDate = (newValue) => {
    if (getAge(newValue) >= 18) {
      setDateOfBirth(newValue);
      setDateOfBirthError(false);
    } else {
      setDateOfBirth(newValue);
      setDateOfBirthError(true);
    }
  };
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

  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    const doc = {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      email,
      gender,
      userType,
    };

    try {
      const response = await axiosPrivate.post(
        "/api/users/register",
        JSON.stringify(doc)
      );

      if (response.status === 200) {
        const json = await response.data;
        console.log("response;", json);
        setSuccessDialog({
          isOpen: true,
          message: `A verification token has been sent to ${doc.email} email!`,
        });
        clearFields();
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      console.log(
        "🚀 ~ file: UserCreate.jsx:105 ~ handleSubmit ~ error",
        error
      );
      setLoadingDialog({ isOpen: false });
      const errMessage = error.response.data.message;
      if (!error?.response) {
        console.log("no server response");
      } else if (error.response.status === 400) {
        console.log(errMessage);
      } else if (error.response.status === 409) {
        setEmailError(true);
        console.log(errMessage);
      } else {
        console.log(error);
        console.log(error.response);
      }
    }
  };
  const clearFields = () => {
    setEmail("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setUserType("");
    setDateOfBirth(null);
    setGender("");
  };
  return (
    <Box className="container-layout_body_contents">
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
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
              USER &#62; Create
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={2} sx={{ p: "20px", mt: 2 }}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* <Typography variant="h5">Registration</Typography> */}
          <Box marginBottom="20px">
            <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
              Employee Information
            </Typography>
            <Box
              sx={{
                display: "grid",
                width: "100%",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
                gap: "20px",
              }}
            >
              <TextField
                required
                type="email"
                autoComplete="off"
                variant="outlined"
                label="Email"
                placeholder="User valid email"
                error={emailError}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                helperText={emailError && "User Email already exists!"}
              />
              <FormControl required fullWidth>
                <InputLabel id="demo-simple-select-label">User Type</InputLabel>
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
          </Box>
          <Typography variant="h5" sx={{ margin: "15px 0 10px 0" }}>
            Personal Information
          </Typography>
          <Box marginBottom="40px">
            <Box
              sx={{
                display: "grid",
                width: "100%",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
                gap: "20px",
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
                  if (e.target.value.trim().length === 0) {
                    setFirstName("");
                  } else {
                    if (isLetters(e.target.value)) {
                      setFirstName(e.target.value);
                    }
                  }
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
                  if (e.target.value.trim().length === 0) {
                    setMiddleName("");
                  } else {
                    if (isLetters(e.target.value)) {
                      setMiddleName(e.target.value);
                    }
                  }
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
                  if (e.target.value.trim().length === 0) {
                    setLastName("");
                  } else {
                    if (isLetters(e.target.value)) {
                      setLastName(e.target.value);
                    }
                  }
                }}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
            </Box>

            <Box sx={{ mb: "40px" }}>
              <Box
                sx={{
                  display: "grid",
                  width: "100%",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Date of Birth"
                    inputFormat="MM/DD/YYYY"
                    value={dateOfBirth}
                    onChange={handleDate}
                    renderInput={(params) => (
                      <TextField
                        required
                        disabled
                        {...params}
                        error={dateOfBirthError}
                        helperText={
                          dateOfBirthError &&
                          "Age of user must be 18 years old or above"
                        }
                      />
                    )}
                  />
                </LocalizationProvider>

                <FormControl required fullWidth>
                  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={gender}
                    error={genderError}
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

              <Box marginTop="20px"></Box>
            </Box>
          </Box>

          <Box
            display="flex"
            sx={{ justifyContent: { xs: "center", sm: "end" } }}
            height="70px"
            gap={2}
          >
            <Button
              type="submit"
              disabled={emailError || dateOfBirthError}
              variant="contained"
              color="secondary"
              sx={{ width: "250px", height: "50px" }}
            >
              <Typography variant="h5">submit</Typography>
            </Button>
            <Button
              type="button"
              variant="contained"
              sx={{ width: "250px", height: "50px" }}
              onClick={() => {
                clearFields();
              }}
            >
              <Typography variant="h5">clear</Typography>
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default UserCreate;
