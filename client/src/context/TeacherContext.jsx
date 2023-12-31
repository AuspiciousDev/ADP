import React from "react";
import { createContext, useReducer } from "react";
export const TeachersContext = createContext();

export const teachersReducer = (state, action) => {
  switch (action.type) {
    case "SET_TEACHERS":
      return {
        teachers: action.payload,
      };
    case "CREATE_TEACHER":
      return {
        teachers: [action.payload, ...state.teachers],
      };
    case "DELETE_TEACHER":
      return {
        teachers: state.teachers.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const TeachersContextProvider = ({ children }) => {
  const [state, teacherDispatch] = useReducer(teachersReducer, {
    teachers: null,
  });

  return (
    <TeachersContext.Provider value={{ ...state, teacherDispatch }}>
      {children}
    </TeachersContext.Provider>
  );
};
