import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type Props = HTMLMotionProps<"div"> & {
    delay?: number;
};

export function AnimatedCard({ children, className, delay = 0, ...props }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay, ease: "easeOut" }}
            className={twMerge(clsx("glass-panel rounded-xl", className))}
            {...props}
        >
            {children}
        </motion.div>
    );
}
