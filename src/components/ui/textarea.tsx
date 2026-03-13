import * as React from "react";

import { cn } from "~/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-28 w-full rounded-[1.5rem] border border-black/10 bg-white/88 px-4 py-3 text-sm text-[var(--color-cellar)] transition outline-none placeholder:text-black/35 focus-visible:ring-2 focus-visible:ring-[var(--color-hop)]",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
