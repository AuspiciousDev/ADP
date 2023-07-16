import React from "react";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import { Box, Typography } from "@mui/material";
const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    !auth.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  // useEffect(() => {
  //   console.log(`isLoading: ${isLoading}`);
  //   console.log(`Access Token: ${JSON.stringify(auth?.accessToken)}`);
  // }, [isLoading]);
  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          flexDirection="column"
        >
          {/* <Typography variant="h3">Loading...</Typography> */}
        </Box>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
