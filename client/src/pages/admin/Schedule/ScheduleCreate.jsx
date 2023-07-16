import {
  Add,
  CheckBox,
  CheckBoxOutlineBlank,
  Delete,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  ButtonBase,
  Checkbox,
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
import React, { useState, useEffect } from "react";
import Paper_Title from "../../../components/global/Paper_Title";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { DesktopTimePicker } from "@mui/x-date-pickers";

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
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import { format } from "date-fns-tz";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
const daysSelection = [
  { value: "m", label: "Monday" },
  { value: "t", label: "Tuesday" },
  { value: "w", label: "Wednesday" },
  { value: "th", label: "Thursday" },
  { value: "f", label: "Friday" },
  { value: "s", label: "Saturday" },
];
const ScheduleCreate = () => {
  const { auth } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const { years, yearDispatch } = useSchoolYearsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const { strands, strandDispatch } = useStrandsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { sections, secDispatch } = useSectionsContext();
  const { teachers, teacherDispatch } = useTeachersContext();
  const { subjects, subDispatch } = useSubjectsContext();

  const [schoolYearID, setSchoolYearID] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [depID, setDepID] = useState(null);
  const [strandID, setStrandID] = useState(null);
  const [levelID, setLevelID] = useState(null);
  const [term, setTerm] = useState("");
  const [sectionID, setSectionID] = useState(null);
  const [adviserID, setAdviserID] = useState(null);
  const [adviserName, setAdviserName] = useState("");
  const [subjectID, setSubjectID] = useState(null);
  const [subjectName, setSubjectName] = useState(null);
  const [empID, setEmpID] = useState(null);
  const [empName, setEmpName] = useState("");
  const [days, setDays] = useState([]);
  const [timeStart, setTimeStart] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);

  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [depIDError, setDepIDError] = useState(false);
  const [levelIDError, setLevelIDerror] = useState(false);
  const [sectionIDError, setSectionIDerror] = useState(false);

  const handleFormOpen = () => {
    schoolYear && depID && levelID && sectionID
      ? setShowSubjectForm(true)
      : setShowSubjectForm(false);
  };
  let [schedule, setSchedule] = useState([]);
  const handleTimeStart = (newValue) => {
    setTimeStart(newValue);
  };
  const handleTimeEnd = (newValue) => {
    setTimeEnd(newValue);
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
          console.log(
            "🚀 ~ file: ScheduleCreate.jsx:134 ~ getOverviewDetails ~ json",
            json
          );
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
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        console.log(
          "🚀 ~ file: Sidebar.jsx:81 ~ getOverviewDetails ~ error",
          error
        );
      }
    };
    getOverviewDetails();
  }, [yearDispatch, depDispatch]);

  const handleSubmit = async (e) => {
    setLoadingDialog({ isOpen: true });
    e.preventDefault();
    const data = {
      schoolYearID,
      depID,
      levelID,
      term,
      strandID: strandID ? strandID : "",
      sectionID,
      adviserID,
      adviserName,
      schedule,
    };

    try {
      const response = await axiosPrivate.post(
        "/api/schedules/register",
        JSON.stringify(data)
      );
      if (response?.status === 201) {
        setSuccessDialog({
          isOpen: true,
          message: `Schedule ${data.schoolYearID}_${data.levelID}${
            data.sectionID
          }_${data?.term || ""} has been created!`,
        });
        clearScheduleFields();
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
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        setDepIDError(true);
        setLevelIDerror(true);
        setSectionIDerror(true);
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
  const handleAddSubject = async (e) => {
    e.preventDefault();
    setSchedule;

    const value = {
      subjectID,
      subjectName,
      timeStart,
      timeEnd,
      time: timeStart + timeEnd,
      day:
        days &&
        days.reduce((prev, curr) => {
          return prev + curr?.value;
        }, ""),
      teacherID: empID,
      teacherName: empName,
    };

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
    clearSubjectFields();
    setShowSubjectForm(false);
  };

  const clearSubjectFields = () => {
    setSubjectID(null);
    setSubjectName("");
    setDays([]);
    setTimeStart(null);
    setTimeEnd(null);
    setEmpID(null);
    setEmpName("");
  };
  const clearScheduleFields = () => {
    setDepID(null);
    setLevelID(null);
    setTerm("");
    setStrandID(null);
    setSectionID(null);
    setAdviserID(null);
    setAdviserName("");
    clearSubjectFields();
    setSchedule([]);
    setShowSubjectForm(false);
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
      <Paper_Title title={"schedule > create"} icon={<Add />} />
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 2,
          gap: 2,
          p: 2,
          height: "100%",
        }}
      >
        {/* // ! Schedule Information */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            width: "100%",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
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
                disabled
                value={schoolYear}
              />
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
                    error={depIDError}
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
                  if (newValue === "jhs" || newValue === "elem") {
                    setTerm("none");
                  }

                  setShowSubjectForm(false);
                  clearSubjectFields();
                  setSchedule([]);
                  setAdviserID(null);
                  setAdviserName("");
                  setDepIDError(false);
                }}
              />
              <Typography textAlign="end">Level</Typography>

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
                    error={levelIDError}
                  />
                )}
                value={levelID}
                onChange={(event, newValue) => {
                  setLevelID(newValue);
                  setStrandID(null);
                  setSectionID(null);
                  setShowSubjectForm(false);
                  clearSubjectFields();
                  setSchedule([]);
                  setLevelIDerror(false);
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
              <Typography
                textAlign="end"
                sx={{
                  display:
                    depID === "jhs" || depID === "elem" ? "none" : "block",
                }}
              >
                Term
              </Typography>
              <FormControl
                sx={{
                  display:
                    depID === "jhs" || depID === "elem" ? "none" : "flex",
                }}
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
                    setShowSubjectForm(false);
                    clearSubjectFields();
                    setSchedule([]);
                  }}
                  size="small"
                >
                  <MenuItem value={"1st"}>1st</MenuItem>
                  <MenuItem value={"2nd"}>2nd</MenuItem>
                  {depID !== "shs" && <MenuItem value={"none"}>None</MenuItem>}
                </Select>
              </FormControl>
              <Typography
                sx={{
                  display:
                    depID === "jhs" || depID === "elem" ? "none" : "block",
                }}
                textAlign="end"
              >
                Strand
              </Typography>
              <Autocomplete
                sx={{
                  display:
                    depID === "jhs" || depID === "elem" ? "none" : "flex",
                }}
                disabled={depID !== "shs" || !levelID}
                disablePortal
                id="combo-box-demo"
                options={
                  strands
                    ? levelID &&
                      strands
                        .filter((filter) => {
                          return (
                            filter.depID === "shs" && filter.levelID === levelID
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
                  setShowSubjectForm(false);
                  clearSubjectFields();
                  setSchedule([]);
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
                  <TextField
                    {...params}
                    label="Section ID"
                    size="small"
                    error={sectionIDError}
                  />
                )}
                value={sectionID}
                onChange={(event, newValue) => {
                  setSectionID(newValue);
                  setShowSubjectForm(false);
                  clearSubjectFields();
                  setSchedule([]);
                  setSectionIDerror(false);
                }}
              />
              <Typography textAlign="end">Adviser ID</Typography>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={
                  teachers
                    ? teachers
                        .filter((filter) => {
                          return filter.status === true;
                        })
                        .map((options) => {
                          return options.empID;
                        })
                    : []
                }
                renderInput={(params) => (
                  <TextField {...params} label="Adviser ID" size="small" />
                )}
                value={adviserID}
                onChange={(event, newValue) => {
                  console.log(newValue);
                  setAdviserID(newValue);
                  setAdviserName("");
                  teachers
                    .filter((filter) => {
                      return (
                        newValue === filter.empID && filter.status === true
                      );
                    })
                    .map((options) => {
                      return setAdviserName(
                        options?.firstName +
                          " " +
                          (options?.middleName.charAt(0) + " " || "") +
                          options?.lastName
                      );
                    });
                }}
              />
              <Typography textAlign="end">Adviser </Typography>
              <TextField
                disabled
                variant="outlined"
                placeholder="Adviser Name"
                size="small"
                value={adviserName}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                mt: 2,
                gridColumn: "2",
                justifyContent: "end",
                "& > button": {
                  width: "250px",
                },
              }}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{
                  display:
                    !schedule.length > 0 || !depID || !levelID || !sectionID
                      ? "none"
                      : "block",
                }}
                disabled={
                  !schedule.length > 0 || !depID || !levelID || !sectionID
                }
              >
                Create Schedule
              </Button>
              <Button
                sx={{
                  display: depID || levelID || sectionID ? "block" : "none",
                }}
                variant="contained"
                color="error"
                type="button"
                onClick={() => {
                  clearScheduleFields();
                }}
              >
                Clear Schedule
              </Button>
            </Box>
          </form>
          {showSubjectForm && (
            <form onSubmit={handleAddSubject} style={{ width: "100%" }}>
              {/* // ! Adviser and Subject Information */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "0.75em 2em",
                  alignItems: "center",
                }}
              >
                <Typography textAlign="end">Subject ID</Typography>
                <Autocomplete
                  disablePortal
                  disabled={!levelID}
                  id="combo-box-demo"
                  options={
                    subjects
                      ? levelID &&
                        subjects
                          .filter((filter) => {
                            return filter.status === true &&
                              filter?.strandID === ""
                              ? filter.levelID === levelID
                              : filter.strandID === strandID;
                          })
                          .map((options) => {
                            return options.subjectID;
                          })
                      : []
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Subject ID"
                      size="small"
                      required
                    />
                  )}
                  value={subjectID}
                  onChange={(event, newValue) => {
                    console.log(newValue);
                    setSubjectID(newValue);
                    subjects
                      .filter((filter) => {
                        return (
                          newValue === filter.subjectID &&
                          filter.status === true
                        );
                      })
                      .map((options) => {
                        return setSubjectName(options?.subjectName);
                      });
                  }}
                />
                <Typography textAlign="end">Subject</Typography>
                <TextField
                  disabled
                  variant="outlined"
                  placeholder="Subject Name"
                  size="small"
                  value={subjectName}
                  inputProps={{ style: { textTransform: "capitalize" } }}
                />
                <Typography textAlign="end">Day(s)</Typography>
                <Autocomplete
                  multiple
                  id="checkboxes-tags-demo"
                  options={daysSelection}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={<CheckBoxOutlineBlank />}
                        checkedIcon={<CheckBox />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.label}
                    </li>
                  )}
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Day(s)"
                      placeholder="Day(s)"
                      size="small"
                    />
                  )}
                  value={days}
                  onChange={(event, value) => {
                    setDays(value);
                  }}
                />
                <Typography textAlign="end">Time</Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopTimePicker
                      label="Start"
                      value={timeStart}
                      onChange={handleTimeStart}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          required
                          autoComplete="off"
                          placeholder="hh:mm a"
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopTimePicker
                      label="End"
                      value={timeEnd}
                      onChange={handleTimeEnd}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          required
                          autoComplete="off"
                          placeholder="hh:mm a"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Box>

                <Typography textAlign="end">Teacher</Typography>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={
                    teachers
                      ? teachers
                          .filter((filter) => {
                            return filter.status === true;
                          })
                          .map((options) => {
                            return options.empID;
                          })
                      : []
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Teacher ID" size="small" />
                  )}
                  value={empID}
                  onChange={(event, newValue) => {
                    console.log(newValue);
                    setEmpID(newValue);
                    teachers
                      .filter((filter) => {
                        return (
                          newValue === filter.empID && filter.status === true
                        );
                      })
                      .map((options) => {
                        return setEmpName(
                          options?.firstName +
                            " " +
                            (options?.middleName.charAt(0) + ". " || "") +
                            options?.lastName
                        );
                      });
                  }}
                />
                <Typography textAlign="end">Teacher Name</Typography>
                <TextField
                  disabled
                  variant="outlined"
                  placeholder="Teacher Name"
                  size="small"
                  value={empName}
                  // value={format(new Date(timeEnd), "hh:mm a")}
                  inputProps={{ style: { textTransform: "capitalize" } }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    gridColumn: "2",
                    justifyContent: "end",
                    "& > .MuiButtonBase-root": {
                      width: "200px",
                      height: "35px",
                    },
                  }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={
                      !subjectID || !days.length > 0 || !timeEnd || !timeStart
                    }
                  >
                    save
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    type="button"
                    onClick={() => {
                      clearSubjectFields();
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Box>

        <Box sx={{ borderTop: `solid 1px ${colors.primary[500]}` }}>
          <TableContainer>
            <Table sx={{ minWidth: "100%" }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Subject ID</TableCell>
                  <TableCell align="left">Subject Name</TableCell>
                  <TableCell align="left">Time</TableCell>
                  <TableCell align="left">Day</TableCell>
                  <TableCell align="left">Teacher</TableCell>
                  <TableCell align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedule &&
                  schedule.map((val, key) => {
                    return (
                      <TableRow
                        sx={{
                          "& > td ": {
                            textTransform: "capitalize",
                          },
                        }}
                      >
                        <TableCell>{val?.subjectID}</TableCell>
                        <TableCell>{val?.subjectName}</TableCell>
                        <TableCell>
                          {format(new Date(val?.timeStart), "hh:mm a")}{" "}
                          {[" - "]}
                          {format(new Date(val?.timeEnd), "hh:mm a")}
                        </TableCell>
                        <TableCell
                          sx={{
                            textTransform: "uppercase !important",
                          }}
                        >
                          {val?.day}
                        </TableCell>
                        <TableCell>{val?.teacherName || "-"}</TableCell>
                        <TableCell>
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
                                color: colors.blackOnly[500],
                                alignItems: "center",
                              }}
                            >
                              <Delete />
                              <Typography ml="5px">Remove</Typography>
                            </Paper>
                          </ButtonBase>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              display: showSubjectForm ? "none" : "flex",
              flexDirection: "row",
              justifyContent: "end",
            }}
          >
            <Button
              sx={{
                display:
                  schoolYear && depID && levelID && sectionID ? "flex" : "none",
                mt: 2,
                width: "250px",
              }}
              variant="contained"
              type="button"
              onClick={handleFormOpen}
              size="large"
            >
              Add Subject
            </Button>{" "}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ScheduleCreate;
