"use client";

import { motion } from "framer-motion";

type MotionSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function MotionSection({ children, className, delay = 0 }: MotionSectionProps) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </motion.section>
  );
}

export function MotionDiv({ children, className, delay = 0 }: MotionSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
