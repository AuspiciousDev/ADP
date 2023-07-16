import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
const ADMIN_Layout = () => {
  return (
    <Box className="container-layout">
      <Sidebar />
      <Box className="container-layout_body">
        <Navbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default ADMIN_Layout;
