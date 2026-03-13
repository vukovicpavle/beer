import {
  beers as fallbackBeers,
  breweries as fallbackBreweries,
  reviews as fallbackReviews,
  routes as fallbackRoutes,
  routeVibes,
  type BeerSummary,
  type BrewerySummary,
  type ReviewSummary,
  type RouteSummary,
  type RouteVibe,
} from "~/data/catalog";
import { db } from "~/server/db";

export type CatalogSnapshot = {
  breweries: BrewerySummary[];
  beers: BeerSummary[];
  reviews: ReviewSummary[];
  routes: RouteSummary[];
};

const fallbackSnapshot: CatalogSnapshot = {
  breweries: fallbackBreweries,
  beers: fallbackBeers,
  reviews: fallbackReviews,
  routes: fallbackRoutes,
};

export async function getCatalogSnapshot(): Promise<CatalogSnapshot> {
  try {
    const [breweries, beers, reviews, routes] = await Promise.all([
      db.brewery.findMany({ orderBy: { name: "asc" } }),
      db.beer.findMany({
        include: { brewery: true },
        orderBy: [{ featured: "desc" }, { name: "asc" }],
      }),
      db.review.findMany({
        include: { beer: true },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
      db.route.findMany({
        include: {
          stops: { include: { brewery: true }, orderBy: { position: "asc" } },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    return {
      breweries: breweries.map((brewery) => ({
        slug: brewery.slug,
        name: brewery.name,
        city: brewery.city,
        country: brewery.country,
        latitude: brewery.latitude,
        longitude: brewery.longitude,
        description: brewery.description,
        specialty: brewery.specialty,
        heroBeer: brewery.heroBeer ?? undefined,
        website: brewery.website ?? undefined,
        tags: brewery.tags,
      })),
      beers: beers.map((beer) => ({
        slug: beer.slug,
        name: beer.name,
        style: beer.style,
        abv: beer.abv,
        ibu: beer.ibu ?? undefined,
        description: beer.description,
        featured: beer.featured,
        brewerySlug: beer.brewery.slug,
      })),
      reviews: reviews.map((review) => ({
        id: review.id,
        beerSlug: review.beer.slug,
        authorName: review.authorName,
        rating: review.rating,
        title: review.title,
        body: review.body,
        visitedAt: review.visitedAt?.toISOString(),
      })),
      routes: routes.map((route) => ({
        slug: route.slug,
        name: route.name,
        city: route.city,
        vibe: routeVibes.includes(route.vibe as RouteVibe)
          ? (route.vibe as RouteVibe)
          : "sessionable",
        summary: route.summary,
        durationMinutes: route.durationMinutes,
        distanceKm: route.distanceKm,
        stopSlugs: route.stops.map((stop) => stop.brewery.slug),
        highlights: route.stops.flatMap((stop) =>
          stop.recommendedPour ? [stop.recommendedPour] : [],
        ),
      })),
    };
  } catch {
    return fallbackSnapshot;
  }
}

export async function getPlannedRoutes(input?: {
  city?: string;
  vibe?: RouteVibe;
  maxStops?: number;
}) {
  const snapshot = await getCatalogSnapshot();
  const maxStops = input?.maxStops ?? 4;

  return snapshot.routes
    .filter((route) => !input?.city || route.city === input.city)
    .filter((route) => !input?.vibe || route.vibe === input.vibe)
    .filter((route) => route.stopSlugs.length <= maxStops)
    .sort((left, right) => left.durationMinutes - right.durationMinutes);
}
