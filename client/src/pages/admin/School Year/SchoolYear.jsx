import {
  Box,
  Paper,
  Typography,
  useTheme,
  Button,
  InputBase,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
  ButtonBase,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { tokens } from "../../../theme";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import {
  Add,
  Search,
  Cancel,
  CheckCircle,
  Bookmark,
  Delete,
  DeleteOutline,
  ArchiveOutlined,
} from "@mui/icons-material";

import { useSchoolYearsContext } from "../../../hooks/useSchoolYearsContext";

import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";

import { format } from "date-fns-tz";
import useAuth from "../../../hooks/useAuth";
import Paper_Active from "../../../components/global/Paper_Active";
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
const SchoolYear = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { years, yearDispatch } = useSchoolYearsContext();

  const [schoolYearID, setSchoolYearID] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [search, setSearch] = useState();

  const [schoolYearIDError, setSchoolYearIDError] = useState(false);
  const [schoolYearError, setSchoolYearError] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = React.useState(15);
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
    clearFields();
  };
  const clearFields = () => {
    setSchoolYearID("");
    setSchoolYear("");
    setSchoolYearIDError(false);
    setSchoolYearError(false);
    setError(false);
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

  const columns = [
    {
      field: "schoolYearID",
      headerName: "School Year ID",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Typography fontWeight={600} textTransform="uppercase">
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: "schoolYear",
      headerName: "School Year",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 250,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        format(new Date(params?.value), "MMMM dd, yyyy"),
    },
    {
      field: "updatedAt",
      headerName: "Date Modified",
      width: 240,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        format(new Date(params?.value), "MMMM dd, yyyy"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 2 }}>
            {auth.userType === "registrar" && (
              <ButtonBase
                onClick={() => {
                  setValidateDialog({
                    isOpen: true,
                    onConfirm: () => {
                      setConfirmDialog({
                        isOpen: true,
                        title: `Are you sure to change status of  ${params?.row?.schoolYear}`,
                        message: `${
                          params?.value === true
                            ? "ACTIVE to ARCHIVED"
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
                  <Paper_Active icon={<ArchiveOutlined />} title={"acrhived"} />
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
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            {auth.userType === "registrar" && (
              <ButtonBase
                onClick={(event) => {
                  handleCellClick(event, params);
                }}
              >
                <Paper_Icon icon={<DeleteOutline />} color={`red`} />
              </ButtonBase>
            )}
          </>
        );
      },
    },
  ];
  const rows = [
    yearData("", ""),
    yearData("2022", "2021-2022"),
    yearData("2023", "2022-2023"),
    yearData("2024", "2023-2024"),
    yearData("2025", "2024-2025"),
    yearData("2026", "2025-2026"),
    yearData("2027", "2026-2027"),
    yearData("2028", "2027-2028"),
    yearData("2029", "2028-2029"),
    yearData("2030", "2029-2030"),
  ];
  function yearData(schoolYearID, schoolYear) {
    return { schoolYearID, schoolYear };
  }

  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get("/api/schoolyears");
        if (response.status === 200) {
          const json = await response.data;
          console.log("School Year GET: ", json);
          yearDispatch({ type: "SET_YEARS", payload: json });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        console.log(error);
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
    getData();
  }, [yearDispatch]);

  const handleSubmit = async (e) => {
    setLoadingDialog({ isOpen: true });
    e.preventDefault();
    const data = {
      schoolYearID,
      schoolYear,
    };

    if (!error) {
      try {
        const response = await axiosPrivate.post(
          "/api/schoolyears/register",
          JSON.stringify(data)
        );

        if (response.status === 201) {
          const json = await response.data;
          console.log("response;", json);
          yearDispatch({ type: "CREATE_YEAR", payload: json });
          setOpen(false);
          setSuccessDialog({
            isOpen: true,
            message: "School Year has been added!",
          });
          setLoadingDialog({ isOpen: false });
        }
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        console.log(error);
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response`,
          });
        } else if (error.response.status === 400) {
          setError(true);
          setErrorMessage(error.response.data.message);
          setSchoolYearIDError(true);
          console.log(error.response.data.message);
        } else if (error.response.status === 404) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 409) {
          setSchoolYearIDError(true);
          setError(true);
          setErrorMessage(error.response.data.message);
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
    } else {
      return;
    }
  };
  const handleDelete = async ({ val }) => {
    setLoadingDialog({ isOpen: true });
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      const response = await axiosPrivate.delete(
        `/api/schoolyears/delete/${val}`
      );
      const json = await response.data;
      if (response.status === 200) {
        console.log(response.data.message);
        yearDispatch({ type: "DELETE_YEAR", payload: json });
      }
      const apiSY = await axiosPrivate.get("/api/schoolyears", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (apiSY?.status === 200) {
        const syJSON = await apiSY.data;
        console.log(syJSON);
        yearDispatch({ type: "SET_YEARS", payload: syJSON });
        setSuccessDialog({
          isOpen: true,
          message: "School Year has been Deleted!",
        });
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      console.log(error);
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
      }
    }
  };
  const toggleStatus = async ({ val }) => {
    console.log(
      "🚀 ~ file: SchoolYear.jsx:421 ~ toggleStatus ~ val",
      val.schoolYearID
    );
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
    if (val.status === true) newStatus = false;

    try {
      setLoadingDialog({ isOpen: true });
      const response = await axiosPrivate.patch(
        `/api/schoolyears/status/${val.schoolYearID}`,
        JSON.stringify({ schoolYearID: val.schoolYearID, status: newStatus })
      );
      if (response.status === 200) {
        const response2 = await axiosPrivate.get("/api/schoolyears");
        if (response2?.status === 200) {
          console.log("success");
          const json = await response2.data;
          console.log("School Year PATCH: ", json);
          yearDispatch({ type: "SET_YEARS", payload: json });
          setSuccessDialog({ isOpen: true });
          console.log("success");
        }
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      console.log(error);
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
      }
    }
  };
  const handleCellClick = (event, params) => {
    event.stopPropagation();
    setValidateDialog({
      isOpen: true,
      onConfirm: () => {
        setConfirmDialog({
          isOpen: true,
          title: `Are you sure to delete School Year ${params.row.schoolYear}`,
          message: `This action is irreversible!`,
          onConfirm: () => {
            handleDelete({ val: params.row.schoolYearID });
          },
        });
      },
    });
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
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <Box
          className="modal-small-form"
          style={{
            border: `solid 1px ${colors.black[200]}`,
            backgroundColor: colors.black[900],
          }}
        >
          <IconButton className="close" onClick={closeModal} disableRipple>
            <Cancel />
            {/* <Typography variant="h4">&times;</Typography> */}
          </IconButton>

          <Box
            className="header"
            sx={{ borderBottom: `2px solid ${colors.primary[900]}` }}
          >
            <Typography variant="h3">ADD SCHOOL YEAR</Typography>
          </Box>
          <div className="content">
            <Box
              className="formContainer"
              display="block"
              width="100%"
              flexDirection="column"
              justifyContent="center"
            >
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                {/* <Typography variant="h5">Registration</Typography> */}

                <Typography variant="h5" sx={{ margin: "25px 0 10px 0" }}>
                  School Year Information
                </Typography>
                <Box marginBottom="20px">
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <FormControl variant="standard" required fullWidth>
                      <InputLabel htmlFor="demo-customized-select-native">
                        School Year
                      </InputLabel>

                      <NativeSelect
                        id="demo-customized-select-native"
                        value={schoolYearID}
                        error={schoolYearIDError}
                        onChange={(e) => {
                          setSchoolYearID(e.target.value);
                          setError(false);
                          setSchoolYearIDError(false);
                          setSchoolYearError(false);
                          rows
                            .filter((val) => {
                              return val.schoolYearID === e.target.value;
                            })
                            .map((data) => {
                              return setSchoolYear(data.schoolYear);
                            });
                        }}
                      >
                        {rows.map((data) => {
                          return (
                            <option
                              key={data.schoolYearID}
                              value={data.schoolYearID}
                            >
                              {data.schoolYear}
                            </option>
                          );
                        })}
                      </NativeSelect>
                    </FormControl>
                  </Box>
                </Box>
                {error && <Typography color="red">{errorMessage}</Typography>}

                <Box
                  display="flex"
                  justifyContent="end"
                  sx={{ margin: "40px 0 20px 0" }}
                >
                  <div className="actions">
                    <Button
                      type="button"
                      variant="contained"
                      color="secondary"
                      sx={{
                        width: "200px",
                        height: "50px",
                        marginLeft: "20px",
                      }}
                      onClick={closeModal}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: colors.whiteOnly[100] }}
                      >
                        CANCEL
                      </Typography>
                    </Button>
                    <Button
                      type="submit"
                      disabled={!schoolYearID || schoolYearError || error}
                      variant="contained"
                      sx={{
                        width: "200px",
                        height: "50px",
                        marginLeft: "20px",
                      }}
                    >
                      <Typography variant="h6">Confirm</Typography>
                    </Button>
                  </div>
                </Box>
              </form>
            </Box>
          </div>
        </Box>
      </Popup>
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
              }}
            >
              SCHOOL YEAR
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
            <Paper
              elevation={3}
              sx={{
                display: "none",
                width: { xs: "100%", sm: "320px" },
                height: "50px",
                minWidth: "250px",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: "0 20px", sm: "0 20px" },
                mr: { xs: "0", sm: " 10px" },
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Year"
                onChange={(e) => {
                  setSearch(e.target.value.toLowerCase());
                }}
                value={search}
              />
              <Divider sx={{ height: 30, m: 1 }} orientation="vertical" />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <Search />
              </IconButton>
            </Paper>

            <Button
              type="button"
              startIcon={<Add />}
              onClick={() => setOpen((o) => !o)}
              // onClick={() => {
              //   setSuccessDialog({
              //     isOpen: true,
              //   });
              // }}
              // onClick={() => {
              //   setValidateDialog({
              //     isOpen: true,
              //   });
              // }}
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "200px" },
                height: "50px",
                marginLeft: { xs: "0", sm: "20px" },
                marginTop: { xs: "20px", sm: "0" },
              }}
            >
              <Typography variant="h6" fontWeight="500">
                Add Year
              </Typography>
            </Button>
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
            rows={years ? years && years : []}
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
                  updatedAt: false,
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

export default SchoolYear;
