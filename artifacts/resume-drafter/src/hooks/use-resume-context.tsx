import { createContext, useContext, useState, ReactNode } from "react";
import { ParsedResume } from "@workspace/api-client-react";

interface ResumeContextType {
  resume: ParsedResume | null;
  setResume: (resume: ParsedResume | null) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resume, setResume] = useState<ParsedResume | null>(null);

  return (
    <ResumeContext.Provider value={{ resume, setResume }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResumeContext must be used within a ResumeProvider");
  }
  return context;
}
