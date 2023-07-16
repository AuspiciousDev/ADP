import { SchedulesContext } from "../context/ScheduleContext";
import { useContext } from "react";

export const useSchedulesContext = () => {
  const context = useContext(SchedulesContext);

  if (!context) {
    throw Error(
      "useSchedulesContext must be used inside a ScheduleContextProvider"
    );
  }

  return context;
};
