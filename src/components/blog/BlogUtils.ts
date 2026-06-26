import { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 85 } },
};

export const slideDirectionVariants: (slideOffset: number) => Variants = (slideOffset) => ({
  hidden: {
    opacity: 0,
    scale: 0.95,
    x: slideOffset,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.5, type: "spring", stiffness: 60 },
  },
});
