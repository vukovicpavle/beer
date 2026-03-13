import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Compass,
  MapPinned,
  NotebookText,
  Star,
} from "lucide-react";

import { journalPosts } from "~/data/journal";
import { getCatalogSnapshot } from "~/server/services/catalog";

const featureCards = [
  {
    href: "/map",
    title: "Beer map",
    description:
      "Browse standout breweries with location context, hero pours, and quick scouting notes.",
    icon: MapPinned,
  },
  {
    href: "/reviews",
    title: "Trusted reviews",
    description:
      "Keep tasting notes sharp with concise, useful review cards instead of noisy rating clutter.",
    icon: Star,
  },
  {
    href: "/routes",
    title: "Route planner",
    description:
      "Build tasting runs by vibe, city, and stop-count for walkable sessions or deep cellar hunts.",
    icon: Compass,
  },
  {
    href: "/club",
    title: "Member club",
    description:
      "Use a guest pass or OAuth later to save routes, keep authored reviews, and turn visits into a repeatable profile.",
    icon: BadgeCheck,
  },
  {
    href: "/journal",
    title: "Editorial journal",
    description:
      "Mix discovery guides, style explainers, and travel-ready beer itineraries in one publishing layer.",
    icon: NotebookText,
  },
] as const;

export default async function Home() {
  const { beers, breweries, reviews, routes } = await getCatalogSnapshot();
  const featuredBeers = beers.filter((beer) => beer.featured).slice(0, 3);

  return (
    <main>
      <section className="px-6 pt-8 pb-14 md:pt-12 md:pb-20">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-black/10 bg-[var(--panel)] p-8 shadow-[0_18px_80px_rgba(61,31,10,0.10)] backdrop-blur md:p-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-malt)]/20 bg-white/40 px-4 py-2 text-sm font-medium text-[var(--color-malt-dark)]">
              Built on the T3 stack, shaped for beer discovery
            </div>
            <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-none text-[var(--color-cellar)] md:text-7xl">
              A serious beer app for planning better pours.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70 md:text-xl">
              Hop Atlas combines a discovery map, concise tasting reviews,
              editorial storytelling, and a route planner so beer lovers can
              move from inspiration to an actual night out.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-cellar)] px-6 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
              >
                Explore the map
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/routes"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/50 px-6 py-3 text-sm font-semibold text-[var(--color-cellar)] transition hover:bg-white"
              >
                Build a tasting route
              </Link>
            </div>
            <dl className="mt-10 grid gap-4 border-t border-black/10 pt-8 sm:grid-cols-3">
              <div>
                <dt className="text-sm tracking-[0.18em] text-black/45 uppercase">
                  Featured beers
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-[var(--color-cellar)]">
                  {beers.length}
                </dd>
              </div>
              <div>
                <dt className="text-sm tracking-[0.18em] text-black/45 uppercase">
                  Map stops
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-[var(--color-cellar)]">
                  {breweries.length}
                </dd>
              </div>
              <div>
                <dt className="text-sm tracking-[0.18em] text-black/45 uppercase">
                  Curated routes
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-[var(--color-cellar)]">
                  {routes.length}
                </dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-4">
            {featuredBeers.map((beer, index) => (
              <article
                key={beer.slug}
                className="rounded-[1.75rem] border border-black/10 bg-[var(--panel-strong)] p-6 shadow-[0_16px_50px_rgba(63,44,17,0.08)]"
              >
                <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-malt)] uppercase">
                  Pour {index + 1}
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-cellar)]">
                  {beer.name}
                </h2>
                <p className="mt-2 text-sm font-medium text-black/55">
                  {beer.style} • {beer.abv.toFixed(1)}% ABV
                </p>
                <p className="mt-4 text-sm leading-7 text-black/70">
                  {beer.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14 md:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-[var(--color-hop)] uppercase">
                Product pillars
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-cellar)]">
                Four surfaces that make the app feel complete from day one.
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {featureCards.map(({ href, title, description, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-[1.75rem] border border-black/10 bg-white/50 p-6 transition hover:-translate-y-1 hover:bg-white/80"
              >
                <div className="inline-flex rounded-2xl bg-[var(--color-cellar)] p-3 text-[var(--color-foam)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-[var(--color-cellar)]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-black/65">
                  {description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-malt-dark)]">
                  Open feature
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14 md:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-black/10 bg-[var(--color-cellar)] p-8 text-[var(--color-foam)] md:p-10">
            <p className="text-sm font-semibold tracking-[0.24em] text-white/60 uppercase">
              Why this setup works
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight">
              Static-first UX, real backend foundations.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/78">
              The app ships with curated fallback content so the product feels
              alive immediately, while Prisma models, tRPC routers, auth, and a
              Postgres path are already in place for real member data.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.slice(0, 4).map((review) => (
              <article
                key={review.id}
                className="rounded-[1.5rem] border border-black/10 bg-white/65 p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[var(--color-cellar)]">
                    {review.title}
                  </h3>
                  <span className="rounded-full bg-[var(--color-paper-strong)] px-3 py-1 text-sm font-semibold text-[var(--color-malt-dark)]">
                    {review.rating}/5
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-black/70">
                  {review.body}
                </p>
                <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                  {review.authorName}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14 md:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-6 rounded-[2rem] border border-black/10 bg-white/60 p-8 md:grid-cols-[1fr_0.9fr] md:p-10">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-[var(--color-hop)] uppercase">
              Membership layer
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-cellar)]">
              Save route ideas, publish reviews, and keep a beer identity that
              travels with you.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-black/68">
              The Club flow now supports instant guest passes, so the live app
              has working auth even before you plug in a full OAuth provider.
            </p>
          </div>
          <div className="grid gap-4 md:justify-self-end">
            <Link
              href="/club"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-cellar)] px-6 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
            >
              Open Club
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="max-w-md text-sm leading-7 text-black/60">
              Guest membership is active now. Discord can be layered on top when
              you want a richer identity flow in production.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pt-8 pb-20 md:pb-24">
        <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-black/10 bg-white/55 p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-[var(--color-hop)] uppercase">
                Journal launch set
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-cellar)]">
                Editorial hooks for retention and SEO.
              </h2>
            </div>
            <Link
              href="/journal"
              className="text-sm font-semibold text-[var(--color-malt-dark)]"
            >
              View all stories
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {journalPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/journal/${post.slug}`}
                className="rounded-[1.5rem] border border-black/10 bg-[var(--panel)] p-6 transition hover:bg-white"
              >
                <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-malt)] uppercase">
                  {post.category}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-[var(--color-cellar)]">
                  {post.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-black/68">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
