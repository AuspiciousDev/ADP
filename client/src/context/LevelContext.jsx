import React from "react";import { createContext, useReducer } from "react";
export const LevelsContext = createContext();

export const levelsReducer = (state, action) => {
  switch (action.type) {
    case "SET_LEVELS":
      return {
        levels: action.payload,
      };
    case "CREATE_LEVEL":
      return {
        levels: [action.payload, ...state.levels],
      };
    case "DELETE_LEVEL":
      return {
        levels: state.levels.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};
export const LevelsContextProvider = ({ children }) => {
  const [state, levelDispatch] = useReducer(levelsReducer, {
    levels: null,
  });
  return (
    <LevelsContext.Provider value={{ ...state, levelDispatch }}>
      {children}
    </LevelsContext.Provider>
  );
};
