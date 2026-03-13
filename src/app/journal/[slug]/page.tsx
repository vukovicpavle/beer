import { format } from "date-fns";
import { notFound } from "next/navigation";

import { getJournalPost, journalPosts } from "~/data/journal";

export function generateStaticParams() {
  return journalPosts.map((post) => ({ slug: post.slug }));
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getJournalPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="px-6 pt-6 pb-20 md:pt-10 md:pb-24">
      <article className="mx-auto w-full max-w-4xl rounded-[2rem] border border-black/10 bg-[var(--panel)] p-8 md:p-12">
        <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-malt)] uppercase">
          {post.category}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-tight text-[var(--color-cellar)]">
          {post.title}
        </h1>
        <p className="mt-5 text-sm text-black/50">
          {format(new Date(post.publishedAt), "MMMM d, yyyy")} • {post.readTime}
        </p>
        <p className="mt-8 text-lg leading-8 text-black/72">{post.intro}</p>
        <div className="mt-10 grid gap-8">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold text-[var(--color-cellar)]">
                {section.heading}
              </h2>
              <p className="mt-3 text-base leading-8 text-black/72">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
