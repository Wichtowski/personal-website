import {
  CheckCircle2,
  CircleDot,
  PauseCircle,
  CalendarRange,
  Wrench,
  Archive,
  Activity,
  AlertOctagon,
  type LucideIcon,
} from "lucide-react";

export interface StatusConfig {
  label: string;
  icon: LucideIcon;
  className: string;
}

// Normalized project status configuration helper
export function getStatusConfig(status?: string, language?: string): StatusConfig | null {
  if (!status) return null;
  const s = status.toLowerCase().replace(/[\s_-]+/g, "");

  if (s === "completed" || s === "compleated" || s === "ukończony" || s === "ukonczony") {
    return {
      label: language === "pl" ? "Ukończony" : "Completed",
      icon: CheckCircle2,
      className: "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10",
    };
  }
  if (s === "inprogress" || s === "wtoku" || s === "wtrakcie" || s === "tok" || s === "wparku") {
    return {
      label: language === "pl" ? "W toku" : "In Progress",
      icon: CircleDot,
      className: "border-sky-500/30 text-sky-700 dark:text-sky-400 bg-sky-500/10",
    };
  }
  if (s === "onhold" || s === "wstrzymany") {
    return {
      label: language === "pl" ? "Wstrzymany" : "On Hold",
      icon: PauseCircle,
      className: "border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-500/10",
    };
  }
  if (s === "planned" || s === "planowany" || s === "plany") {
    return {
      label: language === "pl" ? "Planowany" : "Planned",
      icon: CalendarRange,
      className: "border-indigo-500/30 text-indigo-700 dark:text-indigo-400 bg-indigo-500/10",
    };
  }
  if (s === "maintained" || s === "utrzymywany" || s === "maintenance") {
    return {
      label: language === "pl" ? "Utrzymywany" : "Maintained",
      icon: Wrench,
      className: "border-teal-500/30 text-teal-700 dark:text-teal-400 bg-teal-500/10",
    };
  }
  if (s === "archived" || s === "zarchiwizowany" || s === "archiwum") {
    return {
      label: language === "pl" ? "Zarchiwizowany" : "Archived",
      icon: Archive,
      className: "border-zinc-500/30 text-zinc-700 dark:text-zinc-400 bg-zinc-500/10",
    };
  }
  if (s === "active" || s === "aktywny") {
    return {
      label: language === "pl" ? "Aktywny" : "Active",
      icon: Activity,
      className: "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10",
    };
  }
  if (s === "deprecated" || s === "wycofany") {
    return {
      label: language === "pl" ? "Wycofany" : "Deprecated",
      icon: AlertOctagon,
      className: "border-rose-500/30 text-rose-700 dark:text-rose-400 bg-rose-500/10",
    };
  }

  // Fallback for custom statuses
  return {
    label: status,
    icon: CircleDot,
    className: "border-muted-foreground/30 text-muted-foreground bg-muted-foreground/10",
  };
}
