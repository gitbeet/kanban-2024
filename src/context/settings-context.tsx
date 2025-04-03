import type { Dispatch, SetStateAction } from "react";
import { useState, useContext, createContext } from "react";
type SettingsContextType = {
  performanceMode: boolean;
  setPerformanceMode: Dispatch<SetStateAction<boolean>>;
};

type Props = {
  children: React.ReactNode;
  dbPerformanceMode: boolean | undefined;
};

const settingsContext = createContext<SettingsContextType | null>(null);

export const useSettings = () => {
  const context = useContext(settingsContext);
  if (!context) throw new Error("No settings context found");
  return context;
};

const SettingsProvider = ({ children, dbPerformanceMode }: Props) => {
  const [performanceMode, setPerformanceMode] = useState(
    dbPerformanceMode ?? false,
  );
  return (
    <settingsContext.Provider value={{ performanceMode, setPerformanceMode }}>
      {children}
    </settingsContext.Provider>
  );
};

export default SettingsProvider;
