"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import { FaLaptopCode } from "react-icons/fa";

export default function ThemeSwitchUpdated({
  tabIndex = 0,
  disabled = false,
}: {
  tabIndex?: number;
  disabled?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div className="bg-dark border-color flex w-fit shrink-0 rounded-full border p-1 opacity-50">
        <div
          role="status"
          aria-busy="true"
          tabIndex={-1}
          className="rounded-full border border-transparent p-1.5"
        >
          <FaLaptopCode className="text-secondary h-4 w-4 shrink-0" />
        </div>
        <div
          role="status"
          aria-busy="true"
          tabIndex={-1}
          className="rounded-full border border-transparent p-1.5"
        >
          <IoMdSunny className="text-secondary h-4 w-4 shrink-0" />
        </div>
        <div
          role="status"
          aria-busy="true"
          tabIndex={-1}
          className="rounded-full border border-transparent p-1.5"
        >
          <IoMdMoon className="text-secondary h-4 w-4 shrink-0" />
        </div>
      </div>
    );

  return (
    <div className="bg-dark border-color w-fit shrink-0 rounded-full border p-1.5 drop-shadow-sm">
      <button
        aria-label="Switch the theme to system preferred"
        tabIndex={tabIndex}
        onClick={() => setTheme("system")}
        className={` ${theme === "system" ? "border-color bg-light" : "border-transparent"} rounded-full border p-1.5`}
      >
        <FaLaptopCode className="text-secondary h-4 w-4 shrink-0" />
      </button>
      <button
        aria-label="Switch to light theme"
        tabIndex={tabIndex}
        onClick={() => setTheme("light")}
        className={` ${theme === "light" ? "border-color bg-light" : "border-transparent"} rounded-full border p-1.5`}
      >
        <IoMdSunny className="text-secondary h-4 w-4 shrink-0" />
      </button>
      <button
        aria-label="Switch to dark theme"
        tabIndex={tabIndex}
        onClick={() => setTheme("dark")}
        className={` ${theme === "dark" ? "border-color bg-light" : "border-transparent"} rounded-full border p-1.5`}
      >
        <IoMdMoon className="text-secondary h-4 w-4 shrink-0" />
      </button>
    </div>
  );
}
