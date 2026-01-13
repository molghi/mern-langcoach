import { useContext } from "react";
import { Context } from "../context/MyContext";

function useMyContext() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Incorrect context usage");
  return ctx;
}

export default useMyContext;
