import Link from "next/link";
import { format } from "date-fns";

import { journalPosts } from "~/data/journal";

export default function JournalPage() {
  return (
    <main className="px-6 pt-6 pb-20 md:pt-10 md:pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.22em] text-[var(--color-hop)] uppercase">
            Journal
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-[var(--color-cellar)]">
            Editorial depth for discovery, planning, and repeat visits.
          </h1>
          <p className="mt-5 text-lg leading-8 text-black/68">
            The journal turns product utility into long-term habit: city guides,
            review craft, and better beer decision-making.
          </p>
        </div>

        <div className="grid gap-4">
          {journalPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="grid gap-4 rounded-[1.75rem] border border-black/10 bg-white/65 p-6 transition hover:bg-white md:grid-cols-[0.35fr_1fr] md:items-center"
            >
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-malt)] uppercase">
                  {post.category}
                </p>
                <p className="mt-3 text-sm text-black/50">
                  {format(new Date(post.publishedAt), "MMM d, yyyy")} •{" "}
                  {post.readTime}
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-[var(--color-cellar)]">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-black/68">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
