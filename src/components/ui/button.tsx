import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,box-shadow,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-gold text-navy shadow-[0_0_0_1px_rgb(201_168_76_/_40%)] hover:bg-gold-2",
        secondary:
          "bg-navy-3 text-ice shadow-[0_0_0_1px_rgb(232_238_244_/_10%)] hover:bg-steel",
        ghost: "bg-transparent text-ice-2 hover:bg-navy-3 hover:text-ice",
        outline:
          "bg-transparent text-gold shadow-[0_0_0_1px_rgb(201_168_76_/_35%)] hover:bg-navy-3",
        moss: "bg-moss text-navy hover:bg-moss-2",
        danger: "bg-danger/90 text-ice hover:bg-danger",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-4",
        lg: "h-12 px-5 text-[0.9375rem]",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
