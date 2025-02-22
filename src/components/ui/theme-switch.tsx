"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { IoMdMoon, IoMdSunny } from "react-icons/io";

export default function ThemeSwitch({ tabIndex = 0 }: { tabIndex?: number }) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    }
    if (resolvedTheme === "light") {
      setTheme("dark");
    }
  };

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
        tabIndex={0}
        className={`relative h-6 w-[2.75rem] cursor-pointer rounded-full bg-neutral-100 px-[0.125rem] opacity-10 transition-all`}
      >
        <div
          className={`absolute top-1/2 flex h-[1.25rem] w-[1.25rem] -translate-y-1/2 translate-x-full items-center justify-center rounded-full bg-primary-700 p-[1.5px] text-neutral-50 transition-all duration-300`}
        >
          <FiSun />
        </div>
      </div>
    );

  return (
    <div className="bg-dark rounded-md px-12 py-4">
      <div className="flex w-full shrink-0 items-center justify-between">
        <IoMdMoon className="text-light h-5 w-5 shrink-0" />
        <button
          tabIndex={tabIndex}
          aria-checked={isDarkMode ? "true" : "false"}
          role="switch"
          aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          onClick={toggleTheme}
          className={`${
            isDarkMode ? "bg-neutral-750" : "bg-neutral-250/50"
          } relative block h-6 w-[2.45rem] shrink-0 cursor-pointer rounded-full px-[0.125rem] transition-all`}
        >
          {/* TODO regular css for animation */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 bg-primary-700 ${
              isDarkMode
                ? "translate-x-0 text-neutral-50"
                : "translate-x-full text-neutral-50"
            } } flex h-[1.1rem] w-[1.1rem] items-center justify-center rounded-full p-[1.5px] transition-all duration-300`}
          ></div>
        </button>
        <IoMdSunny className="text-light h-5 w-5 shrink-0" />
      </div>
    </div>
  );
}
