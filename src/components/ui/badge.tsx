import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-paper-strong)] text-[var(--color-malt-dark)]",
        muted: "border border-black/10 bg-white/75 text-black/58",
        inverse: "border border-white/10 bg-white/10 text-white/76",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ className, variant }))} {...props} />
  );
}

export { Badge, badgeVariants };
