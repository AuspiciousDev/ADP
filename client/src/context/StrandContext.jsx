import React from "react";
import { createContext, useReducer } from "react";
export const StrandsContext = createContext();

export const strandsReducer = (state, action) => {
  switch (action.type) {
    case "SET_STRANDS":
      return {
        strands: action.payload,
      };
    case "CREATE_STRAND":
      return {
        strands: [action.payload, ...state.strands],
      };
    case "DELETE_STRAND":
      return {
        strands: state.strands.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const StrandsContextProvider = ({ children }) => {
  const [state, strandDispatch] = useReducer(strandsReducer, {
    strands: null,
  });

  return (
    <StrandsContext.Provider value={{ ...state, strandDispatch }}>
      {children}
    </StrandsContext.Provider>
  );
};
