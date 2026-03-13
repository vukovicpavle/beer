"use client";

import { ReviewsStudio } from "~/components/reviews-studio";
import { api } from "~/trpc/react";

export function ReviewsExperience({
  defaultAuthorName,
  signedIn,
}: {
  defaultAuthorName?: string | null;
  signedIn: boolean;
}) {
  const { data } = api.catalog.snapshot.useQuery();

  if (!data) {
    return (
      <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 text-sm text-black/60">
        Loading reviews...
      </div>
    );
  }

  return (
    <ReviewsStudio
      beers={data.beers}
      breweries={data.breweries}
      canWrite={signedIn}
      defaultAuthorName={defaultAuthorName}
      reviews={data.reviews}
    />
  );
}
