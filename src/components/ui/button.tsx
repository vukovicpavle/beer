import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hop)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      size: {
        default: "px-5 py-3",
        sm: "px-4 py-2.5 text-xs",
        lg: "px-6 py-3.5",
        icon: "h-10 w-10 rounded-full",
      },
      variant: {
        default:
          "bg-[var(--color-cellar)] text-[var(--color-foam)] hover:bg-black",
        ghost: "bg-transparent text-[var(--color-cellar)] hover:bg-black/5",
        outline:
          "border border-black/10 bg-white/75 text-[var(--color-cellar)] hover:bg-white",
        secondary:
          "bg-[var(--color-paper-strong)] text-[var(--color-malt-dark)] hover:bg-[var(--color-paper)]",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, size, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ className, size, variant }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
