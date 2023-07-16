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
import { useStudentsContext } from "../../../hooks/useStudentsContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
const StudentCreate = () => {
  const STUD_LRN = 12;
  const isLetters = (str) => /^[A-Za-z\s]*$/.test(str);
  const isNumber = (str) => /^[0-9]*$/.test(str);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const { students, studDispatch } = useStudentsContext();

  const [LRN, setLRN] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [nationality, setNationality] = useState("");
  const [religion, setReligion] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [telephone, setTelephone] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [fatherContact, setFatherContact] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherContact, setMotherContact] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");
  const [emergencyNumber, setEmergencyNumber] = useState("");

  const [LRNError, setLRNError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [genderError, setGenderError] = useState(false);

  const handleDate = (newValue) => {
    setDateOfBirth(newValue);
    const getAge = (birthDate) =>
      Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);
    if (parseInt(getAge(newValue)) > 6) {
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
    const student = {
      LRN,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      placeOfBirth,
      civilStatus,
      nationality,
      religion,
      address,
      city,
      province,
      email,
      mobile,
      telephone,
      fatherName,
      fatherContact,
      motherName,
      motherContact,
      emergencyName,
      emergencyRelationship,
      emergencyNumber,
    };
    try {
      const response = await axiosPrivate.post(
        "/api/students/register",
        JSON.stringify(student)
      );

      if (response.status === 201) {
        const json = await response.data;
        console.log("response;", json);
        studDispatch({ type: "CREATE_STUDENT", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `Student ${LRN}  has been added!`,
        });
        clearFields();
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
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
  const clearFields = () => {
    setLRN("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setDateOfBirth(null);
    setGender("");
    setPlaceOfBirth("");
    setCivilStatus("");
    setNationality("");
    setReligion("");
    setAddress("");
    setCity("");
    setProvince("");
    setEmail("");
    setMobile("");
    setTelephone("");
    setFatherName("");
    setFatherContact("");
    setMotherContact("");
    setMotherName("");
    setEmergencyName("");
    setEmergencyRelationship("");
    setEmergencyNumber("");
    setLRNError(false);
    setDateOfBirthError(false);
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
              STUDENT &#62; Create
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={2} sx={{ p: "20px", mt: 2 }}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* <Typography variant="h5">Registration</Typography> */}
          {/* // ! Personal Information */}
          <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
            Student Information
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
              size="small"
              required
              autoComplete="off"
              variant="outlined"
              label="Student LRN"
              placeholder="12 character Student LRN"
              error={LRNError}
              value={LRN}
              onChange={(e) => {
                if (isNumber(e.target.value) || "") {
                  setLRN(e.target.value);
                  setLRNError(false);
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      variant="subtitle2"
                      sx={{ color: colors.black[500] }}
                    >
                      {LRN.length}/{STUD_LRN}
                    </Typography>
                  </InputAdornment>
                ),
              }}
              inputProps={{ maxLength: STUD_LRN }}
              helperText={LRNError && "Student LRN already exists!"}
            />
          </Box>
          {/* // ! Personal Information */}
          <Typography variant="h5" sx={{ margin: "15px 0 10px 0" }}>
            Personal Information
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
              size="small"
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
                  if (isLetters()) {
                    setFirstName(e.target.value);
                  }
                }
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              size="small"
              autoComplete="off"
              variant="outlined"
              label="Middle Name"
              placeholder="Optional"
              value={middleName}
              onChange={(e) => {
                if (e.target.value.trim().length === 0) {
                  setMiddleName("");
                } else {
                  setMiddleName(e.target.value);
                }
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              size="small"
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

          <Box
            sx={{
              display: "grid",
              width: "100%",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
              gap: "20px",
              marginTop: "20px",
              mb: 2,
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
                    size="small"
                    autoComplete="off"
                    required
                    {...params}
                    error={dateOfBirthError}
                    helperText={
                      dateOfBirthError &&
                      "Age of student must be 7 years old or above"
                    }
                  />
                )}
              />
            </LocalizationProvider>
            <FormControl required fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={gender}
                error={genderError}
                label="Gender"
                onChange={(e) => {
                  if (e.target.value.trim().length === 0) {
                    setGender("");
                  } else {
                    setGender(e.target.value);
                  }
                }}
              >
                <MenuItem value={"male"}>Male</MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              required
              autoComplete="off"
              variant="outlined"
              label="Place of Birth"
              placeholder="City"
              value={placeOfBirth}
              onChange={(e) => {
                if (e.target.value.trim().length === 0) {
                  setPlaceOfBirth("");
                } else {
                  setPlaceOfBirth(e.target.value);
                }
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <FormControl required fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Civil Status
              </InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={civilStatus}
                label="Civil Status"
                onChange={(e) => {
                  setCivilStatus(e.target.value);
                }}
              >
                <MenuItem value={"Single"}>Single</MenuItem>
                <MenuItem value={"married"}>Married</MenuItem>
                <MenuItem value={"widowed"}>Widowed</MenuItem>
                <MenuItem value={"divorced"}>Divorced</MenuItem>
                <MenuItem value={"separated"}>Separated </MenuItem>
              </Select>
            </FormControl>

            <TextField
              required
              size="small"
              autoComplete="off"
              variant="outlined"
              label="Nationality"
              placeholder="Filipino, Chinese, American ..."
              value={nationality}
              onChange={(e) => {
                if (e.target.value.trim().length === 0) {
                  setNationality("");
                } else {
                  setNationality(e.target.value);
                }
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              size="small"
              autoComplete="off"
              variant="outlined"
              label="Religion"
              placeholder="Catholic, Muslim, Christian ..."
              value={religion}
              onChange={(e) => {
                if (e.target.value.trim().length === 0) {
                  setReligion("");
                } else {
                  setReligion(e.target.value);
                }
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              size="small"
              required
              autoComplete="off"
              variant="outlined"
              label="Address"
              placeholder="House number, block no., street name, zone ..."
              value={address}
              onChange={(e) => {
                if (e.target.value.trim().length === 0) {
                  setAddress("");
                } else {
                  setAddress(e.target.value);
                }
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              size="small"
              required
              autoComplete="off"
              variant="outlined"
              label="City"
              placeholder="City/Municipality"
              value={city}
              onChange={(e) => {
                if (e.target.value.trim().length === 0) {
                  setCity("");
                } else {
                  if (isLetters(e.target.value)) {
                    setCity(e.target.value);
                  }
                }
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              size="small"
              required
              autoComplete="off"
              variant="outlined"
              label="Province"
              placeholder="Bulacan, Pamgpanga, Metro Manila"
              value={province}
              onChange={(e) => {
                if (e.target.value.trim().length === 0) {
                  setProvince("");
                } else {
                  if (isLetters(e.target.value)) {
                    setProvince(e.target.value);
                  }
                }
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              size="small"
              required
              type="email"
              autoComplete="off"
              variant="outlined"
              label="Email"
              placeholder="Active and valid email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              required
              size="small"
              autoComplete="off"
              variant="outlined"
              label="Mobile Number"
              value={mobile}
              placeholder="10 Digit Mobile Number"
              inputProps={{ maxLength: 10 }}
              onChange={(e) => {
                if (isNumber(e.target.value) || "") {
                  setMobile(e.target.value);
                }
              }}
              InputProps={{
                startAdornment: (
                  <>
                    <Typography>+63</Typography>
                    <Divider
                      sx={{ height: 28, m: 0.5 }}
                      orientation="vertical"
                    />
                  </>
                ),
              }}
            />
            <TextField
              size="small"
              autoComplete="off"
              variant="outlined"
              label="Telephone Number"
              value={telephone}
              placeholder="10 Digit Telephone Number"
              inputProps={{ maxLength: 10 }}
              onChange={(e) => {
                if (isNumber(e.target.value) || "") {
                  setTelephone(e.target.value);
                }
              }}
            />
          </Box>
          <Typography variant="h5">Family Information</Typography>
          <Box marginBottom="40px">
            <Box
              sx={{
                display: "grid",
                width: "100%",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
                gap: "20px",
                mt: 2,
              }}
            >
              <TextField
                size="small"
                autoComplete="off"
                variant="outlined"
                label="Father Name"
                placeholder="Full name"
                value={fatherName}
                onChange={(e) => {
                  if (e.target.value.trim().length === 0) {
                    setFatherName("");
                  } else {
                    if (isLetters(e.target.value)) {
                      setFatherName(e.target.value);
                    }
                  }
                }}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
              <TextField
                size="small"
                autoComplete="off"
                variant="outlined"
                label="Mobile Number"
                value={fatherContact}
                placeholder="10 Digit Mobile Number"
                inputProps={{ maxLength: 10 }}
                onChange={(e) => {
                  if (isNumber(e.target.value) || "") {
                    setFatherContact(e.target.value);
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <>
                      <Typography>+63</Typography>
                      <Divider
                        sx={{ height: 28, m: 0.5 }}
                        orientation="vertical"
                      />
                    </>
                  ),
                }}
              />
              <span></span>
              <TextField
                size="small"
                autoComplete="off"
                variant="outlined"
                label="Mother Name"
                placeholder="Full name"
                value={motherName}
                onChange={(e) => {
                  if (e.target.value.trim().length === 0) {
                    setMotherName("");
                  } else {
                    if (isLetters(e.target.value)) {
                      setMotherName(e.target.value);
                    }
                  }
                }}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
              <TextField
                size="small"
                autoComplete="off"
                variant="outlined"
                label="Mobile Number"
                value={motherContact}
                placeholder="10 Digit Mobile Number"
                inputProps={{ maxLength: 10 }}
                onChange={(e) => {
                  if (isNumber(e.target.value) || "") {
                    setMotherContact(e.target.value);
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <>
                      <Typography>+63</Typography>
                      <Divider
                        sx={{ height: 28, m: 0.5 }}
                        orientation="vertical"
                      />
                    </>
                  ),
                }}
              />{" "}
              <span></span>
              <TextField
                size="small"
                required
                autoComplete="off"
                variant="outlined"
                label="Emergency Contact Name"
                placeholder="Full name"
                value={emergencyName}
                onChange={(e) => {
                  if (e.target.value.trim().length === 0) {
                    setEmergencyName("");
                  } else {
                    if (isLetters(e.target.value)) {
                      setEmergencyName(e.target.value);
                    }
                  }
                }}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
              <TextField
                size="small"
                required
                autoComplete="off"
                variant="outlined"
                label="Relationship"
                placeholder="Relationship"
                value={emergencyRelationship}
                onChange={(e) => {
                  if (e.target.value.trim().length === 0) {
                    setEmergencyRelationship("");
                  } else {
                    if (isLetters(e.target.value)) {
                      setEmergencyRelationship(e.target.value);
                    }
                  }
                }}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
              <TextField
                required
                size="small"
                autoComplete="off"
                variant="outlined"
                label="Mobile Number"
                value={emergencyNumber}
                placeholder="10 Digit Mobile Number"
                inputProps={{ maxLength: 10 }}
                onChange={(e) => {
                  if (isNumber(e.target.value) || "") {
                    setEmergencyNumber(e.target.value);
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <>
                      <Typography>+63</Typography>
                      <Divider
                        sx={{ height: 28, m: 0.5 }}
                        orientation="vertical"
                      />
                    </>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* //! button */}
          <Box
            display="flex"
            sx={{ justifyContent: { xs: "center", sm: "end" } }}
            height="70px"
            gap={2}
          >
            <Button
              type="button"
              variant="contained"
              color="secondary"
              sx={{ width: "250px", height: "50px" }}
              onClick={() => {
                clearFields();
              }}
            >
              <Typography variant="h5">clear</Typography>
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={LRNError || dateOfBirthError}
              sx={{ width: "250px", height: "50px" }}
            >
              <Typography variant="h5">submit</Typography>
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default StudentCreate;
