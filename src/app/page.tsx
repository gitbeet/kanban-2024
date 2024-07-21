"use client";

import { motion } from "framer-motion";
import Board from "~/components/board";
import Sidebar from "~/components/sidebar";

export default function HomePage() {
  return (
    <motion.main className="flex grow overflow-hidden">
      <Sidebar />
      <Board />
    </motion.main>
  );
}
