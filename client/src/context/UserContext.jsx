import React from "react";
import { createContext, useReducer } from "react";
export const UsersContext = createContext();

export const usersReducer = (state, action) => {
  switch (action.type) {
    case "SET_USERS":
      return {
        users: action.payload,
      };
    case "CREATE_USER":
      return {
        users: [action.payload, ...state.users],
      };
    case "DELETE_USER":
      return {
        users: state.users.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const UsersContextProvider = ({ children }) => {
  const [state, userDispatch] = useReducer(usersReducer, {
    users: null,
  });

  return (
    <UsersContext.Provider value={{ ...state, userDispatch }}>
      {children}
    </UsersContext.Provider>
  );
};
