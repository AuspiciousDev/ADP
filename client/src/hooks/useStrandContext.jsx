import { StrandsContext } from "../context/StrandContext";
import { useContext } from "react";

export const useStrandsContext = () => {
  const context = useContext(StrandsContext);

  if (!context) {
    throw Error(
      "useStrandContextContextContext must be used inside a StrandsContextProvider"
    );
  }

  return context;
};
