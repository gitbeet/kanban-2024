"use client";

import Board from "~/components/board";
import Sidebar from "~/components/sidebar";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <motion.main className="flex overflow-hidden border">
      <Sidebar />
      <Board />
    </motion.main>
  );
}
