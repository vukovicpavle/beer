import * as React from "react";

import { cn } from "~/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-12 w-full rounded-2xl border border-black/10 bg-white/88 px-4 py-3 text-sm text-[var(--color-cellar)] transition outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hop)]",
      className,
    )}
    {...props}
  />
));
Select.displayName = "Select";

export { Select };
