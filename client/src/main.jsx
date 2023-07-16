import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { SchoolYearsContextProvider } from "./context/SchoolYearContext";
import { StudentsContextProvider } from "./context/StudentContext";
import { DepartmentsContextProvider } from "./context/DepartmentContext";
import { SubjectsContextProvider } from "./context/SubjectContext";
import { LevelsContextProvider } from "./context/LevelContext";
import { SectionsContextProvider } from "./context/SectionContext";
import { LoginsContextProvider } from "./context/LoginContext";
import { EnrollmentContextProvider } from "./context/EnrollmentContext";
import { UsersContextProvider } from "./context/UserContext";
import { StrandsContextProvider } from "./context/StrandContext";
import { TeachersContextProvider } from "./context/TeacherContext";
import { SchedulesContextProvider } from "./context/ScheduleContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <UsersContextProvider>
        <StudentsContextProvider>
          <SchoolYearsContextProvider>
            <TeachersContextProvider>
              <DepartmentsContextProvider>
                <SubjectsContextProvider>
                  <StrandsContextProvider>
                    <LevelsContextProvider>
                      <SectionsContextProvider>
                        <StudentsContextProvider>
                          <LoginsContextProvider>
                            <SchedulesContextProvider>
                              <EnrollmentContextProvider>
                                <App />
                              </EnrollmentContextProvider>
                            </SchedulesContextProvider>
                          </LoginsContextProvider>
                        </StudentsContextProvider>
                      </SectionsContextProvider>
                    </LevelsContextProvider>
                  </StrandsContextProvider>
                </SubjectsContextProvider>
              </DepartmentsContextProvider>
            </TeachersContextProvider>
          </SchoolYearsContextProvider>
        </StudentsContextProvider>
      </UsersContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
