import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function AuthShell({
  children,
  description,
  eyebrow,
  helper,
  title,
}: {
  children: ReactNode;
  description: string;
  eyebrow: string;
  helper?: ReactNode;
  title: string;
}) {
  return (
    <main className="px-6 py-10 md:py-14">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <section className="rounded-[2rem] border border-black/10 bg-[var(--panel)] p-8 shadow-[0_18px_60px_rgba(61,31,10,0.08)]">
          <Badge variant="muted" className="w-fit text-[var(--color-hop)]">
            {eyebrow}
          </Badge>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--color-cellar)] md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-black/68">
            {description}
          </p>
          <div className="mt-8 grid gap-3 text-sm text-black/62">
            <div className="rounded-[1.25rem] bg-white/70 p-4">
              Email accounts are now isolated under auth routes, so the main app
              stays focused on discovery and member data.
            </div>
            <div className="rounded-[1.25rem] bg-white/70 p-4">
              Guest pass still exists for immediate access when you want to try
              the app without a permanent account.
            </div>
          </div>
          {helper ? <div className="mt-6">{helper}</div> : null}
          <div className="mt-6 text-sm text-black/58">
            <Link
              href="/"
              className="font-semibold text-[var(--color-malt-dark)]"
            >
              Back to Hop Atlas
            </Link>
          </div>
        </section>
        <Card className="bg-white/72">
          <CardHeader>
            <CardTitle className="text-3xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </main>
  );
}
