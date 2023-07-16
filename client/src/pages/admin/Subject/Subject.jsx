import React from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { tokens } from "../../../theme";

import { Link } from "react-router-dom";
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
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
} from "@mui/material";
import {
  Delete,
  CheckCircle,
  Cancel,
  Add,
  Search,
  DeleteOutline,
} from "@mui/icons-material";
import { useLevelsContext } from "../../../hooks/useLevelContext";
import { useSectionsContext } from "../../../hooks/useSectionContext";
import { useDepartmentsContext } from "../../../hooks/useDepartmentContext";
import { useStrandsContext } from "../../../hooks/useStrandContext";
import { useSubjectsContext } from "../../../hooks/useSubjectContext";

import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { format } from "date-fns-tz";
import { useNavigate, useLocation } from "react-router-dom";
import Popup from "reactjs-popup";
import { textTransform } from "@mui/system";
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

const Subject = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { subjects, subDispatch } = useSubjectsContext();
  const { sections, secDispatch } = useSectionsContext();
  const { strands, strandDispatch } = useStrandsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();

  const [sectionName, setSectionName] = useState("");

  const [subjectID, setSubjectID] = useState("");
  const [levelID, setLevelID] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [depID, setDepID] = useState("");
  const [strandID, setStrandID] = useState("");

  const [subjectIDError, setSubjectIDError] = useState(false);
  const [strandIDError, setStrandIDError] = useState(false);
  const [levelIDError, setLevelIDError] = useState(false);
  const [sectionNameError, setSectionNameError] = useState(false);
  const [subjectNameError, setSubjectNameError] = useState(false);
  const [depIDError, setDepIDError] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

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
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
    setLevelID("");
    setStrandID("");
    setSubjectID("");
    setSubjectName("");
    setError(false);
    setSubjectIDError(false);
    setSubjectNameError(false);
  };

  const [page, setPage] = React.useState(15);

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });

        const apiDepartment = await axiosPrivate.get("/api/departments");
        if (apiDepartment.status === 200) {
          const json = await apiDepartment.data;
          console.log(json);
          depDispatch({ type: "SET_DEPS", payload: json });
        }
        const apiStrands = await axiosPrivate.get("/api/strands");
        if (apiStrands.status === 200) {
          const json = await apiStrands.data;
          console.log(json);
          strandDispatch({ type: "SET_STRANDS", payload: json });
        }
        const apiLevels = await axiosPrivate.get("/api/levels");
        if (apiLevels.status === 200) {
          const json = await apiLevels.data;
          console.log(json);
          levelDispatch({ type: "SET_LEVELS", payload: json });
        }
        const apiSubjects = await axiosPrivate.get("/api/subjects");
        if (apiSubjects.status === 200) {
          const json = await apiSubjects.data;
          subDispatch({ type: "SET_SUBJECTS", payload: json });
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
  }, [subDispatch]);

  const handleDelete = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      setLoadingDialog({ isOpen: true });
      const response = await axiosPrivate.delete(
        `/api/subjects/delete/${val.subjectID}`
      );
      const json = await response.data;
      if (response.status === 200) {
        console.log(response.data.message);
        subDispatch({ type: "DELETE_SUBJECT", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `Subject ${val?.subjectID} has been Deleted!`,
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
  const toggleStatus = async ({ val }) => {
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
        `/api/subjects/status/${val?.subjectID}`,
        JSON.stringify({ status: newStatus })
      );
      if (response.status === 200) {
        const response2 = await axiosPrivate.get("/api/subjects");
        if (response2?.status === 200) {
          const json = await response2.data;

          subDispatch({ type: "SET_SUBJECTS", payload: json });
          setSuccessDialog({
            isOpen: true,
            message: `Subject ${val.subjectID} has been archived!`,
          });
        }
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      console.log("🚀 ~ file: Subject.jsx:235 ~ toggleStatus ~ error", error);
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

  const columns = [
    {
      field: "subjectID",
      headerName: "Subject ID",
      width: 200,
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
      field: "subjectName",
      headerName: "Subject Name",
      headerAlign: "center",
      align: "center",
      // description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 200,
    },
    {
      field: "levelID",
      headerName: "Level",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => params.value.toUpperCase(),
    },
    {
      field: "strandID",
      headerName: "Strand",
      width: 200,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        params?.value ? params?.value.toUpperCase() : "-",
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
      field: "updatedAt",
      headerName: "Date Modified",
      width: 240,
      valueFormatter: (params) =>
        format(new Date(params?.value), "hh:mm a - MMMM dd, yyyy"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 175,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            {auth.userType === "registrar" && (
              <ButtonBase
                onClick={() => {
                  setValidateDialog({
                    isOpen: true,
                    onConfirm: () => {
                      setConfirmDialog({
                        isOpen: true,
                        title: `Are you sure to archived subject ${params?.row?.subjectID}`,
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
          </>
        );
      },
    },
    {
      field: "_id",
      headerName: "Action",
      width: 175,
      sortable: false,
      align: "center",
      headerAlign: "center",
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
  const handleCellClick = (event, params) => {
    event.stopPropagation();
    setValidateDialog({
      isOpen: true,
      onConfirm: () => {
        setConfirmDialog({
          isOpen: true,
          title: `Are you sure to delete Subject ${params?.row?.subjectID}`,
          message: `This action is irreversible!`,
          onConfirm: () => {
            handleDelete({ val: params.row });
          },
        });
      },
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    const data = {
      subjectID,
      levelID,
      subjectName,
      strandID,
    };
    console.log(data);
    if (!error) {
      try {
        const response = await axiosPrivate.post(
          "/api/subjects/register",
          JSON.stringify(data)
        );

        if (response.status === 201) {
          const json = await response.data;
          console.log("response;", json);
          subDispatch({ type: "CREATE_SUBJECT", payload: json });
          setOpen(false);
          setSuccessDialog({
            isOpen: true,
            message: `${subjectID?.toUpperCase()} has been added!`,
          });
          setLoadingDialog({ isOpen: false });
        }
      } catch (error) {
        setLoadingDialog({ isOpen: false });

        const errResMessage = error.response.data.message;
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response`,
          });
        } else if (error.response.status === 400) {
          setErrorDialog({
            isOpen: true,
            message: `${errResMessage}`,
          });
          console.log(errResMessage);
        } else if (error.response.status === 404) {
          setErrorDialog({
            isOpen: true,
            message: `${errResMessage}`,
          });
          console.log(errResMessage);
        } else if (error.response.status === 409) {
          setError(true);
          setErrorMessage(errResMessage);
          setSubjectIDError(true);
          setSubjectNameError(true);
          console.log(errResMessage);
        } else if (error.response.status === 403) {
          setErrorDialog({
            isOpen: true,
            message: `${errResMessage}`,
          });
          navigate("/login", { state: { from: location }, replace: true });
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
          console.log(error);
        }
      }
    } else {
      setLoadingDialog({ isOpen: true });
      console.log(errorMessage);
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
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div
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
            <Typography variant="h3" textTransform="uppercase">
              ADD Subject
            </Typography>
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
                  Section Information
                </Typography>
                <Box marginBottom="40px">
                  <Box
                    sx={{
                      display: "grid",
                      width: "100%",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                    }}
                  >
                    <FormControl required>
                      <InputLabel required id="demo-simple-select-label">
                        Level
                      </InputLabel>
                      <NativeSelect
                        id="demo-customized-select-native"
                        error={levelIDError}
                        value={levelID}
                        label="Levels"
                        onChange={(e) => {
                          setLevelID(e.target.value);
                          console.log(e.target.value);
                        }}
                      >
                        <option aria-label="None" value="" />
                        {levels &&
                          levels
                            .filter((val) => {
                              return val.status === true;
                            })
                            .map((val) => {
                              return (
                                <option key={val.levelID} value={val.levelID}>
                                  {val.levelNum}
                                </option>
                              );
                            })}
                      </NativeSelect>
                    </FormControl>
                    <FormControl
                      sx={{
                        display:
                          levelID === "shs11" || levelID === "shs12"
                            ? "flex"
                            : "none",
                      }}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Strand
                      </InputLabel>
                      <NativeSelect
                        disabled={
                          !levelID ||
                          (levelID !== "shs11" && levelID !== "shs12")
                        }
                        id="demo-customized-select-native"
                        error={strandIDError}
                        value={strandID}
                        label="Strand"
                        onChange={(e) => {
                          setStrandID(e.target.value);
                          levelID &&
                            strands &&
                            strands
                              .filter((val) => {
                                return (
                                  val.status === true && val.levelID === levelID
                                );
                              })
                              .map((val) => {
                                return setLevelID(val.levelNum);
                              });
                        }}
                      >
                        <option aria-label="None" value="" />
                        {levelID &&
                          strands &&
                          strands
                            .filter((val) => {
                              return (
                                val.status === true && val.levelID === levelID
                              );
                            })
                            .map((val) => {
                              return (
                                <option key={val.strandID} value={val.strandID}>
                                  {val.strandID}
                                </option>
                              );
                            })}
                      </NativeSelect>
                    </FormControl>

                    <TextField
                      required
                      autoComplete="off"
                      variant="standard"
                      label="Subject ID"
                      placeholder="ex. FIL8, MATH10"
                      error={subjectIDError}
                      value={subjectID}
                      onChange={(e) => {
                        setSubjectID(e.target.value.replace(/\s+/g, ""));
                        setSubjectIDError(false);
                        setSubjectNameError(false);
                        setError(false);
                      }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                    <TextField
                      required
                      autoComplete="off"
                      variant="standard"
                      label="Subject Name"
                      placeholder="ex. Filipino 8, Mathematics 10"
                      error={subjectNameError}
                      value={subjectName}
                      onChange={(e) => {
                        setSubjectName(e.target.value);
                        setSubjectIDError(false);
                        setSubjectNameError(false);
                        setError(false);
                      }}
                      inputProps={{ style: { textTransform: "capitalize" } }}
                    />
                  </Box>
                  <Box display="flex" height="10px">
                    <Typography
                      variant="h5"
                      sx={{ mt: "10px" }}
                      color={colors.redDark[500]}
                    >
                      {error ? errorMessage : ""}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  display="flex"
                  justifyContent="end"
                  height="70px"
                  sx={{ margin: "20px 0" }}
                >
                  <div className="actions">
                    <Button
                      type="submit"
                      disabled={!levelID || !subjectID || subjectIDError}
                      variant="contained"
                      color="secondary"
                      sx={{
                        width: "200px",
                        height: "50px",
                        marginLeft: "20px",
                      }}
                    >
                      <Typography variant="h6">Confirm</Typography>
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        width: "200px",
                        height: "50px",
                        marginLeft: "20px",
                      }}
                      onClick={closeModal}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: colors.whiteOnly[500] }}
                      >
                        CANCEL
                      </Typography>
                    </Button>
                  </div>
                </Box>
              </form>
            </Box>
          </div>
        </div>
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
                textTransform: "uppercase",
              }}
            >
              Subjects
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
              type="button"
              startIcon={<Add />}
              onClick={() => setOpen((o) => !o)}
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "200px" },
                height: "50px",
                marginLeft: { xs: "0", sm: "20px" },
                marginTop: { xs: "20px", sm: "0" },
              }}
            >
              <Typography variant="h6" fontWeight="500">
                Add Subject
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
            rows={subjects ? subjects && subjects : []}
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
                  createdAt: false,
                  updatedAt: false,
                  _id: false,
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

export default Subject;
