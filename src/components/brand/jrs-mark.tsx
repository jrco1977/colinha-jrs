import { cn } from "@/lib/utils";

export function JrsMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="JRS Soluções"
    >
      <defs>
        <linearGradient id="jrs-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0c37a" />
          <stop offset="50%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#8d7328" />
        </linearGradient>
        <linearGradient id="jrs-moss" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f6b53" />
          <stop offset="100%" stopColor="#8fb392" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="#06101C" />
      <circle cx="32" cy="32" r="29.2" fill="none" stroke="url(#jrs-gold)" strokeWidth="1.6" />
      <circle cx="32" cy="32" r="25.4" fill="none" stroke="url(#jrs-moss)" strokeWidth="0.7" opacity="0.85" />
      <text
        x="32"
        y="38.5"
        textAnchor="middle"
        fill="url(#jrs-gold)"
        fontFamily="Times New Roman, serif"
        fontSize="17"
        letterSpacing="1.4"
      >
        JRS
      </text>
      <path
        d="M18 44.5h28"
        stroke="url(#jrs-gold)"
        strokeWidth="0.6"
        opacity="0.7"
      />
    </svg>
  );
}
