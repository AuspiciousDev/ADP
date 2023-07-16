import { LoginsContext } from "../context/LoginContext";
import { useContext } from "react";

export const useLoginsContext = () => {
  const context = useContext(LoginsContext);

  if (!context) {
    throw Error(
      "useLoginsContextContext must be used inside a LoginsContextProvider"
    );
  }

  return context;
};
