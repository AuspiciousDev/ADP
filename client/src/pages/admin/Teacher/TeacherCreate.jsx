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
import { useTeachersContext } from "../../../hooks/useTeacherContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
const TeacherCreate = () => {
  const EMP_empID = 12;
  const isLetters = (str) => /^[A-Za-z\s]*$/.test(str);
  const isNumber = (str) => /^[0-9]*$/.test(str);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const { teachers, teacherDispatch } = useTeachersContext();

  const [empID, setEmpID] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState("");

  const [empIDError, setEmpIDError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [genderError, setGenderError] = useState(false);

  const handleDate = (newValue) => {
    setDateOfBirth(newValue);
    const getAge = (birthDate) =>
      Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);
    if (parseInt(getAge(newValue)) > 18) {
      setDateOfBirthError(false);
    } else {
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
    const teacher = {
      empID,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
    };

    console.log(teacher);
    !empID ? setEmpIDError(true) : setEmpIDError(false);
    !firstName ? setFirstNameError(true) : setFirstNameError(false);
    !lastName ? setLastNameError(true) : setLastNameError(false);
    !dateOfBirth ? setDateOfBirthError(true) : setDateOfBirthError(false);
    !gender ? setGenderError(true) : setGenderError(false);

    if (
      !empIDError &&
      !firstNameError &&
      !lastNameError &&
      !dateOfBirthError &&
      !genderError
    ) {
      try {
        const response = await axiosPrivate.post(
          "/api/teachers/register",
          JSON.stringify(teacher)
        );

        if (response.status === 201) {
          const json = await response.data;
          console.log("response;", json);
          teacherDispatch({ type: "CREATE_TEACHER", payload: json });
          setSuccessDialog({
            isOpen: true,
            message: `Teacher ${empID}  has been added!`,
          });
          clearFields();
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log(
          "🚀 ~ file: TeacherCreate.jsx:118 ~ handleSubmit ~ error",
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
          setEmpIDError(true);
          console.log(errMessage);
        } else {
          console.log(error);
          console.log(error.response);
        }
      }
    } else {
      console.log("MADAME ERROR");
    }
  };
  const clearFields = () => {
    setEmpID("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setDateOfBirth(null);
    setGender("");
    setEmpIDError(false);
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
              TEACHER &#62; Create
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={2} sx={{ p: "20px", mt: 2 }}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* <Typography variant="h5">Registration</Typography> */}

          <Box marginBottom="20px">
            <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
              Teacher Information
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
                autoComplete="off"
                variant="outlined"
                label="Employee ID"
                placeholder="12 character Teacher ID"
                error={empIDError}
                value={empID}
                onChange={(e) => {
                  if (isNumber(e.target.value) || "") {
                    setEmpID(e.target.value);
                    setEmpIDError(false);
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography
                        variant="subtitle2"
                        sx={{ color: colors.black[500] }}
                      >
                        {empID.length}/{EMP_empID}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ maxLength: EMP_empID }}
                helperText={empIDError && "Employee ID already exists!"}
              />
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
                error={firstNameError}
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
                error={lastNameError}
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
                        autoComplete="off"
                        required
                        {...params}
                        error={dateOfBirthError}
                        helperText={
                          dateOfBirthError &&
                          "Age of Teacher must be 18 years old or above"
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

export default TeacherCreate;
