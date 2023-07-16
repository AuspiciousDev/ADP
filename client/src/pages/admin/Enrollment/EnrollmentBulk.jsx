import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { format } from "date-fns-tz";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import {
  Add,
  CheckBox,
  CheckBoxOutlineBlank,
  CoPresentOutlined,
  Delete,
  DeleteOutline,
  LocalPrintshopOutlined,
  ScheduleOutlined,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  ButtonBase,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import ConfirmDialogue from "../../../global/ConfirmDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import AddSubjectDialogue from "../../../global/AddSubjectDialogue";
import Paper_Title from "../../../components/global/Paper_Title";
import useAuth from "../../../hooks/useAuth";

import { useStudentsContext } from "../../../hooks/useStudentContext";
import { useSectionsContext } from "../../../hooks/useSectionContext";
import { useLoginsContext } from "../../../hooks/useLoginContext";
import { useEnrollmentsContext } from "../../../hooks/useEnrollmentContext";
import { useSchoolYearsContext } from "../../../hooks/useSchoolYearsContext";
import { useLevelsContext } from "../../../hooks/useLevelContext";
import { useDepartmentsContext } from "../../../hooks/useDepartmentContext";
import { useStrandsContext } from "../../../hooks/useStrandContext";
import { useTeachersContext } from "../../../hooks/useTeacherContext";
import { useSubjectsContext } from "../../../hooks/useSubjectContext";
import { useSchedulesContext } from "../../../hooks/useScheduleContext";
import { useNavigate } from "react-router-dom";

const EnrollmentCreate = () => {
  const { auth } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  const { years, yearDispatch } = useSchoolYearsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const { strands, strandDispatch } = useStrandsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { sections, secDispatch } = useSectionsContext();
  const { teachers, teacherDispatch } = useTeachersContext();
  const { subjects, subDispatch } = useSubjectsContext();
  const { schedules, scheduleDispatch } = useSchedulesContext();
  const { students, studDispatch } = useStudentsContext();

  const [schoolYearID, setSchoolYearID] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [LRN, setLRN] = useState(null);
  const [studName, setStudName] = useState("");
  const [depID, setDepID] = useState(null);
  const [strandID, setStrandID] = useState(null);
  const [levelID, setLevelID] = useState(null);
  const [term, setTerm] = useState("");
  const [sectionID, setSectionID] = useState(null);
  const [error, setError] = useState(false);
  const [showSched, setShowSched] = useState(false);
  const [showEnrollees, setShowEnrollees] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [enrollees, setEnrollees] = useState([]);
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
  const [addSubjectDialog, setAddSubjectDialog] = useState({
    isOpen: false,
    depID: "",
    levelID: "",
    term: "",
    strand: "",
    sectionID: "",
  });

  useEffect(() => {
    const getOverviewDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const apiActiveYear = await axiosPrivate.get(
          "/api/schoolyears/status/active"
        );
        if (apiActiveYear.status === 200) {
          const json = await apiActiveYear.data;
          setSchoolYearID(json.schoolYearID);
          setSchoolYear(json.schoolYear);
        }

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
        const apiSections = await axiosPrivate.get("/api/sections");
        if (apiSections.status === 200) {
          const json = await apiSections.data;
          secDispatch({ type: "SET_SECS", payload: json });
        }
        const apiTeachers = await axiosPrivate.get("/api/teachers");
        if (apiTeachers.status === 200) {
          const json = await apiTeachers.data;
          teacherDispatch({ type: "SET_TEACHERS", payload: json });
        }
        const apiSubjects = await axiosPrivate.get("/api/subjects");
        if (apiSubjects.status === 200) {
          const json = await apiSubjects.data;
          subDispatch({ type: "SET_SUBJECTS", payload: json });
        }
        const apiStudents = await axiosPrivate.get("/api/students");
        if (apiStudents.status === 200) {
          const json = await apiStudents.data;
          studDispatch({ type: "SET_STUDENTS", payload: json });
        }
        const apiSchedule = await axiosPrivate.get(`api/schedules`);
        if (apiSchedule.status === 200) {
          const json = await apiSchedule.data;
          scheduleDispatch({ type: "SET_SCHEDULES", payload: json });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        setLoadingDialog({ isOpen: false });
      }
    };
    getOverviewDetails();
  }, [yearDispatch, depDispatch, scheduleDispatch]);

  const handleShowSched = async (e) => {
    setLoadingDialog({ isOpen: true });
    setSchedule([]);
    e.preventDefault();
    let data1 = [];
    // const data = {
    //   schoolYearID,
    //   LRN,
    //   depID,
    //   levelID,
    //   sectionID,
    //   strandID: strandID ? strandID : "",
    //   term,
    // };
    {
      schedules &&
        depID &&
        levelID &&
        term &&
        sectionID &&
        schedules
          .filter((filter) => {
            return (
              filter.depID === depID &&
              filter.levelID === levelID &&
              filter.term === term &&
              filter.sectionID === sectionID &&
              (filter.strandID === "" ? <></> : filter.strandID === strandID)
            );
          })
          .map((val) => {
            // return console.log(val.schedule);
            return data1.push(val.schedule);
          });
    }
    setSchedule(data1[0]);
    setShowSched(true);
    setLoadingDialog({ isOpen: false });
  };
  const handleRowClick = async (val) => {
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure to remove ${val.subjectID}?`,
      onConfirm: () => {
        handleRemoveRow(val.subjectID);
      },
    });
  };
  const handleRemoveRow = async (value) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    let newItems = schedule.filter((val) => val.subjectID != value);
    setSchedule(newItems);
  };

  const handleAddStudent = async (e) => {
    setLoadingDialog({ isOpen: true });
    e.preventDefault();

    const data = {
      schoolYearID,
      LRN,
      depID,
      levelID,
      sectionID,
      strandID: strandID ? strandID : "",
      term,
    };

    try {
      const response = await axiosPrivate.post(
        "/api/enrollments/verify",
        JSON.stringify(data)
      );
      const apiResponse = response.data.LRN;
      if (response?.status === 200) {
        handleAddStudentToList(apiResponse);
      }
      setError(false);
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      console.log(
        "🚀 ~ file: EnrollmentBulk.jsx:232 ~ handleAddStudent ~ error:",
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
        setError(true);
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

  const handleAddStudentToList = (LRN) => {
    const data =
      students &&
      students
        .filter((filter) => {
          return filter.LRN === LRN;
        })
        .map((value) => {
          return value;
        });
    console.log(
      "🚀 ~ file: EnrollmentBulk.jsx:321 ~ handleAddStudentToList ~ value:",
      data[0]
    );

    const value = {
      LRN: data[0].LRN,
      fullName:
        data[0].middleName === "" || data[0].middleName === undefined
          ? data[0].firstName + " " + data[0].lastName
          : data[0].firstName +
            " " +
            data[0].middleName.charAt(0) +
            ". " +
            data[0].lastName,
      gender: data[0].gender,
    };

    setEnrollees;
    let existingStudent = enrollees?.find((student) => {
      return student.LRN === value.LRN;
    });
    if (existingStudent) {
      existingStudent.LRN = value.LRN;
      existingStudent.fullName = value.fullName;
      existingStudent.gender = value.gender;
    } else {
      value && setEnrollees((arr) => [...arr, value]);
    }
    console.log(enrollees);
    setShowEnrollees(true);
    setLRN(null);
    setStudName("");
  };

  const handleStudentRowClick = async (val) => {
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure to remove ${val.fullName}?`,
      onConfirm: () => {
        handleStudentRemoveRow(val.LRN);
      },
    });
  };

  const handleStudentRemoveRow = async (value) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    let newItems = enrollees.filter((val) => val.LRN != value);
    setEnrollees(newItems);
  };

  const enrollStudent = async () => {
    setLoadingDialog({ isOpen: true });
    // e.preventDefault();
    const data = {
      schoolYearID,
      depID,
      levelID,
      sectionID,
      strandID: strandID ? strandID : "",
      term,
      schedule,
      enrollees,
    };

    try {
      const response = await axiosPrivate.post(
        "/api/enrollments/register/bulk",
        JSON.stringify(data)
      );
      if (response?.status === 201) {
        console.log(
          "🚀 ~ file: EnrollmentBulk.jsx:391 ~ enrollStudent ~ response:",
          response
        );
        const data = response.data;
        console.log(
          "🚀 ~ file: EnrollmentBulk.jsx:397 ~ enrollStudent ~ data:",
          data
        );
        setSuccessDialog({
          isOpen: true,
          message: `Successfully enrolled total of ${data.totalStudents} ${
            data > 0 ? "student" : "students"
          } on.`,
        });
        clearEnrollmentFields();
      }
      setError(false);
      setDepID;
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
        setError(true);
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
  const handleClose = (value) => {
    setSchedule;
    let existingSubject = schedule?.find((subject) => {
      return subject.subjectID === value.subjectID;
    });
    if (existingSubject) {
      existingSubject.day = value.day;
      existingSubject.timeStart = value.timeStart;
      existingSubject.timeEnd = value.timeEnd;
      existingSubject.teacherID = value.teacherID;
      existingSubject.teacherName = value.teacherName;
    } else {
      value && setSchedule((arr) => [...arr, value]);
    }
  };
  const clearEnrollmentFields = () => {
    setLRN(null);
    setStudName("");
    setDepID(null);
    setLevelID(null);
    setTerm("");
    setStrandID(null);
    setSectionID(null);
    setEnrollees([]);
    setSchedule([]);
    setShowSched(false);
    setShowEnrollees(false);
    setError(false);
  };

  const clearStudentField = () => {
    setLRN(null);
    setStudName("");
    setEnrollees([]);
    setShowEnrollees(false);
    setError(false);
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
      <AddSubjectDialogue
        addSubjectDialog={addSubjectDialog}
        setAddSubjectDialog={setAddSubjectDialog}
        onClose={handleClose}
      />
      <Paper_Title title={"Enrollment > Bulk"} icon={<Add />} />

      <Paper
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          mt: 2,
          gap: 2,
          p: 2,
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            height: "400px",
          }}
        >
          <form onSubmit={handleShowSched}>
            <Box sx={{ position: "relative", height: "100%" }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3fr",
                  gap: "0.75em 2em",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography textAlign="end">Department ID</Typography>
                <Autocomplete
                  disablePortal
                  disabled={!schoolYear}
                  id="combo-box-demo"
                  options={
                    departments
                      ? departments.map((val) => {
                          return val?.depID;
                        })
                      : []
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Department ID"
                      size="small"
                      required
                      error={error}
                    />
                  )}
                  value={depID}
                  onChange={(event, newValue) => {
                    console.log(newValue);
                    setDepID(newValue);
                    setLevelID(null);
                    setStrandID(null);
                    setSectionID(null);
                    setTerm("");
                    if (newValue === "jhs" || newValue === "elem")
                      setTerm("none");
                  }}
                />
                <Typography textAlign="end">Level</Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Autocomplete
                    disablePortal
                    disabled={!depID}
                    id="combo-box-demo"
                    options={
                      levels
                        ? depID &&
                          levels
                            .filter((filter) => {
                              return filter.depID === depID;
                            })
                            .map((val) => {
                              return val?.levelID;
                            })
                        : []
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Level ID"
                        size="small"
                        fullWidth
                      />
                    )}
                    value={levelID}
                    onChange={(event, newValue) => {
                      setLevelID(newValue);
                      setStrandID(null);
                      setSectionID(null);
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                  />
                  <FormControl
                    disabled={!depID || depID === "jhs" || depID === "elem"}
                    fullWidth
                  >
                    <InputLabel id="demo-simple-select-label" size="small">
                      Term
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={term}
                      label="Term"
                      onChange={(e) => {
                        setTerm(e.target.value);
                      }}
                      size="small"
                    >
                      <MenuItem value={"1st"}>1st</MenuItem>
                      <MenuItem value={"2nd"}>2nd</MenuItem>
                      {depID !== "shs" && (
                        <MenuItem value={"none"}>None</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
                <Typography textAlign="end">Strand</Typography>
                <Autocomplete
                  disabled={depID !== "shs" || !levelID}
                  disablePortal
                  id="combo-box-demo"
                  options={
                    strands
                      ? levelID &&
                        strands
                          .filter((filter) => {
                            return (
                              filter.depID === "shs" &&
                              filter.levelID === levelID
                            );
                          })
                          .map((options) => {
                            return options.strandID;
                          })
                      : []
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Strand ID" size="small" />
                  )}
                  value={strandID}
                  onChange={(event, newValue) => {
                    console.log(newValue);
                    setStrandID(newValue);
                    setSectionID(null);
                    setSubjectID(null);
                  }}
                />
                <Typography textAlign="end">Section</Typography>
                <Autocomplete
                  disabled={!depID && !levelID && !term}
                  disablePortal
                  id="combo-box-demo"
                  options={
                    sections
                      ? sections
                          .filter((filter) => {
                            return (
                              filter.depID === depID &&
                              filter.levelID === levelID &&
                              (filter.strandID === "" ? (
                                <></>
                              ) : (
                                filter.strandID === strandID
                              ))
                            );
                          })
                          .map((map) => {
                            return map.sectionID;
                          })
                      : []
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Section ID" size="small" />
                  )}
                  value={sectionID}
                  onChange={(event, newValue) => {
                    setSectionID(newValue);
                  }}
                />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  mt: 2,
                  gridColumn: "2",
                  justifyContent: "end",
                  "& > button": {
                    width: "200px",
                  },
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  disabled={
                    !schoolYearID || !depID || !levelID || !sectionID || error
                  }
                >
                  Add schedule
                </Button>
              </Box>
            </Box>
          </form>
          <form onSubmit={handleAddStudent}>
            <Box sx={{ position: "relative", height: "100%" }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3fr",
                  gap: "0.75em 2em",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography textAlign="end">Academic Year</Typography>
                <TextField
                  variant="outlined"
                  placeholder="School year"
                  size="small"
                  value={schoolYear}
                />
                <Typography textAlign="end">Student LRN</Typography>

                <Autocomplete
                  disablePortal
                  disabled={!schoolYear}
                  id="combo-box-demo"
                  options={
                    students
                      ? students
                          .filter((filter) => {
                            return filter.status === true;
                          })
                          .map((val) => {
                            return val?.LRN;
                          })
                      : []
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Student LRN"
                      size="small"
                      required
                      error={error}
                    />
                  )}
                  value={LRN}
                  onChange={(event, newValue) => {
                    setLRN(newValue);
                    setStudName("");
                    setError(false);
                    students &&
                      students
                        .filter((filter) => {
                          return (
                            newValue === filter.LRN && filter.status === true
                          );
                        })
                        .map((options) => {
                          return setStudName(
                            options?.firstName +
                              " " +
                              (options?.middleName.charAt(0) + ". " || "") +
                              options?.lastName
                          );
                        });
                  }}
                />
                <Typography textAlign="end">Student Name</Typography>
                <TextField
                  variant="outlined"
                  placeholder="Student Name"
                  size="small"
                  value={studName}
                  inputProps={{ style: { textTransform: "capitalize" } }}
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  gridColumn: "2",
                  justifyContent: "end",
                  "& > button": {
                    width: "200px",
                  },
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  type="button"
                  onClick={() => {
                    clearStudentField();
                  }}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={
                    !schoolYearID ||
                    !LRN ||
                    !depID ||
                    !levelID ||
                    !sectionID ||
                    error
                  }
                >
                  Add student
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            height: "100%",
            gap: 2,
          }}
        >
          <Box
            sx={{
              height: "100%",
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                borderLeft: `5px solid ${colors.primary[900]}`,
                paddingLeft: 2,
                textTransform: "uppercase",
                margin: 2,
              }}
            >
              Schedule and Subject Details
            </Typography>

            <TableContainer>
              <Table size="small" sx={{ minWidth: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject ID</TableCell>
                    <TableCell align="left">Subject Name</TableCell>
                    <TableCell align="left">Time</TableCell>
                    <TableCell align="left">Day</TableCell>
                    <TableCell align="left">Teacher</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {showSched &&
                    schedule.map((val, key) => {
                      return (
                        <TableRow
                          sx={{
                            "& > td ": {
                              textTransform: "capitalize",
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              textTransform: "uppercase !important",
                            }}
                          >
                            {val?.subjectID}
                          </TableCell>
                          <TableCell>{val?.subjectName}</TableCell>
                          <TableCell>
                            {val?.timeStart &&
                              format(new Date(val?.timeStart), "hh:mm a")}{" "}
                            {[" - "]}
                            {val?.timeEnd &&
                              format(new Date(val?.timeEnd), "hh:mm a")}
                          </TableCell>
                          <TableCell
                            sx={{
                              textTransform: "uppercase !important",
                            }}
                          >
                            {val?.day}
                          </TableCell>
                          <TableCell>{val?.teacherName || "-"}</TableCell>
                          <TableCell align="center">
                            <ButtonBase
                              onClick={() => {
                                handleRowClick(val);
                              }}
                            >
                              <Paper
                                sx={{
                                  padding: "2px 10px",
                                  borderRadius: "20px",
                                  display: "flex",
                                  justifyContent: "center",
                                  backgroundColor: colors.whiteOnly[500],
                                  color: colors.redDark[500],
                                  alignItems: "center",
                                }}
                              >
                                <Delete />
                              </Paper>
                            </ButtonBase>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              {/* {showSched && ( */}
              <Box
                sx={{
                  display: `${showSched ? "flex" : "none"}`,
                  alignItems: "center",
                  justifyContent: "end",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  type="button"
                  color="secondary"
                  size="small"
                  sx={{ height: "30px", width: "160px" }}
                  startIcon={<Add />}
                  disabled={!schoolYearID || !depID || !levelID || !sectionID}
                  onClick={() => {
                    setAddSubjectDialog({
                      isOpen: true,
                      depID: depID,
                      levelID: levelID,
                      term: term ? term : "",
                      strandID: strandID ? strandID : "",
                      sectionID: sectionID,
                    });
                  }}
                >
                  Add Subject
                </Button>
              </Box>
              {/* )} */}
            </TableContainer>
          </Box>
          <Box
            sx={{ paddingLeft: 2, borderLeft: "1px solid rgba(0, 0, 0, 0.12)" }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                borderLeft: `5px solid ${colors.primary[900]}`,
                paddingLeft: 2,
                textTransform: "uppercase",
                margin: 2,
              }}
            >
              Students
            </Typography>
            <TableContainer>
              <Table size="small" sx={{ minWidth: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>LRN</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Gender</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {showEnrollees &&
                    enrollees.map((val, key) => {
                      return (
                        <TableRow
                          sx={{
                            "& > td ": {
                              textTransform: "capitalize",
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              textTransform: "uppercase !important",
                            }}
                          >
                            {val?.LRN}
                          </TableCell>
                          <TableCell>{val?.fullName}</TableCell>
                          <TableCell
                            sx={{
                              textTransform: "capitalize",
                            }}
                          >
                            {val?.gender}
                          </TableCell>
                          <TableCell align="center">
                            <ButtonBase
                              onClick={() => {
                                handleStudentRowClick(val);
                              }}
                            >
                              <Paper
                                sx={{
                                  padding: "2px 10px",
                                  borderRadius: "20px",
                                  display: "flex",
                                  justifyContent: "center",
                                  backgroundColor: colors.whiteOnly[500],
                                  color: colors.redDark[500],
                                  alignItems: "center",
                                }}
                              >
                                <Delete />
                              </Paper>
                            </ButtonBase>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Box
          sx={{
            // position: "absolute",
            bottom: 10,
            left: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            type="button"
            color="error"
            size="small"
            sx={{ height: "30px", width: "200px" }}
            startIcon={<DeleteOutline />}
            onClick={() => {
              clearEnrollmentFields();
            }}
          >
            Clear Enrollment
          </Button>
          <Button
            variant="contained"
            type="button"
            color="primary"
            size="small"
            sx={{ height: "30px", width: "160px" }}
            startIcon={<CoPresentOutlined />}
            disabled={
              !schoolYearID ||
              !depID ||
              !levelID ||
              !sectionID ||
              enrollees.length == 0 ||
              schedule.length == 0
            }
            onClick={() => {
              enrollStudent();
            }}
          >
            Enroll Student
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EnrollmentCreate;
