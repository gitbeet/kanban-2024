"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import { FaLaptopCode } from "react-icons/fa";

export default function ThemeSwitchUpdated({
  tabIndex = 0,
}: {
  tabIndex?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div className="bg-dark border-color flex w-fit rounded-full border p-1 opacity-50">
        <div
          role="status"
          aria-busy="true"
          tabIndex={-1}
          className="rounded-full border border-transparent p-1.5"
        >
          <FaLaptopCode className="text-light h-4 w-4 shrink-0" />
        </div>
        <div
          role="status"
          aria-busy="true"
          tabIndex={-1}
          className="rounded-full border border-transparent p-1.5"
        >
          <IoMdSunny className="text-light h-4 w-4 shrink-0" />
        </div>
        <div
          role="status"
          aria-busy="true"
          tabIndex={-1}
          className="rounded-full border border-transparent p-1.5"
        >
          <IoMdMoon className="text-light h-4 w-4 shrink-0" />
        </div>
      </div>
    );

  return (
    <div className="bg-dark border-color w-fit rounded-full border p-1.5 shadow-sm">
      <button
        tabIndex={tabIndex}
        onClick={() => setTheme("system")}
        className={` ${theme === "system" ? "border-color bg-light" : "border-transparent"} rounded-full border p-1.5`}
      >
        <FaLaptopCode className="text-light h-4 w-4 shrink-0" />
      </button>

      <button
        tabIndex={tabIndex}
        onClick={() => setTheme("light")}
        className={` ${theme === "light" ? "border-color bg-light" : "border-transparent"} rounded-full border p-1.5`}
      >
        <IoMdSunny className="text-light h-4 w-4 shrink-0" />
      </button>
      <button
        tabIndex={tabIndex}
        onClick={() => setTheme("dark")}
        className={` ${theme === "dark" ? "border-color bg-light" : "border-transparent"} rounded-full border p-1.5`}
      >
        <IoMdMoon className="text-light h-4 w-4 shrink-0" />
      </button>
    </div>
  );
}
