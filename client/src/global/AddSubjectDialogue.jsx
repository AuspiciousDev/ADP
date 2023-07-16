import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
  Autocomplete,
  Box,
  TextField,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useSubjectsContext } from "../hooks/useSubjectContext";
import { useTeachersContext } from "../hooks/useTeacherContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
const daysSelection = [
  { value: "m", label: "Monday" },
  { value: "t", label: "Tuesday" },
  { value: "w", label: "Wednesday" },
  { value: "th", label: "Thursday" },
  { value: "f", label: "Friday" },
  { value: "s", label: "Saturday" },
];
const AddSubjectDialogue = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { subjects, subDispatch } = useSubjectsContext();
  const { teachers, teacherDispatch } = useTeachersContext();
  const { addSubjectDialog, setAddSubjectDialog, onClose } = props;

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
  let [schedule, setSchedule] = useState([]);
  const handleTimeStart = (newValue) => {
    setTimeStart(newValue);
  };
  const handleTimeEnd = (newValue) => {
    setTimeEnd(newValue);
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
    handleClose(value);
  };

  const handleClose = (value, reason) => {
    if (reason && reason === "backdropClick") {
      return setAddSubjectDialog({ isOpen: false }), console.log("tig1");
    } else {
      return (
        onClose(value),
        console.log("tig2"),
        setAddSubjectDialog({
          ...addSubjectDialog,
          isOpen: false,
        }),
        clearSubjectFields()
      );
    }
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
  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={addSubjectDialog.isOpen}
      onClose={handleClose}
    >
      <DialogTitle sx={{ margin: "0 30px" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h3">
            {addSubjectDialog?.title || "Add Subject"}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ margin: "10px 20px" }}>
        {/* // ! Adviser and Subject Information */}
        <form onSubmit={handleAddSubject} style={{ width: "100%" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "0.5em 1em",
              alignItems: "center",
              margin: "5px",
            }}
          >
            <Typography textAlign="end">Subject ID</Typography>
            <Autocomplete
              disablePortal
              disabled={!addSubjectDialog.levelID}
              id="combo-box-demo"
              options={
                subjects
                  ? addSubjectDialog.levelID &&
                    subjects
                      .filter((filter) => {
                        return filter.status === true && filter?.strandID === ""
                          ? filter.levelID === addSubjectDialog.levelID
                          : filter.strandID === addSubjectDialog.strandID;
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
                      newValue === filter.subjectID && filter.status === true
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
                    return newValue === filter.empID && filter.status === true;
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
                color="error"
                type="button"
                onClick={() => {
                  clearSubjectFields();
                }}
              >
                Clear
              </Button>{" "}
              <Button
                variant="contained"
                type="submit"
                disabled={
                  !subjectID || !days.length > 0 || !timeEnd || !timeStart
                }
              >
                Add
              </Button>
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialogue;
