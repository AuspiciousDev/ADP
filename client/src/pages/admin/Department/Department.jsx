import React from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Divider,
  NativeSelect,
  FormControl,
  TextField,
  InputLabel,
  ButtonBase,
} from "@mui/material";
import {
  Add,
  Search,
  Delete,
  CheckCircle,
  Cancel,
  DeleteOutline,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useDepartmentsContext } from "../../../hooks/useDepartmentContext";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { format } from "date-fns-tz";
import Paper_Active from "../../../components/global/Paper_Active";
import Paper_Icon from "../../../components/global/Paper_Icon";
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
const DepartmentTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();

  const { departments, depDispatch } = useDepartmentsContext();
  const [isloading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);

  const [depID, setDepID] = useState("");
  const [depName, setDepName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState();

  const [depIDError, setDepIDError] = useState(false);
  const [depNameError, setDepNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [stat, setStat] = useState();
  const [open, setOpen] = useState(false);

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

  const closeModal = () => {
    setOpen(false);
    setDepID("");
    setDepName("");
    setDescription("");
    setError(false);
    setDepIDError(false);
    setDepNameError(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get("/api/departments");
        if (response.status === 200) {
          const json = await response.data;
          console.log(json);
          depDispatch({ type: "SET_DEPS", payload: json });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        console.log(error);
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            title: `No server response.`,
          });
          console.log("no server response");
        } else if (error.response.status === 403) {
          console.log(error.response.data.message);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          navigate("/", { state: { from: location }, replace: true });
        } else if (error.response.status === 500) {
          console.log(error.response.data.message);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
        } else {
          setErrorDialog({
            isOpen: true,
            title: `${error}`,
          });
          console.log(error.message);
        }
      }
    };
    getData();
  }, [depDispatch]);

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
    try {
      const payload = {
        depID: val.depID,
        status: newStatus,
      };
      setLoadingDialog({ isOpen: true });

      const response = await axiosPrivate.patch(
        `/api/departments/status/${payload.depID}`,
        JSON.stringify(payload)
      );
      if (response.status === 200) {
        const json = await response.data;
        console.log(json);
        const response2 = await axiosPrivate.get("/api/departments");
        if (response2?.status === 200) {
          const json = await response2.data;
          console.log(json);

          depDispatch({ type: "SET_DEPS", payload: json });
          setSuccessDialog({
            isOpen: true,
            message: `Department ${(val?.depID).toUpperCase()} status set to ${
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
  function depData(depName, depID) {
    return { depName, depID };
  }
  const handleSubmit = async (e) => {
    setLoadingDialog({ isOpen: true });
    e.preventDefault();
    const data = {
      depID,
      depName,
      description,
    };

    if (!error) {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.post(
          "/api/departments/register",
          JSON.stringify(data)
        );

        if (response.status === 201) {
          const json = await response.data;
          console.log("response;", json);
          depDispatch({ type: "CREATE_DEP", payload: json });
          setOpen(false);
          setSuccessDialog({
            isOpen: true,
            message: ` ${json.depName.toUpperCase()} Department Added!`,
          });

          setLoadingDialog({ isOpen: false });
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
        } else if (error.response.status === 409) {
          setError(true);
          setErrorMessage(error.response.data.message);
          setDepNameError(true);
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
    } else {
      console.log(errorMessage);
    }
  };
  const handleDelete = async ({ val }) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    try {
      setLoadingDialog({ isOpen: true });

      const response = await axiosPrivate.delete(
        `api/departments/delete/${val.depID}`
      );
      const json = await response.data;
      if (response.status === 200) {
        console.log(json);
        depDispatch({ type: "DELETE_DEP", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: ` ${val.depName.toUpperCase()} department has been deleted!`,
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
  const rows = [
    depData("elementary", "elem"),
    depData("junior highschool", "jhs"),
    depData("senior highschool", "shs"),
    // depData("college", "col"),
  ];

  const columns = [
    {
      field: "depID",
      headerName: "Department ID",
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
      field: "depName",
      headerAlign: "center",
      headerName: "Department Name",
      width: 200,
      align: "center",
    },
    // {
    //   field: "createdAt",
    //   headerName: "Date Created",
    //   width: 240,
    //   headerAlign: "center",
    //   align: "center",
    //   valueFormatter: (params) =>
    //     format(new Date(params?.value), "MMMM dd, yyyy"),
    // },
    // {
    //   field: "updatedAt",
    //   headerName: "Date Modified",
    //   width: 240,
    //   headerAlign: "center",
    //   align: "center",
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
    //         {auth.userType === "registrar" && (
    //           <ButtonBase
    //             onClick={() => {
    //               setValidateDialog({
    //                 isOpen: true,
    //                 onConfirm: () => {
    //                   setConfirmDialog({
    //                     isOpen: true,
    //                     title: `Are you sure to set status of ${params?.row?.depID.toUpperCase()}`,
    //                     message: `${
    //                       params?.value === true ? "To INACTIVE" : "To ACTIVE"
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
    //         {" "}
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
          title: `Are you sure to delete ${params?.row?.depName.toUpperCase()} department`,
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
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
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
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div
          className="modal-small-form"
          style={{
            backgroundColor: colors.black[900],
            border: `solid 1px ${colors.black[200]}`,
          }}
        >
          <IconButton className="close" onClick={closeModal} disableRipple>
            <Cancel />
            {/* <Typography variant="h4">&times;</Typography> */}
          </IconButton>
          <div
            className="header"
            style={{
              backgroundColor: colors.black[900],
              borderBottom: `2px solid ${colors.primary[500]}`,
            }}
          >
            <Typography variant="h3">ADD DEPARTMENT</Typography>
          </div>
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
                  Department Information
                </Typography>
                <Box marginBottom="50px">
                  <Box
                    sx={{
                      display: "grid",
                      width: "100%",
                      gridTemplateRows: "1fr ",
                      gap: "20px",
                    }}
                  >
                    <FormControl required variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">
                        Department Name
                      </InputLabel>
                      <NativeSelect
                        required
                        id="demo-customized-select-native"
                        value={depName}
                        error={depNameError}
                        onChange={(e) => {
                          setDepName(e.target.value);
                          setDepID("");
                          setError(false);
                          setDepNameError(false);
                          setDepIDError(false);
                          rows
                            .filter((val) => {
                              return val.depName === e.target.value;
                            })
                            .map((data) => {
                              return setDepID(data.depID);
                            });
                        }}
                      >
                        <option aria-label="None" value="" />
                        <option value={"elementary"}>Elementary</option>
                        <option value={"junior highschool"}>
                          Junior Highschool
                        </option>
                        <option value={"senior highschool"}>
                          Senior Highschool
                        </option>
                        {/* <option value={"college"}>College</option>  */}
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
                      <Typography
                        variant="h6"
                        sx={{ color: colors.whiteOnly[100] }}
                      >
                        CANCEL
                      </Typography>
                    </Button>
                    <Button
                      type="submit"
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
                borderLeft: `5px solid ${colors.primary[500]}`,
                paddingLeft: 2,
              }}
            >
              DEPARTMENTS
            </Typography>
          </Box>
          <Box
            sx={{
              display: "none",
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
                Add Department
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
            rows={departments ? departments && departments : []}
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

export default DepartmentTable;
