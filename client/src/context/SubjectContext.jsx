import React from "react";
import { createContext, useReducer } from "react";
export const SubjectsContext = createContext();

export const subjectsReducer = (state, action) => {
  switch (action.type) {
    case "SET_SUBJECTS":
      return {
        subjects: action.payload,
      };
    case "CREATE_SUBJECT":
      return {
        subjects: [action.payload, ...state.subjects],
      };
    case "DELETE_SUBJECT":
      return {
        subjects: state.subjects.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const SubjectsContextProvider = ({ children }) => {
  const [state, subDispatch] = useReducer(subjectsReducer, {
    subjects: null,
  });

  return (
    <SubjectsContext.Provider value={{ ...state, subDispatch }}>
      {children}
    </SubjectsContext.Provider>
  );
};
