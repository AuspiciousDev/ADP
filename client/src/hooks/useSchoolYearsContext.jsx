import { SchoolYearsContext } from "../context/SchoolYearContext";
import { useContext } from "react";

export const useSchoolYearsContext = () => {
  const context = useContext(SchoolYearsContext);

  if (!context) {
    throw Error(
      "useSchoolYearsContext must be used inside a SchoolYearsContextProvider"
    );
  }

  return context;
};
