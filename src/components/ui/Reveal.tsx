"use client";

import { motion } from "motion/react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "li";
};

export function Reveal({ children, delay = 0, className, as = "div" }: Props) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.25, delay, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </Tag>
  );
}
