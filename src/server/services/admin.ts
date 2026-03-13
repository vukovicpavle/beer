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
  const [breweries, featuredBeers, metrics, reviews, routes, users] =
    await Promise.all([
      db.brewery.findMany({ orderBy: { name: "asc" } }),
      db.beer.findMany({
        include: { brewery: true },
        orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
        take: 8,
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
        take: 10,
      }),
      db.route.findMany({
        include: {
          stops: { include: { brewery: true }, orderBy: { position: "asc" } },
        },
        orderBy: { updatedAt: "desc" },
        take: 6,
      }),
      db.user.findMany({
        orderBy: [{ role: "desc" }, { name: "asc" }],
        take: 10,
        include: {
          _count: {
            select: {
              reviews: true,
              savedRoutes: true,
            },
          },
        },
      }),
    ]);

  return {
    breweries: breweries.map((brewery) => ({
      id: brewery.id,
      name: brewery.name,
      slug: brewery.slug,
    })),
    featuredBeers: featuredBeers.map((beer) => ({
      breweryName: beer.brewery.name,
      featured: beer.featured,
      id: beer.id,
      name: beer.name,
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
      id: review.id,
      published: review.published,
      rating: review.rating,
      title: review.title,
      userName: review.user?.name ?? null,
    })),
    routes: routes.map((route) => ({
      city: route.city,
      id: route.id,
      name: route.name,
      stopCount: route.stops.length,
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
