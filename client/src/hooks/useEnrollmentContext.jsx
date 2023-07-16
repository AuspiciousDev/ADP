import { EnrollmentContext } from "../context/EnrollmentContext";
import { useContext } from "react";

export const useEnrollmentsContext = () => {
  const context = useContext(EnrollmentContext);

  if (!context) {
    throw Error(
      "useEnrollmentsContextContext must be used inside a EnrollmentsContextProvider"
    );
  }

  return context;
};
