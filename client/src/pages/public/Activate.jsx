import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  colors,
} from "@mui/material";
import { Done } from "@mui/icons-material";
import axios from "../../api/axios";
import { useState } from "react";
import ConfirmDialogue from "../../global/ConfirmDialogue";
import SuccessDialogue from "../../global/SuccessDialogue";
import ErrorDialogue from "../../global/ErrorDialogue";
import ValidateDialogue from "../../global/ValidateDialogue";
import LoadingDialogue from "../../global/LoadingDialogue";
import SuccessConfirmDialogue from "../../global/SuccessConfirmDialogue";

import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

import bgCover from "../../assets/wow6.png";
const ActivateUser = () => {
  const { activation_token } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [title, setTitle] = useState();
  const [message, setMessage] = useState();
  const [activate, setActivate] = useState(false);
  const navigate = useNavigate();

  const goLogin = async () => {
    navigate("/login");
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
  const [successConfirmDialog, setSuccessConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const activation = async () => {
    try {
      const data = { activation_token };
      setLoadingDialog({ isOpen: true });
      const activateAccount = await axios.post(
        "/auth/activate",
        JSON.stringify(data)
      );
      if (activateAccount.status === 200) {
        const json = await activateAccount.data;
        setLoadingDialog({ isOpen: false });
        setSuccessConfirmDialog({
          isOpen: true,
          title: `Registration Completed!`,
          message: `${json.message}`,
          onConfirm: () => {
            navigate("/");
          },
        });
        setActivate(true);
      }
    } catch (error) {
      setActivate(false);
      setLoadingDialog({ isOpen: false });
      if (!error?.response) {
        setErrorDialog({
          isOpen: true,
          message: `no server response`,
        });
      } else if (error.response.status === 400) {
        console.log(error.response.data.message);
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
      } else if (error.response.status === 409) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
      } else if (error.response.status === 404) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
      } else if (error.response.status === 500) {
        console.log(error.response.data.message);
        setErrorDialog({
          isOpen: true,
          message: `Your activation token is invalid.`,
        });
      } else {
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
        console.log(error);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(rgba(51, 50, 50, 0.5), rgba(51, 50, 50, 0.5)),
    url(${bgCover})`,
        backgroundSize: "cover",
        padding: { xs: 1, sm: 8 },
      }}
    >
      <SuccessConfirmDialogue
        successConfirmDialog={successConfirmDialog}
        setSuccessConfirmDialog={setSuccessDialog}
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
      <Paper
        sx={{
          // display: "flex",
          // justifyContent:"center",
          // alignItems:'center',
          display: "flex" /*added*/,
          flexDirection: "column" /*added*/,
          width: "100%",
          height: "100%",
          background: `linear-gradient(rgba(51, 50, 50, 0.5), rgba(51, 50, 50, 0.5))`,
          borderRadius: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: 5,
              backgroundColor: colors.black[900],
              borderRadius: 5,
              width: { xs: "100vmin", sm: "60vmin" },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                mb: 5,
                borderLeft: `5px solid ${colors.primary[900]}`,
                paddingLeft: 2,
              }}
            >
              Account activation
            </Typography>
            <Typography variant="h5" textAlign="center">
              One more step to use the student portal is to complete the
              registration by activating your account
            </Typography>

            <Typography variant="h5" textAlign="center" mt={4}>
              Click below to complete your registration
            </Typography>
            <br />
            {activate ? (
              <Button
                fullWidth
                type="button"
                variant="contained"
                onClick={goLogin}
              >
                Login
              </Button>
            ) : (
              <Button
                fullWidth
                sx={{ height: "50px" }}
                type="button"
                variant="contained"
                onClick={activation}
                startIcon={<Done />}
              >
                <Typography variant="h5">Activate account</Typography>
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ActivateUser;
