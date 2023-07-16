import { useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
// ! PUBLIC ROUTES
import Login from "./pages/public/Login";
import Activate from "./pages/public/Activate";
import Unauthorized from "./pages/public/Unauthorized";
import NotFound404 from "./pages/public/NotFound404";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
// ! PRIVATE ROUTES
import PersistLogin from "./pages/components/PersistLogin";
import RequireAuth from "./pages/components/RequireAuth";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import ADMIN_Layout from "./pages/admin/Layout/ADMIN_Layout";
import SchoolYear from "./pages/admin/School Year/SchoolYear";
import Department from "./pages/admin/Department/Department";
import Level from "./pages/admin/Level/Level";
import Section from "./pages/admin/Section/Section";
import StudentCreate from "./pages/admin/Student/StudentCreate";
import StudentRecord from "./pages/admin/Student/StudentRecord";
import Student from "./pages/admin/Student/Student";
import Archive from "./pages/admin/Archive/Archive";
import Enrollment from "./pages/admin/Enrollment/Enrollment";
import User from "./pages/admin/User/User";
import UserRecord from "./pages/admin/User/UserRecord";
import Subject from "./pages/admin/Subject/Subject";
import UserCreate from "./pages/admin/User/UserCreate";
import UserRecordEdit from "./pages/admin/User/UserRecordEdit";
import Strand from "./pages/admin/Strand/Strand";
import Schedule from "./pages/admin/Schedule/Schedule";
import Teacher from "./pages/admin/Teacher/Teacher";
import TeacherCreate from "./pages/admin/Teacher/TeacherCreate";
import TeacherRecord from "./pages/admin/Teacher/TeacherRecord";
import ScheduleCreate from "./pages/admin/Schedule/ScheduleCreate";
import SchedulePrint from "./pages/admin/Schedule/SchedulePrint";
import ScheduleEdit from "./pages/admin/Schedule/ScheduleEdit";
import EnrollmentCreate from "./pages/admin/Enrollment/EnrollmentCreate";
import EnrollmentEdit from "./pages/admin/Enrollment/EnrollmentEdit";
import RegistrationPrint from "./pages/admin/Registration/RegistrationPrint";
import StudentEdit from "./pages/admin/Student/StudentEdit";
import ChangePassword from "./pages/admin/User/ChangePassword";
import useAuth from "./hooks/useAuth";
import EnrollmentBulk from "./pages/admin/Enrollment/EnrollmentBulk";

const USER_TYPE = {
  REGISTRAR: "registrar",
  TEACHER: "teacher",
  STAFF: "staff",
};

function App() {
  const [theme, colorMode] = useMode();
  const { auth, setAuth, persist, setPersist } = useAuth();
  console.log(auth.length);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            // ! PUBLIC ROUTES
            <Route path="/" element={<Login />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="auth/reset-password/:resetToken"
              element={<ResetPassword />}
            />
            <Route path="*" element={<NotFound404 />} />
            <Route
              path="auth/activate/:activation_token"
              element={<Activate />}
            />
            // ! PRIVATE ROUTES
            <Route element={<PersistLogin />}>
              <Route
                element={
                  <RequireAuth
                    allowedRoles={[
                      USER_TYPE.REGISTRAR,
                      USER_TYPE.TEACHER,
                      USER_TYPE.STAFF,
                    ]}
                  />
                }
              >
                <Route path="/registrar" element={<ADMIN_Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route
                    path="enrollment/edit/:enrollmentID"
                    element={<EnrollmentEdit />}
                  />
                  <Route
                    path="enrollment/create"
                    element={<EnrollmentCreate />}
                  />
                  <Route path="enrollment/bulk" element={<EnrollmentBulk />} />
                  <Route path="enrollment" element={<Enrollment />} />
                  <Route
                    path="enrollment/print/:enrollmentID"
                    element={<RegistrationPrint />}
                  />
                  <Route path="archive" element={<Archive />} />
                  <Route path="user" element={<User />} />
                  <Route path="user/create" element={<UserCreate />} />
                  <Route
                    path="user/profile/:username"
                    element={<UserRecord />}
                  />
                  <Route
                    path="user/edit/:username"
                    element={<UserRecordEdit />}
                  />
                  <Route
                    path="user/changePassword"
                    element={<ChangePassword />}
                  />
                  <Route path="subject" element={<Subject />} />
                  <Route path="student" element={<Student />} />
                  <Route path="student/edit/:LRN" element={<StudentEdit />} />
                  <Route path="student/create" element={<StudentCreate />} />
                  <Route path="student/:LRN" element={<StudentRecord />} />
                  <Route
                    path="schedule/print/:enrollmentID"
                    element={<SchedulePrint />}
                  />

                  <Route
                    path="schedule/edit/:scheduleID"
                    element={<ScheduleEdit />}
                  />
                  <Route path="schedule/create" element={<ScheduleCreate />} />
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="teacher/create" element={<TeacherCreate />} />
                  <Route path="teacher/:empID" element={<TeacherRecord />} />
                  <Route path="teacher" element={<Teacher />} />
                  <Route path="section" element={<Section />} />
                  <Route path="strand" element={<Strand />} />
                  <Route path="level" element={<Level />} />
                  <Route path="department" element={<Department />} />
                  <Route path="school-year" element={<SchoolYear />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
