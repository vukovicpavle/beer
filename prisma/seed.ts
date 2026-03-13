import { PrismaClient } from "../generated/prisma";
import { beers, breweries, reviews, routes } from "../src/data/catalog";

const prisma = new PrismaClient();

async function main() {
  await prisma.routeStop.deleteMany();
  await prisma.review.deleteMany();
  await prisma.beer.deleteMany();
  await prisma.route.deleteMany();
  await prisma.brewery.deleteMany();

  const breweryIdBySlug = new Map<string, string>();

  for (const brewery of breweries) {
    const created = await prisma.brewery.create({
      data: brewery,
    });

    breweryIdBySlug.set(brewery.slug, created.id);
  }

  const beerIdBySlug = new Map<string, string>();

  for (const beer of beers) {
    const breweryId = breweryIdBySlug.get(beer.brewerySlug);
    if (!breweryId) continue;

    const created = await prisma.beer.create({
      data: {
        slug: beer.slug,
        name: beer.name,
        style: beer.style,
        abv: beer.abv,
        ibu: beer.ibu,
        description: beer.description,
        featured: beer.featured,
        breweryId,
      },
    });

    beerIdBySlug.set(beer.slug, created.id);
  }

  for (const review of reviews) {
    const beerId = beerIdBySlug.get(review.beerSlug);
    if (!beerId) continue;

    await prisma.review.create({
      data: {
        beerId,
        authorName: review.authorName,
        rating: review.rating,
        title: review.title,
        body: review.body,
        visitedAt: review.visitedAt ? new Date(review.visitedAt) : undefined,
      },
    });
  }

  for (const route of routes) {
    const created = await prisma.route.create({
      data: {
        slug: route.slug,
        name: route.name,
        city: route.city,
        vibe: route.vibe,
        summary: route.summary,
        durationMinutes: route.durationMinutes,
        distanceKm: route.distanceKm,
      },
    });

    for (const [position, stopSlug] of route.stopSlugs.entries()) {
      const breweryId = breweryIdBySlug.get(stopSlug);
      if (!breweryId) continue;

      await prisma.routeStop.create({
        data: {
          routeId: created.id,
          breweryId,
          position,
          recommendedPour: route.highlights[position],
        },
      });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
