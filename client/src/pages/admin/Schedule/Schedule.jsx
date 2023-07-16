import React from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

import { Box, Paper, Typography, ButtonBase, useTheme } from "@mui/material";
import {
  Delete,
  CheckCircle,
  Add,
  LocalPrintshopOutlined,
  EditOutlined,
  DeleteOutline,
  ScheduleOutlined,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { tokens } from "../../../theme";
import { useLevelsContext } from "../../../hooks/useLevelContext";
import { useSectionsContext } from "../../../hooks/useSectionContext";
import { useDepartmentsContext } from "../../../hooks/useDepartmentContext";
import { useSchedulesContext } from "../../../hooks/useScheduleContext";

import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { format } from "date-fns-tz";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Paper_Title from "../../../components/global/Paper_Title";
import Paper_Icon from "../../../components/global/Paper_Icon";
import Paper_Active from "../../../components/global/Paper_Active";
import useAuth from "../../../hooks/useAuth";

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

const Schedule = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const { sections, secDispatch } = useSectionsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const { schedules, scheduleDispatch } = useSchedulesContext();

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

  const [page, setPage] = React.useState(15);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const apiSchedule = await axiosPrivate.get("/api/schedules");
        if (apiSchedule.status === 200) {
          const json = await apiSchedule.data;
          console.log(json);
          scheduleDispatch({ type: "SET_SCHEDULES", payload: json });
        }

        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log("🚀 ~ file: Schedule.jsx:173 ~ getData ~ error", error);
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
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
          console.log(error);
        }
      }
    };
    getData();
  }, [secDispatch, levelDispatch, depDispatch]);

  const columns = [
    {
      field: "schoolYearID",
      headerName: "School Year ID",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box display="flex" gap={2} width="60%">
            <Link
              to={`/registrar/schedule/print/${params?.row.scheduleID}`}
              style={{
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Paper
                sx={{
                  padding: "2px 20px",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: colors.whiteOnly[500],
                  alignItems: "center",
                }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{ color: colors.blackOnly[500] }}
                >
                  {params?.value}
                </Typography>
              </Paper>
            </Link>
          </Box>
        );
      },
    },
    {
      field: "depID",
      headerName: "Department ID",
      width: 130,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => params?.value.toUpperCase(),
    },
    {
      field: "levelID",
      headerName: "Level ID",
      width: 130,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => params?.value.toUpperCase(),
    },
    {
      field: "term",
      headerName: "Term",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "strandID",
      headerName: "Strand ID",
      width: 130,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        params?.value ? params?.value.toUpperCase() : "-",
    },
    {
      field: "sectionID",
      headerName: "Section ID",
      width: 130,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => params?.value.toUpperCase(),
    },

    {
      field: "createdAt",
      headerName: "Date Created",
      width: 240,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        format(new Date(params?.value), "hh:mm a - MMMM dd, yyyy"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 250,
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
      field: "_id",
      headerName: "Action",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link
              to={`/registrar/schedule/edit/${params.row.scheduleID}`}
              style={{ textDecoration: "none" }}
            >
              <Paper_Icon icon={<EditOutlined />} />
            </Link>

            <Link
              to={`/registrar/schedule/print/${params.row.scheduleID}`}
              style={{ textDecoration: "none" }}
            >
              <Paper_Icon
                icon={<LocalPrintshopOutlined />}
                color={colors.greenOnly[500]}
              />
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
          title: `Are you sure to delete section ${params?.row?.sectionID?.toUpperCase()}`,
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
      const response = await axiosPrivate.delete(
        `/api/schedules/delete/${val?.scheduleID}`
      );
      const json = await response.data;
      if (response.status === 200) {
        console.log(json);
        scheduleDispatch({ type: "DELETE_SCHEDULE", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `${json.levelID?.toUpperCase()} - ${json.sectionName?.toUpperCase()} has been deleted!`,
        });
      }
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
  const toggleStatus = async ({ val }) => {
    setLoadingDialog({ isOpen: true });
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    let newStatus = val.status;
    val.status === true
      ? (newStatus = false)
      : val.status === false
      ? (newStatus = true)
      : (newStatus = false);

    await console.log(val);
    await console.log(newStatus);
    try {
      const response = await axiosPrivate.patch(
        `/api/schedules/status/${val.scheduleID}`,
        JSON.stringify({ scheduleID: val.scheduleID, status: newStatus })
      );
      if (response.status === 200) {
        const json = await response.data;
        console.log(json);
        const response2 = await axiosPrivate.get("/api/schedules");
        if (response2?.status === 200) {
          const json = await response2.data;
          console.log(json);
          scheduleDispatch({ type: "SET_SCHEDULES", payload: json });
          setSuccessDialog({ isOpen: true });
          setLoadingDialog({ isOpen: false });
        }
      }
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

      <Paper_Title
        title={"schedules"}
        buttonTitle={"Add Schedule"}
        icon={<Add />}
        to={"create"}
        button={true}
      />
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
            rows={schedules ? schedules : []}
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

export default Schedule;
