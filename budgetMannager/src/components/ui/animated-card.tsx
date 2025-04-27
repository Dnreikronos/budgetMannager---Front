import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedCard = ({ children, className, delay = 0, ...props }: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard; 