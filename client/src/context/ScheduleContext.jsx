import React from "react";
import { createContext, useReducer } from "react";
export const SchedulesContext = createContext();

export const schedulesReducer = (state, action) => {
  switch (action.type) {
    case "SET_SCHEDULES":
      return {
        schedules: action.payload,
      };
    case "CREATE_SCHEDULE":
      return {
        schedules: [action.payload, ...state.schedules],
      };
    case "DELETE_SCHEDULE":
      return {
        schedules: state.schedules.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const SchedulesContextProvider = ({ children }) => {
  const [state, scheduleDispatch] = useReducer(schedulesReducer, {
    schedules: null,
  });

  return (
    <SchedulesContext.Provider value={{ ...state, scheduleDispatch }}>
      {children}
    </SchedulesContext.Provider>
  );
};
