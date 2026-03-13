import { env } from "~/env";
import { db } from "~/server/db";

const adminEmails = new Set(
  env.ADMIN_EMAILS?.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean) ?? [],
);

export function isAdminEmail(email?: string | null) {
  return Boolean(email && adminEmails.has(email.toLowerCase()));
}

export function isAdminUser(
  user?: {
    email?: string | null;
    role?: string | null;
  } | null,
) {
  return Boolean(user && (user.role === "ADMIN" || isAdminEmail(user.email)));
}

export async function getAdminSnapshot() {
  const [breweries, beers, metrics, reviews, routes, users] = await Promise.all(
    [
      db.brewery.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              beers: true,
              routeStops: true,
            },
          },
        },
      }),
      db.beer.findMany({
        include: { brewery: true },
        orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
      }),
      Promise.all([
        db.user.count(),
        db.brewery.count(),
        db.beer.count(),
        db.review.count({ where: { published: true } }),
        db.review.count({ where: { published: false } }),
        db.route.count(),
        db.savedRoute.count(),
      ]),
      db.review.findMany({
        include: { beer: { include: { brewery: true } }, user: true },
        orderBy: { createdAt: "desc" },
      }),
      db.route.findMany({
        include: {
          stops: { include: { brewery: true }, orderBy: { position: "asc" } },
        },
        orderBy: { updatedAt: "desc" },
      }),
      db.user.findMany({
        orderBy: [{ role: "desc" }, { name: "asc" }],
        include: {
          _count: {
            select: {
              reviews: true,
              savedRoutes: true,
            },
          },
        },
      }),
    ],
  );

  return {
    breweries: breweries.map((brewery) => ({
      beerCount: brewery._count.beers,
      city: brewery.city,
      country: brewery.country,
      description: brewery.description,
      heroBeer: brewery.heroBeer,
      id: brewery.id,
      latitude: brewery.latitude,
      longitude: brewery.longitude,
      name: brewery.name,
      slug: brewery.slug,
      specialty: brewery.specialty,
      stopCount: brewery._count.routeStops,
      tags: brewery.tags,
      website: brewery.website,
    })),
    beers: beers.map((beer) => ({
      abv: beer.abv,
      breweryName: beer.brewery.name,
      brewerySlug: beer.brewery.slug,
      description: beer.description,
      featured: beer.featured,
      id: beer.id,
      ibu: beer.ibu,
      name: beer.name,
      slug: beer.slug,
      style: beer.style,
    })),
    metrics: {
      beers: metrics[2],
      breweries: metrics[1],
      hiddenReviews: metrics[4],
      members: metrics[0],
      publishedReviews: metrics[3],
      routes: metrics[5],
      savedRoutes: metrics[6],
    },
    reviews: reviews.map((review) => ({
      authorName: review.authorName,
      beerName: review.beer.name,
      breweryName: review.beer.brewery.name,
      createdAt: review.createdAt.toISOString(),
      visitedAt: review.visitedAt?.toISOString() ?? null,
      id: review.id,
      body: review.body,
      beerSlug: review.beer.slug,
      published: review.published,
      rating: review.rating,
      title: review.title,
      userName: review.user?.name ?? null,
    })),
    routes: routes.map((route) => ({
      city: route.city,
      distanceKm: route.distanceKm,
      durationMinutes: route.durationMinutes,
      highlights: route.stops.flatMap((stop) =>
        stop.recommendedPour ? [stop.recommendedPour] : [],
      ),
      id: route.id,
      name: route.name,
      slug: route.slug,
      stopCount: route.stops.length,
      stopSlugs: route.stops.map((stop) => stop.brewery.slug),
      summary: route.summary,
      vibe: route.vibe,
    })),
    users: users.map((user) => ({
      city: user.city,
      email: user.email,
      id: user.id,
      name: user.name,
      reviewCount: user._count.reviews,
      role: user.role,
      savedRouteCount: user._count.savedRoutes,
    })),
  };
}
