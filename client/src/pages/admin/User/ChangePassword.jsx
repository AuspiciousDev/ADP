import React from "react";
import { useEffect, useState, useRef } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  FastfoodOutlined,
  CancelOutlined,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import useAuth from "../../../hooks/useAuth";

import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Paper_Title from "../../../components/global/Paper_Title";

const ChangePassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const { auth } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confPasswordError, setConfPasswordError] = useState(false);
  const [testPassError, setTestPassError] = useState(false);

  const [testPassMessage, setTestPassMessage] = useState([]);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const handleMouseDownOldPassword = () => setShowOldPassword(!showOldPassword);

  const clearFields = () => {
    setOldPassword("");
    setPassword("");
    setConfPassword("");
  };
  const changePassword = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    if (password !== confPassword) {
      return (
        setPasswordError(true),
        setConfPasswordError(true),
        setLoadingDialog({ isOpen: false }),
        setErrorDialog({
          isOpen: true,
          message: `Password doesn't match!`,
        })
      );
    }
    const data = {
      username: auth.username,
      password: oldPassword,
      newPassword: password,
    };
    try {
      if (!oldPasswordError && !passwordError && !confPasswordError) {
        const response = await axiosPrivate.post(
          "/auth/change-password",
          JSON.stringify(data)
        );

        if (response.status === 200) {
          const json = await response.data;
          console.log("response;", json);
          setOldPassword("");
          setPassword("");
          setConfPassword("");
          setLoadingDialog({ isOpen: false });
          setSuccessDialog({
            isOpen: true,
            // message: `Registration of ${json.userType} - ${json.username} Success!`,
            message: `${json.message}`,
          });
        }
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      if (!error?.response) {
        setErrorDialog({
          isOpen: true,
          message: `No server response`,
        });
      } else if (error.response.status === 400) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        setOldPasswordError(true);
        setPasswordError(true);
        setConfPasswordError(true);

        console.log(error.response.data.message);
      } else if (error.response.status === 404) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else if (error.response.status === 500) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
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

  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const testPassword = (str) => {
    setTestPassMessage([]);
    if (str !== "") {
      var lowerCaseLetters = /[a-z]/.test(str);
      var upperCaseLetters = /[A-Z]/.test(str);
      var specialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(str);
      var numbers = /[0-9]/.test(str);
      var passLength;
      str.length < 12 ? (passLength = true) : (passLength = false);
      !lowerCaseLetters && setTestPassMessage((prev) => [...prev, "lowerCase"]);
      !upperCaseLetters && setTestPassMessage((prev) => [...prev, "upperCase"]);
      !specialChar && setTestPassMessage((prev) => [...prev, "specialChar"]);
      !numbers && setTestPassMessage((prev) => [...prev, "numbers"]);
      passLength && setTestPassMessage((prev) => [...prev, "length"]);
      if (!lowerCaseLetters && !upperCaseLetters && !specialChar && !numbers) {
        setPasswordError(true);
      }
    }
  };
  const testPasswordMatch = (str) => {
    if (password !== str) {
      setPasswordError(true);
      setConfPasswordError(true);
    }
  };

  const PasswordErrorsMessage = (props) => {
    return (
      <Box sx={{ display: "flex", gap: 2 }}>
        <CancelOutlined sx={{ color: "red" }} />
        <Typography sx={{ color: "red" }}>
          {props.text === "lowerCase"
            ? "Lower Case Letter"
            : props.text === "upperCase"
            ? "Upper Case Letter"
            : props.text === "specialChar"
            ? "Special Character"
            : props.text === "numbers"
            ? "Atleast one Number"
            : props.text === "length"
            ? "Length must be 12 or more"
            : ""}
        </Typography>
      </Box>
    );
  };

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
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <Paper_Title title={"CHANGE PASSWORD"} button={false} />
      <Paper
        className="contents-body"
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 2,
          p: 2,
        }}
      >
        <Box width="100%">
          <form onSubmit={changePassword} style={{ width: "100%" }}>
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              sx={{ width: { xs: "100#", sm: "30%" } }}
            >
              <TextField
                required
                type={showOldPassword ? "text" : "password"}
                name="password"
                autoComplete="off"
                variant="outlined"
                placeholder="Current Password"
                value={oldPassword}
                error={oldPasswordError}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  setOldPasswordError(false);
                  setPasswordError(false);
                  setConfPasswordError(false);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowOldPassword}
                        onMouseDown={handleMouseDownOldPassword}
                      >
                        {showOldPassword ? (
                          <VisibilityOutlined />
                        ) : (
                          <VisibilityOffOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText={oldPasswordError ? "Invalid password" : ""}
              />
              <TextField
                required
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="off"
                variant="outlined"
                placeholder="New Password"
                value={password}
                error={passwordError}
                onChange={(e) => {
                  setPasswordError(false);
                  setConfPasswordError(false);
                  setPassword(e.target.value);
                  testPassword(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? (
                          <VisibilityOutlined />
                        ) : (
                          <VisibilityOffOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText={passwordError ? "Invalid password" : ""}
              />
              {password ? (
                <Box>
                  <Paper
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      mt: "-10px",
                      height: "5px",
                      backgroundColor: "#f4f4f4",
                    }}
                  >
                    {testPassMessage.length === 0 ? (
                      <>
                        <Box
                          sx={{
                            width: "100%",
                            backgroundColor: `${colors.primary[500]}`,
                          }}
                        />
                        <Box
                          sx={{
                            width: "100%",
                            backgroundColor: `${colors.primary[500]}`,
                          }}
                        />
                        <Box
                          sx={{
                            width: "100%",
                            backgroundColor: `${colors.primary[500]}`,
                          }}
                        />
                        <Box
                          sx={{
                            width: "100%",
                            backgroundColor: `${colors.primary[500]}`,
                          }}
                        />
                      </>
                    ) : testPassMessage.length === 1 ? (
                      <>
                        <Box
                          sx={{
                            width: "100%",
                            backgroundColor: `${colors.secondary[200]}`,
                          }}
                        />
                        <Box
                          sx={{
                            width: "100%",
                            backgroundColor: `${colors.secondary[200]}`,
                          }}
                        />
                        <Box
                          sx={{
                            width: "100%",
                            backgroundColor: `${colors.secondary[200]}`,
                          }}
                        />
                      </>
                    ) : testPassMessage.length > 1 &&
                      testPassMessage.length < 4 ? (
                      <>
                        <Box
                          sx={{ width: "100%", backgroundColor: "orange" }}
                        />
                        <Box
                          sx={{ width: "100%", backgroundColor: "orange" }}
                        />
                      </>
                    ) : testPassMessage.length >= 4 ? (
                      <>
                        <Box sx={{ width: "100%", backgroundColor: "red" }} />
                      </>
                    ) : (
                      <></>
                    )}
                  </Paper>

                  {testPassMessage.length === 0 ? (
                    <Typography sx={{ color: `${colors.primary[500]}` }}>
                      Very Strong
                    </Typography>
                  ) : testPassMessage.length === 1 ? (
                    <Typography sx={{ color: `${colors.secondary[100]}` }}>
                      Strong
                    </Typography>
                  ) : testPassMessage.length > 1 &&
                    testPassMessage.length < 4 ? (
                    <Typography sx={{ color: "orange" }}>Weak</Typography>
                  ) : testPassMessage.length >= 4 ? (
                    <Typography sx={{ color: "red" }}>Very Weak</Typography>
                  ) : (
                    <></>
                  )}
                </Box>
              ) : (
                <></>
              )}

              {testPassMessage.length > 0 ? (
                <Paper sx={{ p: 1 }}>
                  <Typography sx={{ mb: 2 }}>
                    Your Password must include:
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {testPassMessage.map((val) => {
                      return <PasswordErrorsMessage text={val} />;
                    })}
                  </Box>
                </Paper>
              ) : (
                <></>
              )}
              {password !== "" && testPassMessage.length === 0 ? (
                <TextField
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="off"
                  variant="outlined"
                  placeholder="Confirm Password"
                  value={confPassword}
                  error={confPasswordError}
                  onChange={(e) => {
                    setPasswordError(false);
                    setConfPasswordError(false);
                    setConfPassword(e.target.value);
                    testPasswordMatch(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? (
                            <VisibilityOutlined />
                          ) : (
                            <VisibilityOffOutlined />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={confPasswordError ? "Invalid password" : ""}
                />
              ) : (
                <></>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  gap: 2,
                  mt: 2,
                  "& > button": {
                    width: "20em",
                    height: "4em",
                  },
                }}
              >
                <Button
                  disabled={
                    passwordError ||
                    confPasswordError ||
                    testPassMessage.length > 0 ||
                    !oldPassword
                  }
                  type="submit"
                  variant="contained"
                >
                  <Typography variant="h4">Submit</Typography>
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={(e) => {
                    clearFields();
                    navigate("/registrar");
                  }}
                >
                  <Typography variant="h4">Cancel</Typography>
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChangePassword;
