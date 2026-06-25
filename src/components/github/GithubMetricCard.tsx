import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface GithubMetricCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
  hoverClassName: string;
  variants: Variants;
}

export function GithubMetricCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  hoverClassName,
  variants,
}: GithubMetricCardProps) {
  return (
    <motion.div
      variants={variants}
      className={`p-5 rounded-2xl border border-border/40 bg-muted/10 backdrop-blur-sm flex items-center gap-4 transition-colors ${hoverClassName}`}
    >
      <div className={`p-3 rounded-xl border ${iconClassName}`}>
        <Icon size={20} />
      </div>

      <div>
        <span className="text-xs text-muted-foreground block">{label}</span>
        <span className="text-2xl font-bold font-mono text-foreground">{value}</span>
      </div>
    </motion.div>
  );
}
