import { getCatalogSnapshot } from "~/server/services/catalog";

export default async function ReviewsPage() {
  const { beers, reviews } = await getCatalogSnapshot();
  const averageRating =
    reviews.reduce((total, review) => total + review.rating, 0) /
    reviews.length;

  return (
    <main className="px-6 pt-6 pb-20 md:pt-10 md:pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 grid gap-5 rounded-[2rem] border border-black/10 bg-[var(--panel)] p-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-[var(--color-hop)] uppercase">
              Reviews
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-[var(--color-cellar)]">
              Short tasting notes that actually help someone choose a beer.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-black/68">
              Each review favors clarity over spectacle: style fit, balance,
              finish, and whether the pour is worth planning around.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[var(--color-cellar)] px-6 py-5 text-[var(--color-foam)]">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
              Average score
            </p>
            <p className="mt-2 text-4xl font-semibold">
              {averageRating.toFixed(1)}/5
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => {
            const beer = beers.find((entry) => entry.slug === review.beerSlug);

            return (
              <article
                key={review.id}
                className="rounded-[1.75rem] border border-black/10 bg-white/65 p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-malt)] uppercase">
                      {beer?.style ?? "Featured pour"}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[var(--color-cellar)]">
                      {review.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-[var(--color-paper-strong)] px-3 py-1 text-sm font-semibold text-[var(--color-malt-dark)]">
                    {review.rating}/5
                  </span>
                </div>
                <p className="mt-4 text-sm font-medium text-black/50">
                  {beer?.name ?? review.beerSlug}
                </p>
                <p className="mt-4 text-sm leading-7 text-black/70">
                  {review.body}
                </p>
                <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                  {review.authorName}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
