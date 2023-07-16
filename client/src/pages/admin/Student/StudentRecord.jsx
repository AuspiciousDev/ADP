import React from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Divider,
  ButtonBase,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Delete,
  CheckCircle,
  Cancel,
  Add,
  Search,
  MoreVert,
  School,
  LocalPrintshopOutlined,
  DescriptionOutlined,
  ScheduleOutlined,
} from "@mui/icons-material";
import { useStudentsContext } from "../../../hooks/useStudentsContext";
import { useEnrollmentsContext } from "../../../hooks/useEnrollmentContext";

import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";

import { tokens } from "../../../theme";

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { format } from "date-fns-tz";
import { useNavigate, useLocation } from "react-router-dom";
import Paper_Icon from "../../../components/global/Paper_Icon";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbar
      // printOptions={{
      //   fields: ["schoolYearID", "fullName", "userType", "createdAt"],
      // }}
      // csvOptions={{ fields: ["username", "firstName"] }}
      />
      {/* <GridToolbarExport */}

      {/* /> */}
    </GridToolbarContainer>
  );
}

const StudentRecord = () => {
  const { LRN } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();

  const { students, studDispatch } = useStudentsContext();
  const { enrollments, enrollDispatch } = useEnrollmentsContext();
  const [val, setVal] = useState([]);
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

  const [page, setPage] = React.useState(10);

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });

        const apiStudent = await axiosPrivate.get(`/api/students/${LRN}`);
        if (apiStudent.status === 200) {
          const json = await apiStudent.data;
          console.log(json);
          setVal(json);
        }

        const apiEnrollments = await axiosPrivate.get(`/api/enrollments`);
        if (apiEnrollments.status === 200) {
          const json = await apiEnrollments.data;
          enrollDispatch({ type: "SET_ENROLLMENTS", payload: json });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log(
          "🚀 ~ file: Student.jsx:103 ~ getUsersDetails ~ error",
          error
        );
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
    getUsersDetails();
  }, [studDispatch]);

  const handleDelete = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      setLoadingDialog({ isOpen: true });
      const response = await axiosPrivate.delete(
        `/api/students/delete/${val.LRN}`
      );
      const json = await response.data;
      if (response.status === 200) {
        console.log(response.data.message);
        studDispatch({ type: "DELETE_STUDENT", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `Student ${val?.LRN} has been Deleted!`,
        });
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
        console.log(error.response.data.message);
      } else if (error.response.status === 404) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else if (error.response.status === 403) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        navigate("/login", { state: { from: location }, replace: true });
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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const columns = [
    {
      field: "schoolYearID",
      headerName: "School Year ID",
    },
    {
      field: "createdAt",
      headerName: "Date Enrolled",
      width: 180,
      valueFormatter: (params) =>
        format(new Date(params?.value), "MMMM dd, yyyy"),
    },
    {
      field: "levelID",
      headerName: "Level",
      valueFormatter: (params) => params?.value?.toUpperCase(),
    },
    {
      field: "sectionID",
      headerName: "Section",
      valueFormatter: (params) => params?.value?.toUpperCase(),
    },

    {
      field: "action",
      headerName: "Actions",
      width: 350,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link
              to={`/registrar/schedule/print/${params.row.enrollmentID}`}
              style={{ textDecoration: "none" }}
            >
              <Paper_Icon
                icon={<ScheduleOutlined />}
                color={`${colors.greenOnly[500]}`}
                title={`schedule`}
              />
            </Link>
            <Link
              to={`/registrar/enrollment/print/${params.row.enrollmentID}`}
              style={{ textDecoration: "none" }}
            >
              <Paper_Icon
                icon={<DescriptionOutlined />}
                color={`${colors.greenOnly[500]}`}
                title={`Registration`}
              />
            </Link>
          </Box>
        );
      },
    },
  ];
  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setIsLoading(true);
        setLoadingDialog({ isOpen: true });
        const apiStudent = await axiosPrivate.get(
          `/api/students/search/${LRN}`
        );
        if (apiStudent.status === 200) {
          const json = await apiStudent.data;
          console.log("Student GET : ", json);
          setVal(json);
        }
        const apiEnrolled = await axiosPrivate.get(
          `/api/students/search/${LRN}`
        );
        if (apiStudent.status === 200) {
          const json = await apiStudent.data;
          console.log("Student GET : ", json);
          setVal(json);
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log(
          "🚀 ~ file: StudentRecord.jsx:263 ~ getUsersDetails ~ error",
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
              STUDENT &#62; {LRN}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 2, mt: 2 }}
      >
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding="20px"
            gap={2}
          >
            <Paper
              sx={{
                borderRadius: "65px",
                width: "130px",
                height: "130px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                alt="profile-user"
                sx={{ width: "100%", height: "100%" }}
                src={val?.imgURL}
                style={{
                  cursor: "pointer",
                  objectFit: "contain",
                  borderRadius: "50%",
                }}
              />
            </Paper>
            <Typography
              variant="h3"
              fontWeight="bold"
              textTransform="capitalize"
              sx={{ mt: "10px" }}
              textAlign="center"
            >
              {val?.middleName
                ? val?.firstName +
                  " " +
                  val?.middleName.charAt(0) +
                  ". " +
                  val?.lastName
                : val?.firstName + " " + val?.lastName}
            </Typography>
            <Paper
              sx={{
                display: "flex",
                flexDirection: "row",
                borderRadius: "10px",
                padding: "10px 20px",
                alignItems: "center",
              }}
            >
              <School />
              <Typography sx={{ ml: "10px" }}>Student</Typography>
            </Paper>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="h6" textAlign="center">
                Date Created:
              </Typography>

              <Typography variant="h6" fontWeight={800}>
                {val?.createdAt &&
                  format(new Date(val?.createdAt), "MMMM dd, yyyy")}
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ position: "relative" }} elevation={2}>
          <Box sx={{ position: "absolute", top: 5, right: 5 }}>
            <IconButton onClick={handleClick}>
              <MoreVert sx={{ fontSize: "20pt" }} />
              {/* <PersonOutlinedIcon sx={{ fontSize: "20pt" }} /> */}
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
              <MenuItem>
                <Link
                  to={`/registrar/student/edit/${val?.LRN}`}
                  style={{
                    alignItems: "center",
                    color: colors.black[100],
                    textDecoration: "none",
                  }}
                >
                  Edit Profile
                </Link>
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ padding: 1, display: "grid", gridTemplateRows: "1fr" }}>
            <Box
              sx={{ display: "flex", flexDirection: "column" }}
              padding="10px 10px 0 10px"
            >
              <Typography variant="h4">Student Profile</Typography>
              <Box
                mt="10px"
                display="grid"
                sx={{
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr 1fr",
                  },
                }}
              >
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Gender : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.gender}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Date of Birth : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.dateOfBirth
                      ? format(new Date(val?.dateOfBirth), "MMMM dd, yyyy")
                      : ""}
                  </Typography>
                </Box>

                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Civil Status : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.civilStatus}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Nationality : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.nationality}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Religion : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.religion}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mt: "20px" }} />
            </Box>
            <Box padding="10px 10px 0 10px">
              <Typography variant="h4"> Address Information</Typography>
              <Box
                mt="10px"
                display="grid"
                sx={{
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr 1fr",
                  },
                }}
              >
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Address : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.address}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>City : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.city}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Province : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.province}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mt: "20px" }} />
            </Box>
            <Box padding="10px 10px 0 10px">
              <Typography variant="h4">Contact Information</Typography>
              <Box
                mt="10px"
                display="grid"
                sx={{
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr 1fr",
                  },
                }}
              >
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Email : </Typography>
                  <Typography ml="10px" fontWeight="bold">
                    {val?.email}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Telephone : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.telephone}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Mobile Number : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.mobile && "+63" + val?.mobile}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mt: "20px" }} />
            </Box>
            <Box padding="10px 10px 10px 10px">
              <Typography variant="h4">Emergency Information</Typography>
              <Box
                mt="10px"
                display="grid"
                sx={{
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr 1fr",
                  },
                }}
              >
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Contact Name : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.emergencyName}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Contact Relationship :</Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.emergencyRelationship}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Contact Number :</Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.emergencyNumber && "+63" + val?.emergencyNumber}{" "}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          mt: 2,
        }}
      >
        <Box sx={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={
              enrollments
                ? enrollments.filter((filter) => {
                    return filter.LRN === LRN;
                  })
                : []
            }
            getRowId={(row) => row._id}
            columns={columns}
            pageSize={page}
            onPageSizeChange={(newPageSize) => setPage(newPageSize)}
            rowsPerPageOptions={[10, 25]}
            pagination
            sx={{
              "& .MuiDataGrid-cell": {
                textTransform: "capitalize",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
              },
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  updateAt: false,
                  _id: false,
                },
              },
            }}
            components={{
              Toolbar: CustomToolbar,
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentRecord;
