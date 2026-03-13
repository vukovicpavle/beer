"use client";

import { useFormStatus } from "react-dom";

type PendingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingLabel?: string;
};

export function PendingButton({
  children,
  disabled,
  pendingLabel = "Working...",
  ...props
}: PendingButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button {...props} disabled={pending || disabled}>
      {pending ? pendingLabel : children}
    </button>
  );
}
