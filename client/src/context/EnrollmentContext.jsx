import React from "react";
import { createContext, useReducer } from "react";
export const EnrollmentContext = createContext();

export const enrollmentsReducer = (state, action) => {
  switch (action.type) {
    case "SET_ENROLLMENTS":
      return {
        enrollments: action.payload,
      };
    case "CREATE_ENROLLMENT":
      return {
        enrollments: [action.payload, ...state.enrollments],
      };
    case "DELETE_ENROLLMENT":
      return {
        enrollments: state.enrollments.filter(
          (w) => w._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};

export const EnrollmentContextProvider = ({ children }) => {
  const [state, enrollDispatch] = useReducer(enrollmentsReducer, {
    enrollments: null,
  });

  return (
    <EnrollmentContext.Provider value={{ ...state, enrollDispatch }}>
      {children}
    </EnrollmentContext.Provider>
  );
};
