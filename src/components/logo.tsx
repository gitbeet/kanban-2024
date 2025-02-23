import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <h1 className={`text-dark text-center text-2xl font-extrabold`}>
        taskly
      </h1>
    </Link>
  );
};

export default Logo;
