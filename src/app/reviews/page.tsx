import { ReviewsStudio } from "~/components/reviews-studio";
import { auth } from "~/server/auth";
import { getCatalogSnapshot } from "~/server/services/catalog";

export default async function ReviewsPage() {
  const session = await auth();
  const { beers, breweries, reviews } = await getCatalogSnapshot();
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

        <ReviewsStudio
          beers={beers}
          breweries={breweries}
          canWrite={Boolean(session?.user)}
          defaultAuthorName={session?.user?.name}
          reviews={reviews}
        />
      </div>
    </main>
  );
}
