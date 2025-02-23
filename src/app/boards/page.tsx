"use client";

import Board from "~/components/board";
import Sidebar from "~/components/sidebar";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <>
      <motion.main className="flex grow overflow-hidden">
        <Sidebar />
        <Board />
      </motion.main>
    </>
  );
};

export default Page;
