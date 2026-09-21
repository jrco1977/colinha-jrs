import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function initials(name: string) {
  const parts = name
    .replace(/\./g, " ")
    .split(/\s+/)
    .filter((p) => p.length > 1 && !/^(da|de|do|dos|das|e)$/i.test(p));
  const first = parts[0]?.[0] ?? name[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1]![0] : (parts[0]?.[1] ?? "");
  return (first + last).toUpperCase();
}
