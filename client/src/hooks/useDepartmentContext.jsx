import { DepartmentsContext } from "../context/DepartmentContext";
import { useContext } from "react";

export const useDepartmentsContext = () => {
  const context = useContext(DepartmentsContext);

  if (!context) {
    throw Error(
      "useDepartmentsContext must be used inside a DepartmentsContextProvider"
    );
  }

  return context;
};
