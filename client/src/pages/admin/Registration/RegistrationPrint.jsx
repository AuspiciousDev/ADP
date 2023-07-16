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

const RegistrationPrint = () => {
  const { enrollmentID, scheduleID } = useParams();
  console.log(
    "🚀 ~ file: RegistrationPrint.jsx:47 ~ RegistrationPrint ~ enrollmentID",
    enrollmentID
  );
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

  const schoolName = " Academia De Pulilan ";
  const [_id, set_ID] = useState("");
  const [LRN, setLRN] = useState("");
  const [gender, setGender] = useState("");
  const [studentName, setStudentName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState(null);
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
  const getAge = (birthDate) =>
    Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `"COR-"${enrollmentID}`,
  });

  useEffect(() => {
    const getOverviewDetails = async () => {
      try {
        let syID, lvlID, secID, strID, trm;
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
        const apiEnrollment = await axiosPrivate.get(
          `api/enrollments/search/${enrollmentID}`
        );
        if (apiEnrollment.status === 200) {
          const json = await apiEnrollment.data;
          console.log(
            "🚀 ~ file: RegistrationPrint.jsx:159 ~ getOverviewDetails ~ json:",
            json
          );
          console.log(
            "🚀 ~ file: RegistrationPrint.jsx:1599 ~ getOverviewDetails ~ json:",
            json.schedule
          );
          setLRN(json?.LRN);
          setStudentName(
            json?.middleName
              ? json?.firstName + " " + json?.middleName + " " + json?.lastName
              : json?.firstName + " " + json?.lastName
          );
          setGender(json?.gender);
          setAge(
            json?.dateOfBirth
              ? getAge(format(new Date(json?.dateOfBirth), " MMMM dd, yyyy")) +
                  " yrs."
              : "-"
          );
          set_ID(json?._id);
          setSchoolYearID(json?.schoolYearID);
          setDepID(json?.depID);
          setLevelID(json?.levelID);
          setTerm(json?.term);
          setStrandID(json?.strandID || "");
          setSectionID(json?.sectionID);
          setAdviserID(json?.adviserID || null);
          setAdviserName(json?.adviserName || "");
          setSchedule(json?.schedule || []);
          setDateCreated(json?.createdAt);
          syID = json?.schoolYearID;
          lvlID = json?.levelID;
          secID = json?.sectionID;
          strID = json?.strandID;
          trm = json?.term;
        }
        console.log(
          `api/schedules/search/${syID}_${lvlID + secID}_${trm ? trm : "none"}`
        );
        const apiSchedule = await axiosPrivate.get(
          `api/enrollments/search/${enrollmentID}`
        );
        console.log(
          "🚀 ~ file: RegistrationPrint.jsx:192 ~ getOverviewDetails ~ apiSchedule",
          apiSchedule
        );

        if (apiSchedule.status === 200) {
          const json = await apiSchedule.data;
          console.log(
            "🚀 ~ file: ScheduleEdit.jsx:188 ~ getOverviewDetails ~ json",
            json
          );
          setAdviserID(json?.adviserID || null);
          setAdviserName(json?.adviserName || "");
          setSchedule(json?.schedule || []);
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
  }, [
    yearDispatch,
    depDispatch,
    strandDispatch,
    secDispatch,
    subDispatch,
    scheduleDispatch,
  ]);
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
      sx={{
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <Paper
        elevation={2}
        ref={componentRef}
        className="RegistrationPrint"
        sx={{
          position: "relative",
          display: "flex",
          width: "816px",
          // width: "793px",
          // minWidth: "793px",
          minHeight: "600px",
          justifyContent: "center",
          padding: "20px",
          overflow: "scroll",
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
            position: "absolute",
            opacity: "0.1",
            left: "20%",
            bottom: "30%",
          }}
        >
          <img alt="logo" src={logo} style={{ width: "500px" }} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            color: "black",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
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
            <Typography
              variant="h3"
              mt="10px"
              textTransform="uppercase"
              fontWeight={600}
            >
              Certificate of Registration
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              mt: "10px",
              pt: 2,
              //   border: "1px solid black",
            }}
          >
            {/* //! Registration ID  */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                //   border: "1px solid black",
              }}
            >
              <Typography>Registration ID :</Typography>
              <Typography
                fontWeight={600}
                variant="subtitle2"
                sx={{
                  textTransform: "uppercase !important",
                  color: "#003333",
                }}
              >
                {_id}
              </Typography>
            </Box>
            <Divider sx={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }} />
            {/* //! Registration INFORMATION   */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: " 1fr 1fr 1fr ",
                paddingTop: 1,
                paddingBottom: 1,
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
                  "& >.MuiTypography-root ": {
                    textTransform: "capitalize",
                    fontSize: "9pt",
                  },
                }}
              >
                <Typography textAlign="end">Student LRN:</Typography>
                <Typography fontWeight={600}>{LRN || "-"}</Typography>

                <Typography textAlign="end">Student Name : </Typography>
                <Typography fontWeight={600}>{studentName}</Typography>

                <Typography textAlign="end">Gender :</Typography>
                <Typography fontWeight={600}>{gender}</Typography>
                <Typography textAlign="end">Age : </Typography>
                <Typography fontWeight={600}>{age}</Typography>
              </Box>
              {/* //! A Info */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75em 0.5em",
                  alignItems: "center",
                  justifyContent: "center",
                  "& >.MuiTypography-root ": {
                    textTransform: "capitalize",
                    fontSize: "9pt",
                  },
                }}
              >
                <Typography textAlign="end">Department : </Typography>
                <Typography fontWeight={600} textTransform="capitalize">
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
                <Typography textAlign="end">Level:</Typography>
                <Typography fontWeight={600} textTransform="capitalize">
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
                <Typography textAlign="end">Term :</Typography>
                <Typography fontWeight={600} textTransform="capitalize">
                  {term === "none" ? "" : term}
                </Typography>
                <Typography textAlign="end">Strand : </Typography>
                <Typography fontWeight={600} textTransform="capitalize">
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
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75em 0.5em",
                  alignItems: "center",
                  justifyContent: "center",
                  "& >.MuiTypography-root ": {
                    textTransform: "capitalize",
                    fontSize: "9pt",
                  },
                }}
              >
                <Typography textAlign="end">Section :</Typography>
                <Typography
                  sx={{ textTransform: "capitalize" }}
                  fontWeight={600}
                >
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

                <Typography textAlign="end">Academic Year : </Typography>
                <Typography fontWeight={600} textTransform="capitalize">
                  {schoolYearID}
                </Typography>
                <Typography textAlign="end">Date Enrolled :</Typography>
                <Typography
                  sx={{ textTransform: "capitalize" }}
                  fontWeight={600}
                >
                  {format(new Date(dateCreated), "MMMM dd, yyyy")}
                </Typography>
                <Typography textAlign="end">Adviser : </Typography>
                <Typography textTransform="capitalize" fontWeight={600}>
                  {adviserName ? adviserName : ""}
                </Typography>
              </Box>
            </Box>
            {/* //! Schedule INFORMATION   */}
            <Box>
              <Divider sx={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }} />
              <TableContainer
                sx={{
                  height: "100%",
                }}
              >
                <Table aria-label="simple table" size="small">
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
                                fontSize: "9pt",
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
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                mt: "10px",
                textAlign: "center",
                //   border: "1px solid black",
                "& >.MuiTypography-root ": {
                  // textTransform: "capitalize",
                  fontSize: "8pt",
                },
              }}
            >
              {/* //! signing */}
              <Box
                sx={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  mt: "10px",
                  textAlign: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    //   border: "1px solid black",
                    "& >.MuiTypography-root ": {
                      fontSize: "9pt",
                    },
                  }}
                >
                  <Typography sx={{ mb: 1, fontWeight: 600 }}>
                    RULES GOVERNING REFUND
                  </Typography>
                  <Typography>
                    First week - 70% refund of tuition fee
                  </Typography>
                  <Typography>
                    Second week - 50% refund of tuition fee
                  </Typography>
                  <Typography>
                    Third week - 30% refund of tuition fee
                  </Typography>
                  <Typography>
                    If the withdrawal is made after third week of classess.
                    He/She not entitled to any refund.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    //   border: "1px solid black",
                    "& >.MuiTypography-root ": {
                      fontSize: "9pt",
                    },
                  }}
                >
                  <Typography sx={{ mb: 1, fontWeight: 600 }}>
                    PLEDGE UPON ADMISSION
                  </Typography>
                  <Typography>
                    In consideration of my admission to the {schoolName}
                    and of the privileges of students in this institution, I
                    hereby abide by and comply with all the rules and
                    regulations laid down by competent authorities in the
                    {schoolName} in which I am enrolled.
                  </Typography>
                  <Typography
                    sx={{
                      borderTop: "solid 2px black ",
                      width: "200px",
                      paddingTop: 1,
                      mt: 4,
                      alignSelf: "end",
                    }}
                  >
                    Student's Signature
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ m: 2, backgroundColor: "rgba(0, 0, 0, 0.12)" }} />
              <Typography variant="subtitle2">
                This is to certify that the above mentioned name is a bonafide
                student {schoolName}. Likewise, as per our records,{[" "]}
                {gender === "female" ? "Ms." : "Mr."}
                <span style={{ textTransform: "capitalize" }}>
                  {studentName} {[" "]}
                </span>
                is presently enrolled in
                <span style={{ textTransform: "capitalize" }}>
                  {departments &&
                    depID &&
                    departments
                      .filter((filter) => {
                        return filter.depID === depID;
                      })
                      .map((val) => {
                        return " " + val.depName + " ";
                      })}
                </span>
                {strands &&
                  strandID &&
                  strands
                    .filter((filter) => {
                      return filter.strandID === strandID;
                    })
                    .map((val) => {
                      return " " + val?.strandName + " ";
                    })}
                ~ Grade
                {levels &&
                  levelID &&
                  levels
                    .filter((filter) => {
                      return filter.levelID === levelID;
                    })
                    .map((val) => {
                      return " " + val.levelNum + " ";
                    })}
                -
                <span style={{ textTransform: "capitalize" }}>
                  {sections &&
                    sectionID &&
                    sections
                      .filter((filter) => {
                        return filter.sectionID === sectionID;
                      })
                      .map((val) => {
                        return " " + val?.sectionName + " ";
                      })}
                </span>
                this Academic Year {schoolYear}.
              </Typography>
              <Divider sx={{ m: 1, backgroundColor: "rgba(0, 0, 0, 0.12)" }} />
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, fontStyle: "italic" }}
              >
                This certification may be subject to laws and regulations of
                this country depending upon its use. In addition, fraudulently
                obtaining, altering, counterfeiting, forging or otherwise
                tampering with this certification or falsifying the information
                contained herein in order to be used in any illicit,
                illegitimate or unlawful activities may be subject to criminal
                or civil offense.
              </Typography>
              <Divider sx={{ m: 1, backgroundColor: "rgba(0, 0, 0, 0.12)" }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end", //   border: "1px solid black",
                  "& >.MuiTypography-root ": {
                    textTransform: "capitalize",
                    fontSize: "10pt",
                  },
                }}
              >
                <Typography>Approved By:</Typography>
                <Typography
                  sx={{
                    borderTop: "solid 2px black ",
                    width: "200px",
                    paddingTop: 1,
                    mt: 4,
                    alignSelf: "end",
                  }}
                >
                  School's Registrar
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "end", gap: 1, mt: 1 }}
              >
                <Typography variant="subtitle2">Date printed:</Typography>
                <Typography variant="subtitle2">
                  {format(new Date(), "hh:mm a - MMMM dd, yyyy")}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
      <Box>
        <Button
          sx={{ width: "200px", mt: "10px" }}
          type="button"
          variant="contained"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          sx={{ width: "200px", mt: "10px", ml: "50px" }}
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

export default RegistrationPrint;
