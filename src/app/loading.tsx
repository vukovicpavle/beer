import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="px-6 pt-6 pb-20 md:pt-10 md:pb-24">
      <div className="mx-auto grid w-full max-w-6xl gap-6">
        <div className="rounded-[2rem] border border-black/10 bg-[var(--panel)] p-8">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="mt-5 h-14 w-full max-w-3xl" />
          <Skeleton className="mt-4 h-6 w-full max-w-2xl" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-40 rounded-[1.75rem]" />
          <Skeleton className="h-40 rounded-[1.75rem]" />
          <Skeleton className="h-40 rounded-[1.75rem]" />
        </div>
        <Skeleton className="h-[28rem] rounded-[1.75rem]" />
      </div>
    </main>
  );
}
