import { db } from "~/server/db";

type MemberRoute = {
  city: string;
  durationMinutes: number;
  highlightCount: number;
  id: string;
  name: string;
  note?: string;
  savedAt: string;
  slug: string;
  stopCount: number;
  vibe: string;
};

type MemberReview = {
  beerName: string;
  beerSlug: string;
  breweryName: string;
  createdAt: string;
  id: string;
  rating: number;
  title: string;
};

export type MemberSnapshot = {
  averageRating?: number;
  authoredReviews: MemberReview[];
  city?: string | null;
  cityCount: number;
  name?: string | null;
  nextRoute?: {
    city: string;
    name: string;
    slug: string;
    vibe: string;
  };
  routeCount: number;
  savedRoutes: MemberRoute[];
  styleCount: number;
};

export async function getMemberSnapshot(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        reviews: {
          include: { beer: { include: { brewery: true } } },
          orderBy: { createdAt: "desc" },
          take: 6,
        },
        savedRoutes: {
          include: {
            route: {
              include: {
                stops: {
                  include: { brewery: true },
                  orderBy: { position: "asc" },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 6,
        },
      },
    });

    if (!user) {
      return null;
    }

    const savedRouteCities = new Set(
      user.savedRoutes.map((entry) => entry.route.city),
    );
    const reviewedCities = new Set(
      user.reviews.map((review) => review.beer.brewery.city),
    );
    const tastedStyles = new Set(
      user.reviews.map((review) => review.beer.style),
    );
    const averageRating = user.reviews.length
      ? Number(
          (
            user.reviews.reduce((sum, review) => sum + review.rating, 0) /
            user.reviews.length
          ).toFixed(1),
        )
      : undefined;
    const savedRouteIds = user.savedRoutes.map((entry) => entry.route.id);
    const recommendedRoute = await db.route.findFirst({
      where: {
        city: user.city ?? undefined,
        ...(savedRouteIds.length
          ? {
              id: {
                notIn: savedRouteIds,
              },
            }
          : {}),
      },
      orderBy: [{ durationMinutes: "asc" }, { updatedAt: "desc" }],
    });

    return {
      averageRating,
      authoredReviews: user.reviews.map((review) => ({
        beerName: review.beer.name,
        beerSlug: review.beer.slug,
        breweryName: review.beer.brewery.name,
        createdAt: review.createdAt.toISOString(),
        id: review.id,
        rating: review.rating,
        title: review.title,
      })),
      city: user.city,
      cityCount: new Set([...savedRouteCities, ...reviewedCities]).size,
      name: user.name,
      nextRoute: recommendedRoute
        ? {
            city: recommendedRoute.city,
            name: recommendedRoute.name,
            slug: recommendedRoute.slug,
            vibe: recommendedRoute.vibe,
          }
        : undefined,
      routeCount: user.savedRoutes.length,
      savedRoutes: user.savedRoutes.map((entry) => ({
        city: entry.route.city,
        durationMinutes: entry.route.durationMinutes,
        highlightCount: entry.route.stops.filter((stop) => stop.recommendedPour)
          .length,
        id: entry.id,
        name: entry.route.name,
        note: entry.note ?? undefined,
        savedAt: entry.createdAt.toISOString(),
        slug: entry.route.slug,
        stopCount: entry.route.stops.length,
        vibe: entry.route.vibe,
      })),
      styleCount: tastedStyles.size,
    } satisfies MemberSnapshot;
  } catch {
    return null;
  }
}
