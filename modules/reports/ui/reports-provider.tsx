"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { STUDENTS_DATA, type StudentReportItem } from "../fixtures";
import { createParticipant, INITIAL_GOAL_RULES, reviewParticipants, type GoalRule, type ParticipantInput } from "../participants";

type ReportsState = {
  participants: StudentReportItem[];
  goalRules: GoalRule[];
  saveGoalRule: (rule: GoalRule) => void;
  addParticipants: (inputs: ParticipantInput[]) => string | null;
};
const ReportsContext = createContext<ReportsState | null>(null);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [participants, setParticipants] = useState(STUDENTS_DATA);
  const [goalRules, setGoalRules] = useState(INITIAL_GOAL_RULES);

  function saveGoalRule(rule: GoalRule) {
    setGoalRules((current) => [...current.filter((item) => item.year !== rule.year), rule].sort((a, b) => a.year - b.year));
  }
  function addParticipants(inputs: ParticipantInput[]) {
    const reviews = reviewParticipants(inputs, participants, goalRules);
    if (!reviews.length || reviews.some((review) => review.issues.length)) return "Revisa los datos: hay errores, duplicados o metas pendientes de configurar.";
    const additions = reviews.map(createParticipant);
    setParticipants((current) => [...current, ...additions]);
    return null;
  }
  return <ReportsContext.Provider value={{ participants, goalRules, saveGoalRule, addParticipants }}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) throw new Error("El reporte requiere ReportsProvider.");
  return context;
}
