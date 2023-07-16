import { LevelsContext } from "../context/LevelContext";
import { useContext } from "react";

export const useLevelsContext = () => {
  const context = useContext(LevelsContext);

  if (!context) {
    throw Error("useLevelsContext must be used inside a LevelContextProvider");
  }

  return context;
};
