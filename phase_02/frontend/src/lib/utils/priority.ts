/**
 * Priority utility functions
 * Provides color, icon, and label mappings for task priorities
 */

import {
  Minus,
  LucideIcon,
  ChevronUp,
  ChevronsDown,
  ChevronDown,
} from "lucide-react";

export type PriorityLevel = "low" | "medium" | "high";

export function getPriorityColor(priority?: string): string {
  switch (priority?.toLowerCase()) {
    case "high":
      return "#B49BC4"; // Soft Purple
    case "medium":
      return "#F4A460"; // Peach/Coral
    case "low":
      return "#F4C542"; // Yellow
    default:
      return "#F4A460"; // Default to medium (Peach/Coral)
  }
}

export function getPriorityLabel(priority?: string): string {
  switch (priority?.toLowerCase()) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return "Medium";
  }
}

export function getPriorityIcon(priority?: string): LucideIcon {
  switch (priority?.toLowerCase()) {
    case "high":
      return ChevronUp;
    case "medium":
      return ChevronDown;
    case "low":
      return ChevronsDown;
    default:
      return Minus;
  }
}

export function getPriorityOrder(priority?: string): number {
  switch (priority?.toLowerCase()) {
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 2;
  }
}

export const PRIORITY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
