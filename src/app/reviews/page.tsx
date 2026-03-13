import { PageHero } from "~/components/page-hero";
import { ReviewsExperience } from "~/components/reviews-experience";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function ReviewsPage() {
  const session = await auth();
  void api.catalog.snapshot.prefetch();
  const { reviews } = await api.catalog.snapshot();
  const averageRating =
    reviews.reduce((total, review) => total + review.rating, 0) /
    reviews.length;

  return (
    <HydrateClient>
      <main className="px-6 pt-6 pb-20 md:pt-10 md:pb-24">
        <div className="mx-auto grid w-full max-w-6xl gap-8">
          <PageHero
            eyebrow="Reviews"
            title="Short tasting notes that actually help someone choose a beer."
            description="Browse recent reviews or add your own notes for beers you have tried."
            stats={[
              { label: "Average", value: `${averageRating.toFixed(1)}/5` },
              { label: "Published", value: String(reviews.length) },
            ]}
          />
          <ReviewsExperience
            defaultAuthorName={session?.user?.name}
            signedIn={Boolean(session?.user)}
          />
        </div>
      </main>
    </HydrateClient>
  );
}
