import React from "react";
import { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Divider,
  useTheme,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  PersonOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import collaboration from "../../assets/collaboration.svg";
import logo from "../../assets/wow6.png";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import LoadingDialogue from "../../global/LoadingDialogue";
import ErrorDialogue from "../../global/ErrorDialogue";
const Login = () => {
  const isNumber = (str) => /^[0-9]*$/.test(str);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { auth, setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [formError, setFormError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
  });
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    if (!usernameError && !passwordError) {
      setLoadingDialog({ isOpen: true });
      try {
        const apiLogin = await axios.post(
          "/auth/login",
          JSON.stringify({ username, password })
        );
        if (apiLogin.status === 200) {
          setUsername("");
          setPassword("");
          const data = apiLogin?.data;
          const username = data?.username;
          const userType = data?.userType;
          const accessToken = data?.accessToken;
          const firstName = data?.firstName;
          const lastName = data?.lastName;
          const imgURL = data?.imgURL;
          setPersist(true);
          setAuth({
            username,
            userType,
            accessToken,
            firstName,
            lastName,
            imgURL,
          });
          from === "/"
            ? navigate("/registrar", { replace: true })
            : navigate(from, { replace: true });
          // from === "/" && userType === "admin"
          //   ? navigate("/admin", { replace: true })
          //   : from === "/" && userType === "registrar"
          //   ? navigate("/registrar", { replace: true })
          //   : navigate(from, { replace: true });
        }
        localStorage.setItem("newLogin", true);

        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log("🚀 ~ file: Login.jsx:109 ~ handleSubmit ~ error", error);
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response!`,
          });
        } else if (error.response.status === 401) {
          setUsernameError(true);
          setPasswordError(true);
          setFormError(true);
          setFormErrorMessage(error.response.data.message);
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
        }
      }
    }
  };
  return (
    <Box
      className="container-main"
      sx={{
        background:
          " linear-gradient(90deg, rgba(0, 51, 51, 1) 0%, rgba(255,255,255,1) 100%)",
      }}
    >
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <Paper
        elevation={2}
        className="container-login"
        sx={{ width: "90%", borderRadius: 5 }}
      >
        <Box className="container-column" sx={{ width: "60%" }}>
          <Typography
            variant="h1"
            fontWeight={600}
            textTransform="uppercase"
            textAlign="center"
          >
            Academia De Pulilan Enrollment System
          </Typography>
          <Box
            sx={{
              width: { lg: "350px", xl: "650px" },
              m: { lg: 0, xl: 2 },
            }}
          >
            <img style={{ width: "100%" }} src={logo} alt="welcome" />
          </Box>
          <Typography variant="h6" sx={{ mb: 2 }} textAlign="center">
            School children playing on swings and see-saws in the fresh country
            air, their laughter echoing across the vast expanse of land, and
            teachers giving lessons under the shade of a big tree – this was the
            vision that Avelino and Precy Ignacio had for the establishment of a
            school that would benefit the ones closest to their hearts:
            children.
          </Typography>
        </Box>
        <Divider
          sx={{
            height: 300,
            width: "1px",
            m: "3em",
            backgroundColor: colors.greenOnly[500],
          }}
          orientation="vertical"
        />

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            maxWidth: "30em",
            marginTop: "1em",
            marginBottom: "1em",
          }}
        >
          <Box className="container-column" sx={{ gap: 1.5 }}>
            <Typography
              variant="h1"
              fontWeight={600}
              textAlign="start"
              sx={{ marginBottom: "1.5em" }}
              textTransform="uppercase"
            >
              Welcome back!
            </Typography>
            <TextField
              required
              fullWidth
              label="Username"
              variant="outlined"
              autoComplete="off"
              error={usernameError}
              value={username}
              onChange={(e) => {
                if (isNumber(e.target.value)) {
                  setUsername(e.target.value);
                  setUsernameError(false);
                  setPasswordError(false);
                  setFormError(false);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      "& > svg": {
                        color: colors.primary[100],
                      },
                    }}
                  >
                    <PersonOutlined />
                    <Divider
                      sx={{ height: 30, m: 0.5 }}
                      orientation="vertical"
                    />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              variant="outlined"
              autoComplete="off"
              error={passwordError}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setUsernameError(false);
                setPasswordError(false);
                setFormError(false);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      "& > svg": {
                        color: colors.primary[100],
                      },
                    }}
                  >
                    <LockOutlined />
                    <Divider
                      sx={{ height: 30, m: 0.5 }}
                      orientation="vertical"
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      sx={{
                        "& > svg": {
                          fontSize: "18px",
                          color: colors.primary[100],
                        },
                      }}
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
              sx={{ mt: 1 }}
            />
            {formError && (
              <Typography color="error" variant="subtitle2" sx={{ mt: 1 }}>
                {formError && formErrorMessage}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                "& > a": {
                  color: colors.primary[100],
                  textDecoration: "none",
                },
              }}
            >
              {/* <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={persist}
                    onChange={togglePersist}
                  />
                }
                label="Persist Session"
                color="primary"
              /> */}

              <Link to="/forgot-password">Forgot Password?</Link>
            </Box>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{
                borderRadius: 4,
                height: 45,
                backgroundColor: colors.greenOnly[500],
              }}
            >
              <Typography variant="h5" sx={{ color: colors.whiteOnly[500] }}>
                Login
              </Typography>
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
