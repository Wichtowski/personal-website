import { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const itemVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 85 } },
};

export function slideDirectionVariants(): Variants {
  return {
    hidden: {
      opacity: 1,
      scale: 1,
      x: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.5, type: "spring", stiffness: 60 },
    },
  };
}
