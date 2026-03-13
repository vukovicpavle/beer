import { PageHero } from "~/components/page-hero";
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
      <div className="mx-auto grid w-full max-w-6xl gap-8">
        <PageHero
          eyebrow="Reviews"
          title="Short tasting notes that actually help someone choose a beer."
          description="The review surface now separates composition from browsing so you can write cleanly and scan cleanly instead of doing both in one crowded panel."
          stats={[
            { label: "Average", value: `${averageRating.toFixed(1)}/5` },
            { label: "Published", value: String(reviews.length) },
          ]}
        />
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
