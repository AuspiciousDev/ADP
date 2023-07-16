import { SubjectsContext } from "../context/SubjectContext";
import { useContext } from "react";

export const useSubjectsContext = () => {
  const context = useContext(SubjectsContext);

  if (!context) {
    throw Error(
      "useSubjectsContext must be used inside a SubjectContextProvider"
    );
  }

  return context;
};
