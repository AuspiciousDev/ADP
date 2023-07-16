import React from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
  TableContainer,
  TablePagination,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Divider,
  NativeSelect,
  FormControl,
  TextField,
  InputLabel,
  ButtonBase,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { tokens } from "../../../theme";
import { useLevelsContext } from "../../../hooks/useLevelContext";
import { useSectionsContext } from "../../../hooks/useSectionContext";
import { useDepartmentsContext } from "../../../hooks/useDepartmentContext";
import { useStrandsContext } from "../../../hooks/useStrandContext";
import {
  Search,
  Delete,
  Cancel,
  CheckCircle,
  DeleteOutline,
  Add,
} from "@mui/icons-material";

import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { format } from "date-fns-tz";
import { useNavigate, useLocation } from "react-router-dom";
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

const Section = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const { sections, secDispatch } = useSectionsContext();
  const { strands, strandDispatch } = useStrandsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();

  const [isloading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);

  const [sectionID, setSectionID] = useState("");
  const [strandID, setStrandID] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [levelID, setLevelID] = useState("");
  const [depID, setDepID] = useState("");

  const [level, setLevel] = useState("");
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState();

  const [strandIDError, setStrandIDError] = useState(false);
  const [levelIDError, setLevelIDError] = useState(false);
  const [sectionNameError, setSectionNameError] = useState(false);
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

  const [page, setPage] = React.useState(15);

  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
    setStrandID("");
    setSectionID("");
    setSectionName("");
    setLevelID("");
    setDepID("");
    setError(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        setIsLoading(true);
        const response = await axiosPrivate.get("/api/sections");
        if (response.status === 200) {
          const json = await response.data;
          console.log(json);
          setIsLoading(false);
          secDispatch({ type: "SET_SECS", payload: json });
        }
        const apiLevel = await axiosPrivate.get("/api/levels");
        if (apiLevel?.status === 200) {
          const json = await apiLevel.data;
          setIsLoading(false);
          levelDispatch({ type: "SET_LEVELS", payload: json });
        }
        const apiDep = await axiosPrivate.get("/api/departments");
        if (apiDep?.status === 200) {
          const json = await apiDep.data;
          console.log(json);
          setIsLoading(false);
          depDispatch({ type: "SET_DEPS", payload: json });
        }
        const apiStrand = await axiosPrivate.get("/api/strands");
        if (apiStrand?.status === 200) {
          const json = await apiStrand.data;
          console.log(json);
          strandDispatch({ type: "SET_STRANDS", payload: json });
        }

        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log("🚀 ~ file: Section.jsx:184 ~ getData ~ error", error);
        setLoadingDialog({ isOpen: false });
        setIsLoading(false);
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
  }, [secDispatch, levelDispatch, depDispatch, open]);

  const columns = [
    {
      field: "sectionID",
      headerName: "Section ID",
      width: 130,
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
      field: "sectionName",
      headerName: "Section",
      headerAlign: "center",
      align: "center",
      width: 150,
    },
    {
      field: "levelNum",
      headerName: "Level",
      headerAlign: "center",
      align: "center",
      width: 130,
    },
    {
      field: "depID",
      headerName: "Department ID",
      headerAlign: "center",
      align: "center",
      width: 130,
      valueFormatter: (params) => params?.value.toUpperCase(),
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
      field: "status",
      headerName: "Status",
      width: 175,
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
                        title: `Are you sure to change status of  ${params?.row?.sectionID.toUpperCase()}`,
                        message: `${
                          params?.value === true
                            ? "INACTIVE to ACTIVE"
                            : " ACTIVE to INACTIVE"
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
          </>
        );
      },
    },
    {
      field: "_id",
      headerName: "Action",
      width: 175,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            {" "}
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
          title: `Are you sure to delete section ${params?.row?.sectionID?.toUpperCase()}`,
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
      sectionID,
      depID,
      levelID,
      sectionName,
      strandID,
    };
    console.log(data);
    if (!error) {
      try {
        const response = await axiosPrivate.post(
          "/api/sections/register",
          JSON.stringify(data)
        );

        if (response.status === 201) {
          const json = await response.data;
          console.log("response;", json);
          secDispatch({ type: "CREATE_SEC", payload: json });
          setOpen(false);
          setSuccessDialog({
            isOpen: true,
            message: `${levelID?.toUpperCase()} - ${sectionName?.toUpperCase()} has been added!`,
          });
          setLoadingDialog({ isOpen: false });
        }
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        setIsLoading(false);
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
          setSectionNameError(true);
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
  const handleDelete = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      setIsLoading(true);
      const response = await axiosPrivate.delete(
        `/api/sections/delete/${val?.sectionID}`
      );
      const json = await response.data;
      if (response.status === 200) {
        console.log(json);
        secDispatch({ type: "DELETE_SEC", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `${json.levelID?.toUpperCase()} - ${json.sectionName?.toUpperCase()} has been deleted!`,
        });
      }

      setIsLoading(false);
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      setIsLoading(false);
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
      setIsLoading(true);
      const response = await axiosPrivate.patch(
        `/api/sections/status/${val.sectionID}`,
        JSON.stringify({ sectionID: val.sectionID, status: newStatus })
      );
      if (response.status === 200) {
        const json = await response.data;
        console.log(json);
        const response2 = await axiosPrivate.get("/api/sections");
        if (response2?.status === 200) {
          const json = await response2.data;
          console.log(json);
          setIsLoading(false);
          secDispatch({ type: "SET_SECS", payload: json });
          setSuccessDialog({ isOpen: true });
          setLoadingDialog({ isOpen: false });
        }
      }
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      setIsLoading(false);
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
      />{" "}
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
            <Typography variant="h3">ADD SECTION</Typography>
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
                        Department
                      </InputLabel>
                      <NativeSelect
                        id="demo-customized-select-native"
                        error={depIDError}
                        value={depID}
                        label="Department"
                        onChange={(e) => {
                          setDepID(e.target.value);
                          setLevelID("");
                        }}
                      >
                        <option aria-label="None" value="" />
                        {departments &&
                          departments
                            .filter((val) => {
                              return val.status === true;
                            })
                            .map((val, key) => {
                              return (
                                <option key={key} value={val.depID}>
                                  {val?.depName?.toUpperCase()}
                                </option>
                              );
                            })}
                      </NativeSelect>
                    </FormControl>
                    <FormControl required>
                      <InputLabel required id="demo-simple-select-label">
                        Level
                      </InputLabel>
                      <NativeSelect
                        id="demo-customized-select-native"
                        error={levelIDError}
                        value={levelID}
                        label="Level"
                        onChange={(e) => {
                          setLevelID(e.target.value);
                          levels &&
                            levels
                              .filter((val) => {
                                return val.levelID === e.target.value;
                              })
                              .map((val) => {
                                return setLevel(val.levelNum);
                              });
                        }}
                      >
                        <option aria-label="None" value="" />
                        {levels &&
                          levels
                            .filter((val) => {
                              return val.status === true && val.depID === depID;
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
                        id="demo-customized-select-native"
                        disabled={depID !== "shs" || !levelID}
                        error={strandIDError}
                        value={strandID}
                        label="Strand"
                        onChange={(e) => {
                          setStrandID(e.target.value);
                          depID &&
                            levelID &&
                            strands &&
                            strands
                              .filter((val) => {
                                return (
                                  val.status === true &&
                                  val.levelID === levelID &&
                                  depID === "shs"
                                );
                              })
                              .map((val) => {
                                return setLevel(val.levelNum);
                              });
                        }}
                      >
                        <option aria-label="None" value="" />
                        {depID &&
                          levelID &&
                          strands &&
                          strands
                            .filter((val) => {
                              return (
                                val.status === true &&
                                val.depID === depID &&
                                val.levelID === levelID
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
                      label="Section Name"
                      placeholder="ex. Orchids, Apple, Narra"
                      error={sectionNameError}
                      value={sectionName}
                      onChange={(e) => {
                        setSectionName(e.target.value.replace(/\s/g, ""));
                        setSectionID(
                          (strandID ? strandID + "-" : level) +
                            e.target.value.replace(/\s/g, "")
                        );
                        setSectionNameError(false);
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
                      <Typography variant="h6">CANCEL</Typography>
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        !depID || !levelID || !sectionName || sectionNameError
                      }
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
              }}
            >
              SECTIONS
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
                placeholder="Search Section"
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
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "200px" },
                height: "50px",
                marginLeft: { xs: "0", sm: "20px" },
                marginTop: { xs: "20px", sm: "0" },
              }}
            >
              <Typography variant="h6" fontWeight="500">
                Add Section
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
            rows={
              sections && levels
                ? sections &&
                  levels &&
                  sections.filter((fill) => {
                    const res = levels.filter((lvl) => {
                      return (
                        lvl.status === true && fill.levelID === lvl.levelID
                      );
                    });
                    return fill?.levelID === res[0]?.levelID;
                  })
                : []
            }
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

export default Section;
