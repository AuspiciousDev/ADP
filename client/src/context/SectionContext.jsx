import React from "react";
import { createContext, useReducer } from "react";
export const SectionsContext = createContext();

export const sectionsReducer = (state, action) => {
  switch (action.type) {
    case "SET_SECS":
      return {
        sections: action.payload,
      };
    case "CREATE_SEC":
      return {
        sections: [action.payload, ...state.sections],
      };
    case "DELETE_SEC":
      return {
        sections: state.sections.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const SectionsContextProvider = ({ children }) => {
  const [state, secDispatch] = useReducer(sectionsReducer, {
    sections: null,
  });

  return (
    <SectionsContext.Provider value={{ ...state, secDispatch }}>
      {children}
    </SectionsContext.Provider>
  );
};
