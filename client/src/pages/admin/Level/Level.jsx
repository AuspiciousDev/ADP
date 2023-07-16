import React from "react";
import Popup from "reactjs-popup";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { DeleteOutline, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
  ButtonBase,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CheckCircle, Cancel, Delete, Add } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";

import { useLevelsContext } from "../../../hooks/useLevelContext";
import { useDepartmentsContext } from "../../../hooks/useDepartmentContext";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";

import { useNavigate, useLocation } from "react-router-dom";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { format } from "date-fns-tz";
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

const LevelTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const { levels, levelDispatch } = useLevelsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const [search, setSearch] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [levelID, setLevelID] = useState("");
  const [levelNum, setLevelNum] = useState("");
  const [depID, setDepID] = useState("");

  const [levelIDError, setLevelIDError] = useState(false);
  const [levelNumError, setLevelNumError] = useState(false);
  const [depIDError, setDepIDError] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
    clearInputForms();
  };
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

  const clearInputForms = () => {
    setLevelID("");
    setLevelNum("");
    setDepID("");
    setError(false);
  };

  function lvlData(level, depID) {
    return { level, depID };
  }

  const rows = [
    lvlData("1", "elem"),
    lvlData("2", "elem"),
    lvlData("3", "elem"),
    lvlData("4", "elem"),
    lvlData("5", "elem"),
    lvlData("6", "elem"),
    lvlData("7", "jhs"),
    lvlData("8", "jhs"),
    lvlData("9", "jhs"),
    lvlData("10", "jhs"),
    lvlData("11", "shs"),
    lvlData("12", "shs"),
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get("/api/levels");
        if (response.status === 200) {
          const json = await response.data;
          console.log("🚀 ~ file: Level.jsx:149 ~ getData ~ json:", json);
          levelDispatch({ type: "SET_LEVELS", payload: json });
        }
        const apiDep = await axiosPrivate.get("/api/departments");
        if (apiDep?.status === 200) {
          const json = await apiDep.data;
          depDispatch({ type: "SET_DEPS", payload: json });
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
  }, [levelDispatch, depDispatch]);
  const toggleStatus = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    setLoadingDialog({ isOpen: true });
    let newStatus = val.status;
    val.status === true
      ? (newStatus = false)
      : val.status === false
      ? (newStatus = true)
      : (newStatus = false);
    try {
      const response = await axiosPrivate.patch(
        `/api/levels/status/${val.levelID}`,
        JSON.stringify({ levelID: val.levelID, status: newStatus })
      );
      if (response.status === 200) {
        const json = await response.data;
        console.log(json);
        const response2 = await axiosPrivate.get("/api/levels");
        if (response2?.status === 200) {
          const json = await response2.data;
          console.log(json);

          levelDispatch({ type: "SET_LEVELS", payload: json });
          setSuccessDialog({
            isOpen: true,
            message: `${val.depID.toUpperCase()} - ${(val?.levelNum).toUpperCase()} set to ${
              newStatus === true ? "ACTIVE" : "INACTIVE"
            }`,
          });
        }
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
      } else {
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
        console.log(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    const data = {
      levelID,
      levelNum,
      depID,
    };
    console.log(data);

    if (!error) {
      try {
        const response = await axiosPrivate.post(
          "/api/levels/register",
          JSON.stringify(data)
        );
        const json = await response.data;
        if (response.status === 201) {
          closeModal();
          levelDispatch({ type: "CREATE_LEVEL", payload: json });
          clearInputForms();
          console.log(response.data.message);
          const apiLevels = await axiosPrivate.get("/api/levels");
          if (apiLevels.status === 200) {
            const json = await apiLevels.data;
            console.log(json);
            levelDispatch({ type: "SET_LEVELS", payload: json });
          }
          setSuccessDialog({
            isOpen: true,
            message: `${depID?.toUpperCase()} - ${levelID?.toUpperCase()} has been added!`,
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
        } else if (error.response.status === 409) {
          setError(true);
          setDepIDError(true);
          setLevelNumError(true);
          setErrorMessage(error.response.data.message);
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
    } else {
      console.log("Validation Error!");
    }
  };
  const handleDelete = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      const response = await axiosPrivate.delete(
        `/api/levels/delete/${val.levelID}`
      );
      if (response.status === 200) {
        const json = await response.data;
        console.log(json);

        setSuccessDialog({
          isOpen: true,
          message: ` ${val.depID.toUpperCase()} - ${
            val.levelNum
          } has been deleted!`,
        });
        levelDispatch({ type: "DELETE_LEVEL", payload: json });
      }
    } catch (error) {
      console.log("🚀 ~ file: Level.jsx:361 ~ handleDelete ~ error", error);
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
      field: "levelID",
      headerName: "Level ID",
      align: "center",
      headerAlign: "center",
      width: 150,
      renderCell: (params) => {
        return (
          <Typography fontWeight={600} textTransform="uppercase">
            {params.value}
          </Typography>
        );
      },
    },

    {
      field: "levelNum",
      headerName: "Level",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "depName",
      headerName: "Department",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "createdAt",
    //   headerName: "Date Created",
    //   width: 240,
    //   valueFormatter: (params) =>
    //     format(new Date(params?.value), "hh:mm a - MMMM dd, yyyy"),
    // },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 175,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         {" "}
    //         {auth.userType === "registrar" && (
    //           <ButtonBase
    //             onClick={() => {
    //               setValidateDialog({
    //                 isOpen: true,
    //                 onConfirm: () => {
    //                   setConfirmDialog({
    //                     isOpen: true,
    //                     title: `Are you sure to change status of ${params?.row?.depID.toUpperCase()} -  ${params?.row?.levelNum.toUpperCase()}`,
    //                     message: `${
    //                       params?.value === true
    //                         ? "ACTIVE to INACTIVE"
    //                         : " INACTIVE to ACTIVE"
    //                     }`,
    //                     onConfirm: () => {
    //                       toggleStatus({ val: params?.row });
    //                     },
    //                   });
    //                 },
    //               });
    //             }}
    //           >
    //             {params?.value === true ? (
    //               <Paper_Active icon={<CheckCircle />} title={"active"} />
    //             ) : (
    //               <Paper_Active icon={<Cancel />} title={"inactive"} />
    //             )}
    //           </ButtonBase>
    //         )}
    //       </>
    //     );
    //   },
    // },
    // {
    //   field: "_id",
    //   headerName: "Action",
    //   width: 175,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         {auth.userType === "registrar" && (
    //           <ButtonBase
    //             onClick={(event) => {
    //               handleCellClick(event, params);
    //             }}
    //           >
    //             <Paper_Icon icon={<DeleteOutline />} color={`red`} />
    //           </ButtonBase>
    //         )}
    //       </>
    //     );
    //   },
    // },
  ];
  const handleCellClick = (event, params) => {
    event.stopPropagation();
    setValidateDialog({
      isOpen: true,
      onConfirm: () => {
        setConfirmDialog({
          isOpen: true,
          title: `Are you sure to delete ${params.row.depID.toUpperCase()} - ${
            params.row.levelNum
          }`,
          message: `This action is irreversible!`,
          onConfirm: () => {
            handleDelete({ val: params.row });
          },
        });
      },
    });
    // alert(`Delete : ${params.row.username}`);
    // alert(`Delete : ${params.value}`);
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
            <CancelIcon />
          </IconButton>
          <Box
            className="header"
            sx={{ borderBottom: `2px solid ${colors.primary[900]}` }}
          >
            <Typography variant="h3">ADD LEVELS</Typography>
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
                  Level Information
                </Typography>
                <Box marginBottom="40px">
                  <Box
                    sx={{
                      display: "grid",
                      width: "100%",
                      gridTemplateColumns: "1fr 1fr ",
                      gap: "20px",
                      mt: "20px",
                    }}
                  >
                    <FormControl required fullWidth>
                      <InputLabel required id="demo-simple-select-label">
                        Department
                      </InputLabel>
                      <NativeSelect
                        id="demo-simple-select-label"
                        error={depIDError}
                        value={depID}
                        label="Department"
                        onChange={(e) => {
                          setError(false);
                          setLevelNumError(false);
                          setDepIDError(false);
                          setDepID(e.target.value);
                          console.log(e.target.value);
                          setLevelID("");
                          setLevelNum("");
                        }}
                      >
                        <option aria-label="None" value="" />
                        {departments &&
                          departments
                            .filter((val) => {
                              return val.status === true;
                            })
                            .map((val) => {
                              return (
                                <option key={val._id} value={val.depID}>
                                  {val.depName.toUpperCase()}
                                </option>
                              );
                            })}
                      </NativeSelect>
                    </FormControl>
                    <FormControl required fullWidth>
                      <InputLabel required id="demo-simple-select-label">
                        Level
                      </InputLabel>
                      <NativeSelect
                        id="demo-simple-select-label"
                        error={levelNumError}
                        value={levelNum}
                        label="Level"
                        onChange={(e) => {
                          setLevelNum(e.target.value);
                          setLevelNumError(false);
                          setDepIDError(false);
                          setError(false);
                          setLevelID(depID + e.target.value);
                        }}
                      >
                        <option aria-label="None" value="" />
                        {rows &&
                          rows
                            .filter((val) => {
                              return val.depID === depID;
                            })
                            .map((val) => {
                              return (
                                <option
                                  key={val.level}
                                  value={val.level}
                                  style={{
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {val.level}
                                </option>
                              );
                            })}
                      </NativeSelect>
                    </FormControl>
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
                  sx={{ margin: "40px 0 20px 0" }}
                >
                  <div className="actions">
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      disabled={
                        !depID || !levelNum || depIDError || levelNumError
                      }
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
      <>
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
                LEVELS
              </Typography>
            </Box>
            {/* <Box
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
                  placeholder="Search Level"
                  onChange={(e) => {
                    setSearch(e.target.value.toLowerCase());
                  }}
                />
                <Divider sx={{ height: 30, m: 1 }} orientation="vertical" />
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
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
                  Add Level
                </Typography>
              </Button>
            </Box> */}
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
            {levels && (
              <DataGrid
                rows={
                  levels && departments
                    ? levels &&
                      departments &&
                      levels.filter((fill) => {
                        const res = departments.filter((dep) => {
                          return (
                            dep?.status === true && fill?.depID === dep?.depID
                          );
                        });
                        return fill?.depID === res[0]?.depID;
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
                      updatedAt: false,
                      status: auth.userType === "registrar" ? true : false,
                    },
                  },
                }}
                components={{
                  Toolbar: CustomToolbar,
                }}
              />
            )}
          </Box>
        </Paper>
      </>
    </Box>
  );
};

export default LevelTable;
