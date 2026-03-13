import * as React from "react";

import { cn } from "~/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-black/10 bg-white/88 px-4 py-3 text-sm text-[var(--color-cellar)] transition outline-none placeholder:text-black/35 focus-visible:ring-2 focus-visible:ring-[var(--color-hop)]",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
