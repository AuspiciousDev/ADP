import React from "react";import { createContext, useReducer } from "react";
export const DepartmentsContext = createContext();

export const departmentsReducer = (state, action) => {
  switch (action.type) {
    case "SET_DEPS":
      return {
        departments: action.payload,
      };
    case "CREATE_DEP":
      return {
        departments: [action.payload, ...state.departments],
      };
    case "DELETE_DEP":
      return {
        departments: state.departments.filter(
          (w) => w._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};

export const DepartmentsContextProvider = ({ children }) => {
  const [state, depDispatch] = useReducer(departmentsReducer, {
    departments: null,
  });

  return (
    <DepartmentsContext.Provider value={{ ...state, depDispatch }}>
      {children}
    </DepartmentsContext.Provider>
  );
};
