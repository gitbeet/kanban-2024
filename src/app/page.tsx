"use client";

import Board from "~/components/board";
import Sidebar from "~/components/sidebar";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    // <main className="grid grid-cols-[1fr,100%] overflow-hidden border">
    <motion.main layout className="flex overflow-hidden border">
      <Sidebar />
      <Board />
    </motion.main>
  );
}
