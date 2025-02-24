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
      <div className="bg-dark flex w-fit rounded-full border border-neutral-250 p-1 opacity-50 dark:border-neutral-650">
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
    <div className="bg-dark w-fit rounded-full border border-neutral-250 p-1 shadow-sm dark:border-neutral-650">
      <button
        tabIndex={tabIndex}
        onClick={() => setTheme("system")}
        className={` ${theme === "system" ? "border-neutral-250 dark:border-neutral-650" : "border-transparent"} rounded-full border p-1.5`}
      >
        <FaLaptopCode className="text-light h-4 w-4 shrink-0" />
      </button>

      <button
        tabIndex={tabIndex}
        onClick={() => setTheme("light")}
        className={` ${theme === "light" ? "border-neutral-250 dark:border-neutral-650" : "border-transparent"} rounded-full border p-1.5`}
      >
        <IoMdSunny className="text-light h-4 w-4 shrink-0" />
      </button>
      <button
        tabIndex={tabIndex}
        onClick={() => setTheme("dark")}
        className={` ${theme === "dark" ? "border-neutral-250 dark:border-neutral-650" : "border-transparent"} rounded-full border p-1.5`}
      >
        <IoMdMoon className="text-light h-4 w-4 shrink-0" />
      </button>
    </div>
  );
}
