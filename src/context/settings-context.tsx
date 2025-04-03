import type { Dispatch, SetStateAction } from "react";
import { useState, useContext, createContext } from "react";
type SettingsContextType = {
  performanceMode: boolean;
  setPerformanceMode: Dispatch<SetStateAction<boolean>>;
};

const settingsContext = createContext<SettingsContextType | null>(null);

export const useSettings = () => {
  const context = useContext(settingsContext);
  if (!context) throw new Error("No settings context found");
  return context;
};

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [performanceMode, setPerformanceMode] = useState(false);
  return (
    <settingsContext.Provider value={{ performanceMode, setPerformanceMode }}>
      {children}
    </settingsContext.Provider>
  );
};

export default SettingsProvider;
