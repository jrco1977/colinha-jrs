import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md bg-navy-2 px-3.5 text-sm text-ice shadow-[0_0_0_1px_rgb(232_238_244_/_12%)] placeholder:text-mute transition-[box-shadow] duration-150 focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_rgb(201_168_76_/_55%)]",
        className,
      )}
      {...props}
    />
  );
}
