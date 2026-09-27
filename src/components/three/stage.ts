"use client";

import { createContext, useContext } from "react";

/** Which surface a 3D scene sits on. Glows add light on "dark"; on "light" they must paint normally. */
export type Stage = "light" | "dark";
export const StageContext = createContext<Stage>("dark");
export const useStage = () => useContext(StageContext);

/** Data hues per stage (lines need a deeper sage and amber on white). */
export const hues = (stage: Stage) => ({
  warm: stage === "light" ? "#e08a00" : "#ffac2e",
  cool: stage === "light" ? "#4f9a5c" : "#a0e0ab",
  hot: stage === "light" ? "#a52d25" : "#e0584c",
  amber: stage === "light" ? "#e08a00" : "#ffac2e",
  water: stage === "light" ? "#5f6b75" : "#e6e6e6",
});
