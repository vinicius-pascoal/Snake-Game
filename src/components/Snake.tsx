"use client";
import { motion } from "framer-motion";
import { Position } from "@/types";

export default function Snake({ segments }: { segments: Position[] }) {
  return (
    <>
      {segments.map((s, i) => (
        <motion.div
          key={i}
          className="absolute bg-green-500 w-5 h-5 rounded"
          animate={{ x: s.x * 20, y: s.y * 20 }}
          transition={{ type: "spring", stiffness: 100 }}
        />
      ))}
    </>
  );
}
