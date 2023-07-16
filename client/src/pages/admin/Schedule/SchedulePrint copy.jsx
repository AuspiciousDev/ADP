import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Paper,
  InputBase,
  Divider,
  Button,
  Typography,
  IconButton,
  ButtonBase,
  TableContainer,
  Table,
  TableRow,
  FormControl,
  TextField,
  TableHead,
  TableCell,
  TableBody,
  InputLabel,
  Select,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { styled } from "@mui/material/styles";
import LoadingDialogue from "../../../global/LoadingDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
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
import { format } from "date-fns-tz";
import { tokens } from "../../../theme";
const SchedulePrint = () => {
  const { scheduleID } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const { years, yearDispatch } = useSchoolYearsContext();
  const { departments, depDispatch } = useDepartmentsContext();
  const { strands, strandDispatch } = useStrandsContext();
  const { levels, levelDispatch } = useLevelsContext();
  const { sections, secDispatch } = useSectionsContext();
  const { teachers, teacherDispatch } = useTeachersContext();
  const { subjects, subDispatch } = useSubjectsContext();
  const { schedules, scheduleDispatch } = useSchedulesContext();

  const [buttonName, setButtonName] = useState("Add subject");
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
  const [dateCreated, setDateCreated] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [errorDialog, setErrorDialog] = useState({
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
        const apiSchedule = await axiosPrivate.get(
          `api/schedules/search/${scheduleID}`
        );
        if (apiSchedule.status === 200) {
          const json = await apiSchedule.data;
          console.log(
            "🚀 ~ file: ScheduleEdit.jsx:188 ~ getOverviewDetails ~ json",
            json
          );
          setSchoolYearID(json?.schoolYearID);
          setDepID(json?.depID);
          setLevelID(json?.levelID);
          setTerm(json?.term);
          setStrandID(json?.strandID || null);
          setSectionID(json?.sectionID);
          setAdviserID(json?.adviserID || null);
          setAdviserName(json?.adviserName || "");
          setSchedule(json?.schedule || []);
          setDateCreated(json?.createdAt);
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
    getOverviewDetails();
  }, [
    yearDispatch,
    depDispatch,
    strandDispatch,
    secDispatch,
    subDispatch,
    scheduleDispatch,
  ]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `"Schedule-"${scheduleID}`,
  });

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      // backgroundColor: "#ccd2d8",
    },
    // hide last border
    " & th": {
      // border: "1px solid #000",
    },
  }));

  const TableTitles = () => {
    return (
      <StyledTableRow
        sx={{
          height: "30px",
          "& > th": {
            textTransform: "uppercase",
            fontWeight: 600,
            color: "black",
          },
        }}
      >
        <TableCell align="left">SUBJECT ID</TableCell>
        <TableCell align="left">SUBJECT NAME</TableCell>
        <TableCell align="left">Time </TableCell>
        <TableCell align="left">Day </TableCell>
        <TableCell align="left">Teacher </TableCell>
      </StyledTableRow>
    );
  };
  return (
    <Box
      className="container-layout_body_contents"
      sx={{ alignItems: "center" }}
    >
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <Paper
        elevation={2}
        ref={componentRef}
        sx={{
          position: "relative",
          display: "flex",
          width: "816px",
          // width: "793px",
          // minWidth: "793px",
          minHeight: "600px",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: "white",
        }}
      >
        {/* // Header */}
        <Box
          sx={{
            position: "absolute",
            left: "0",
            top: "0",
            borderRadius: "10px",
            margin: "20px 0 0 20px",
          }}
        >
          <img alt="logo" src={logo} style={{ width: "100px" }} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "black",
            }}
          >
            <Typography>Republic of the Philippines</Typography>
            <Typography
              variant="h2"
              fontWeight="bold"
              textTransform="uppercase"
            >
              Academia De Pulilan
            </Typography>
            <Typography>Cut-Cot, Pulilan, Bulacan, Philippines</Typography>
            <Typography>044-802-5439</Typography>
            <Typography variant="h3" mt="20px" textTransform="uppercase">
              Class SCHEDULE
            </Typography>
            <Typography
              variant="h3"
              mt="10px"
              textTransform="uppercase"
              fontWeight={600}
            >
              {levels &&
                levelID &&
                levels
                  .filter((filter) => {
                    return filter.levelID === levelID;
                  })
                  .map((val) => {
                    return val.levelNum;
                  })}
              {[" "]} - {["  "]}
              {sections &&
                sectionID &&
                sections
                  .filter((filter) => {
                    return filter.sectionID === sectionID;
                  })
                  .map((val) => {
                    return val?.sectionName;
                  })}
            </Typography>
          </Box>
          <Box
            display="flex"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              mt: "10px",
              pt: 2,
              color: "black",
            }}
          >
            <Divider />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: " 1fr 1fr ",
                paddingTop: 3,
                paddingBottom: 3,
              }}
            >
              {/* //! Schedule Info */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75em 0.5em",
                  alignItems: "center",
                  justifyContent: "center",
                  "& > p ": {
                    textTransform: "capitalize",
                  },
                }}
              >
                <Typography textAlign="end">Academic Year :</Typography>
                <Typography>{schoolYearID}</Typography>

                <Typography textAlign="end">Department :</Typography>
                <Typography>
                  {departments &&
                    depID &&
                    departments
                      .filter((filter) => {
                        return filter.depID === depID;
                      })
                      .map((val) => {
                        return val.depName;
                      })}
                </Typography>

                <Typography textAlign="end">Level :</Typography>
                <Typography>
                  {levels &&
                    levelID &&
                    levels
                      .filter((filter) => {
                        return filter.levelID === levelID;
                      })
                      .map((val) => {
                        return val.levelNum;
                      })}
                </Typography>
                <Typography textAlign="end">Term : </Typography>
                <Typography>{term === "none" ? "" : term}</Typography>
                {/* <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                    <Typography textAlign="end">Term : </Typography>
                    <Typography>1st </Typography>
                  </Box>
                </Box> */}
              </Box>
              {/* //! A Info */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75em 0.5em",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography textAlign="end">Strand :</Typography>
                <Typography sx={{ textTransform: "capitalize" }}>
                  {strands &&
                    strandID &&
                    strands
                      .filter((filter) => {
                        return filter.strandID === strandID;
                      })
                      .map((val) => {
                        return val?.strandName;
                      })}
                </Typography>
                <Typography textAlign="end">Section :</Typography>
                <Typography sx={{ textTransform: "capitalize" }}>
                  {sections &&
                    sectionID &&
                    sections
                      .filter((filter) => {
                        return filter.sectionID === sectionID;
                      })
                      .map((val) => {
                        return val?.sectionName;
                      })}
                </Typography>
                <Typography textAlign="end">Adviser : </Typography>
                <Typography textTransform="capitalize">
                  {adviserName ? adviserName : ""}
                </Typography>

                <Typography textAlign="end">Date Created :</Typography>
                <Typography sx={{ textTransform: "capitalize" }}>
                  {dateCreated &&
                    format(new Date(dateCreated), "MMMM dd, yyyy")}
                </Typography>
              </Box>
            </Box>

            <Box mt="20px">
              <Divider />
              <TableContainer
                sx={{
                  height: "400px",
                }}
              >
                <Table aria-label="simple table">
                  <TableHead>
                    <TableTitles key={"asdas"} />
                  </TableHead>
                  <TableBody>
                    {schedule &&
                      schedule.map((val, key) => {
                        return (
                          <TableRow
                            sx={{
                              "& > td ": {
                                textTransform: "capitalize",
                                color: "black",
                              },
                            }}
                          >
                            <TableCell
                              sx={{ textTransform: "uppercase !important" }}
                            >
                              {val?.subjectID}
                            </TableCell>
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
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      </Paper>
      <Box>
        <Button
          sx={{ width: "200px", mt: "50px" }}
          type="button"
          variant="contained"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          sx={{ width: "200px", mt: "50px", ml: "50px" }}
          type="button"
          variant="contained"
          onClick={handlePrint}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default SchedulePrint;
