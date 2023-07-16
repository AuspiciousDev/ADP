import React from "react";
import { createContext, useReducer } from "react";
export const LoginsContext = createContext();

export const loginsReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOGINS":
      return {
        logins: action.payload,
      };
    case "CREATE_LOGIN":
      return {
        logins: [action.payload, ...state.logins],
      };
    case "DELETE_LOGIN":
      return {
        logins: state.logins.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const LoginsContextProvider = ({ children }) => {
  const [state, loginDispatch] = useReducer(loginsReducer, {
    logins: null,
  });

  return (
    <LoginsContext.Provider value={{ ...state, loginDispatch }}>
      {children}
    </LoginsContext.Provider>
  );
};
