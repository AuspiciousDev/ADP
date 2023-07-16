import React from "react";
import { createContext, useReducer } from "react";
export const SchoolYearsContext = createContext();

export const schoolYearsReducer = (state, action) => {
  switch (action.type) {
    case "SET_YEARS":
      return {
        years: action.payload,
      };
    case "CREATE_YEAR":
      return {
        years: [action.payload, ...state.years],
      };
    case "DELETE_YEAR":
      return {
        years: state.years.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const SchoolYearsContextProvider = ({ children }) => {
  const [state, yearDispatch] = useReducer(schoolYearsReducer, {
    years: null,
  });

  return (
    <SchoolYearsContext.Provider value={{ ...state, yearDispatch }}>
      {children}
    </SchoolYearsContext.Provider>
  );
};
