import React from "react";
import {
  Box,
  Paper,
  ButtonBase,
  useTheme,
  Button,
  Typography,
  MenuItem,
  Divider,
  Menu,
} from "@mui/material";
import {
  Cancel,
  CheckCircle,
  EditOutlined,
  DeleteOutline,
  PersonAddOutlined,
  ScheduleOutlined,
  DescriptionOutlined,
  KeyboardArrowDown,
  Edit,
  FileCopy,
  GroupOutlined,
  PersonAdd,
  GroupAdd,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";

import { tokens } from "../../../theme";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Paper_Title from "../../../components/global/Paper_Title";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { useEnrollmentsContext } from "../../../hooks/useEnrollmentContext";
import { useSchedulesContext } from "../../../hooks/useScheduleContext";
import Paper_Active from "../../../components/global/Paper_Active";
import Paper_Icon from "../../../components/global/Paper_Icon";
import useAuth from "../../../hooks/useAuth";
import { format } from "date-fns-tz";
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

const StyledMenu = styled((props) => (
  <Menu
    elevation={1}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 200,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));
const Enrollment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { schedules, scheduleDispatch } = useSchedulesContext();
  const { enrollments, enrollDispatch } = useEnrollmentsContext();
  const [page, setPage] = React.useState(15);

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

  useEffect(() => {
    const getOverviewDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const apiEnrollees = await axiosPrivate.get("/api/enrollments");
        if (apiEnrollees.status === 200) {
          const json = await apiEnrollees.data;
          console.log(
            "🚀 ~ file: Enrollment.jsx:87 ~ getOverviewDetails ~ json",
            json
          );
          enrollDispatch({ type: "SET_ENROLLMENTS", payload: json });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log(
          "🚀 ~ file: Enrollment.jsx:91 ~ getOverviewDetails ~ error",
          error
        );

        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response`,
          });
        } else if (error.response.status === 400) {
          // setErrorDialog({
          //   isOpen: true,
          //   message: `${error.response.data.message}`,
          // });
          console.log(error.response.data.message);
        } else if (error.response.status === 404) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 409) {
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
        }
      }
    };
    getOverviewDetails();
  }, [enrollDispatch]);

  const columns = [
    {
      field: "schoolYearID",
      headerName: "School Year",
      width: 150,
    },
    {
      field: "LRN",
      headerName: "LRN",
      width: 150,
    },
    {
      field: "fullName",
      headerName: "Name",
      // description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 200,

      valueGetter: (params) =>
        `${params.row.details.firstName || ""} ${
          params.row.details.middleName || ""
        } ${params.row.details.lastName || ""}`,
    },
    {
      field: "levelID",
      headerName: "Level ID",
      width: 130,
      valueFormatter: (params) => params?.value.toUpperCase(),
    },
    {
      field: "term",
      headerName: "Term",
      width: 130,
      valueFormatter: (params) =>
        params?.value ? params?.value.toUpperCase() : "-",
    },
    {
      field: "strandID",
      headerName: "Strand ID",
      width: 130,
      valueFormatter: (params) =>
        params?.value ? params?.value.toUpperCase() : "-",
    },
    {
      field: "sectionID",
      headerName: "Section ID",
      width: 130,
      valueFormatter: (params) => params?.value.toUpperCase(),
    },

    {
      field: "createdAt",
      headerName: "Date Created",
      width: 240,
      valueFormatter: (params) =>
        format(new Date(params?.value), "hh:mm a - MMMM dd, yyyy"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 250,
      width: 175,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 2 }}>
            {" "}
            {auth.userType === "registrar" && (
              <ButtonBase
                onClick={() => {
                  setValidateDialog({
                    isOpen: true,
                    onConfirm: () => {
                      setConfirmDialog({
                        isOpen: true,
                        title: `Are you sure to change status of  ${params?.row?.scheduleID.toUpperCase()}`,
                        message: `${
                          params?.value === true
                            ? "ACTIVE to INACTIVE"
                            : "INACTIVE to ACTIVE"
                        }`,
                        onConfirm: () => {
                          toggleStatus({ val: params?.row });
                        },
                      });
                    },
                  });
                }}
              >
                {params?.value === true ? (
                  <Paper_Active icon={<CheckCircle />} title={"active"} />
                ) : (
                  <Paper_Active icon={<Cancel />} title={"inactive"} />
                )}
              </ButtonBase>
            )}
          </Box>
        );
      },
    },
    {
      field: "export",
      headerName: "Export",
      width: 350,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* <Link
              to={`/registrar/schedule/print/${params.row.schoolYearID}_${
                params.row.levelID + params.row.sectionID
              }_${params.row.term ? params.row.term : "none"}`}
              style={{ textDecoration: "none" }}
            > */}
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
    {
      field: "_id",
      headerName: "Action",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link
              to={`/registrar/enrollment/edit/${params.row.enrollmentID}`}
              style={{ textDecoration: "none" }}
            >
              <Paper_Icon icon={<EditOutlined />} />
            </Link>
            {auth.userType === "registrar" && (
              <ButtonBase
                onClick={(event) => {
                  handleCellClick(event, params);
                }}
              >
                <Paper_Icon icon={<DeleteOutline />} color={`red`} />
              </ButtonBase>
            )}
          </Box>
        );
      },
    },
  ];
  const handleCellClick = (event, params) => {
    event.stopPropagation();
    setValidateDialog({
      isOpen: true,
      onConfirm: () => {
        setConfirmDialog({
          isOpen: true,
          title: `Are you sure to delete Enrollment of ${params?.row?.LRN}`,
          message: `This action is irreversible!`,
          onConfirm: () => {
            handleDelete({ val: params.row });
          },
        });
      },
    });
  };
  const handleDelete = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      setLoadingDialog({ isOpen: true });

      const response = await axiosPrivate.delete(
        `api/enrollments/delete/${val.enrollmentID}`
      );
      const json = await response.data;
      if (response.status === 200) {
        console.log(json);
        enrollDispatch({ type: "DELETE_ENROLLMENT", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `${val.LRN.toUpperCase()} enrollment has been deleted!`,
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
      } else if (error.response.status === 409) {
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

  const [anchorEl, setAnchorEl] = useState();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSingle = () => {
    setAnchorEl(null);
    navigate("create");
  };
  const handleBulk = () => {
    setAnchorEl(null);
    navigate("bulk");
  };
  return (
    <Box className="container-layout_body_contents">
      <ConfirmDialogue
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
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
              Enrollment
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <Button
              id="demo-customized-button"
              aria-controls={open ? "demo-customized-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              variant="contained"
              disableElevation
              onClick={handleClick}
              endIcon={<KeyboardArrowDown />}
              sx={{
                width: { xs: "100%", sm: "200px" },
                height: "50px",
                marginLeft: { xs: "0", sm: "20px" },
                marginTop: { xs: "20px", sm: "0" },
              }}
            >
              Enroll Student
            </Button>

            <StyledMenu
              id="demo-customized-menu"
              MenuListProps={{
                "aria-labelledby": "demo-customized-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleSingle} disableRipple>
                <PersonAdd />
                Individual
              </MenuItem>
              <MenuItem onClick={handleBulk} disableRipple>
                <GroupAdd />
                Bulk
              </MenuItem>
            </StyledMenu>
          </Box>
        </Box>
      </Paper>
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
            rows={enrollments ? enrollments : []}
            getRowId={(row) => row._id}
            columns={columns}
            pageSize={page}
            onPageSizeChange={(newPageSize) => setPage(newPageSize)}
            rowsPerPageOptions={[15, 50]}
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
                  export: true,
                  status: false,
                  _id: false,
                  createdAt: false,
                  status: auth.userType === "registrar" ? true : false,
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

export default Enrollment;
