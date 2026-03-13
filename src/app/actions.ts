"use server";

import { UserRole } from "../../generated/prisma";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { env } from "~/env";
import { hashPassword } from "~/server/auth/password";
import { auth, signIn, signOut } from "~/server/auth";
import { db } from "~/server/db";
import { isAdminEmail, isAdminUser } from "~/server/services/admin";

const memberAuthSchema = z.object({
  city: z
    .string()
    .trim()
    .max(40)
    .transform((value) => value || undefined),
  displayName: z.string().trim().min(2).max(60),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
});

const routeSaveSchema = z.object({
  note: z
    .string()
    .trim()
    .max(160)
    .transform((value) => value || undefined),
  routeSlug: z.string().trim().min(1),
});

const reviewCreateSchema = z.object({
  authorName: z
    .string()
    .trim()
    .max(60)
    .transform((value) => value || undefined),
  beerSlug: z.string().trim().min(1),
  body: z.string().trim().min(24).max(600),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(80),
  visitedAt: z
    .string()
    .trim()
    .transform((value) => value || undefined),
});

const breweryCreateSchema = z.object({
  city: z.string().trim().min(2).max(60),
  country: z.string().trim().min(2).max(60),
  description: z.string().trim().min(24).max(320),
  heroBeer: z
    .string()
    .trim()
    .max(80)
    .transform((value) => value || undefined),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(80),
  specialty: z.string().trim().min(2).max(80),
  tags: z.string().trim().min(2).max(160),
  website: z
    .string()
    .trim()
    .url()
    .or(z.literal(""))
    .transform((value) => value || undefined),
});

const beerCreateSchema = z.object({
  abv: z.coerce.number().min(0.1).max(20),
  brewerySlug: z.string().trim().min(1),
  description: z.string().trim().min(16).max(240),
  featured: z
    .string()
    .trim()
    .optional()
    .transform((value) => value === "on"),
  ibu: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? Number(value) : undefined))
    .pipe(z.number().int().min(0).max(150).optional()),
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(80),
  style: z.string().trim().min(2).max(60),
});

const routeCreateSchema = z.object({
  city: z.string().trim().min(2).max(60),
  distanceKm: z.coerce.number().min(0.5).max(60),
  durationMinutes: z.coerce.number().int().min(20).max(720),
  highlights: z
    .string()
    .trim()
    .transform((value) =>
      value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(80),
  stopSlugs: z
    .string()
    .trim()
    .transform((value) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string()).min(2).max(8)),
  summary: z.string().trim().min(24).max(240),
  vibe: z.string().trim().min(2).max(40),
});

const reviewModerationSchema = z.object({
  published: z.enum(["true", "false"]),
  reviewId: z.string().trim().min(1),
});

const beerFeatureSchema = z.object({
  beerId: z.string().trim().min(1),
  featured: z.enum(["true", "false"]),
});

const userRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
  userId: z.string().trim().min(1),
});

const breweryUpdateSchema = breweryCreateSchema.extend({
  breweryId: z.string().trim().min(1),
});

const beerUpdateSchema = beerCreateSchema.extend({
  beerId: z.string().trim().min(1),
});

const routeUpdateSchema = routeCreateSchema.extend({
  routeId: z.string().trim().min(1),
});

const reviewUpdateSchema = z.object({
  authorName: z.string().trim().min(2).max(60),
  body: z.string().trim().min(24).max(600),
  published: z.enum(["true", "false"]),
  rating: z.coerce.number().int().min(1).max(5),
  reviewId: z.string().trim().min(1),
  title: z.string().trim().min(3).max(80),
  visitedAt: z
    .string()
    .trim()
    .transform((value) => value || undefined),
});

const userUpdateSchema = z.object({
  city: z
    .string()
    .trim()
    .max(40)
    .transform((value) => value || undefined),
  name: z
    .string()
    .trim()
    .max(60)
    .transform((value) => value || undefined),
  role: z.nativeEnum(UserRole),
  userId: z.string().trim().min(1),
});

const deleteEntitySchema = z.object({
  id: z.string().trim().min(1),
});

function readFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

async function requireAdminSession() {
  const session = await auth();

  if (!session?.user || !isAdminUser(session.user)) {
    redirect("/club?error=admin-only");
  }

  return session;
}

function revalidateAdminSurfaces() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/club");
  revalidatePath("/map");
  revalidatePath("/reviews");
  revalidatePath("/routes");
}

async function assertAdminMutationAllowed(
  sessionUserId: string,
  targetUserId: string,
) {
  if (sessionUserId === targetUserId) {
    redirect("/admin?error=self-demote");
  }

  const target = await db.user.findUnique({
    where: { id: targetUserId },
    select: { role: true },
  });

  if (target?.role === UserRole.ADMIN) {
    const adminCount = await db.user.count({
      where: { role: UserRole.ADMIN },
    });

    if (adminCount <= 1) {
      redirect("/admin?error=last-admin");
    }
  }
}

export async function signUpWithEmailPassword(formData: FormData) {
  const parsed = memberAuthSchema.safeParse({
    city: formData.get("city"),
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/club?error=signup-invalid");
  }

  const existingUser = await db.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });

  if (existingUser) {
    redirect("/club?error=signup-taken");
  }

  const adminCount = await db.user.count({
    where: { role: UserRole.ADMIN },
  });
  const nextRole =
    adminCount === 0 || isAdminEmail(parsed.data.email)
      ? UserRole.ADMIN
      : UserRole.MEMBER;

  await db.user.create({
    data: {
      city: parsed.data.city,
      email: parsed.data.email,
      name: parsed.data.displayName,
      passwordHash: hashPassword(parsed.data.password),
      role: nextRole,
    },
  });

  try {
    await signIn("member-credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/club",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/club?error=signin-failed");
    }

    throw error;
  }
}

export async function signInWithEmailPassword(formData: FormData) {
  const email = readFormString(formData, "email").trim().toLowerCase();
  const password = readFormString(formData, "password").trim();

  if (!email || password.length < 8) {
    redirect("/club?error=signin-invalid");
  }

  try {
    await signIn("member-credentials", {
      email,
      password,
      redirectTo: "/club",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/club?error=signin-failed");
    }

    throw error;
  }
}

export async function signInWithGuestPass(formData: FormData) {
  const displayName = readFormString(formData, "displayName").trim();
  const city = readFormString(formData, "city").trim();

  if (displayName.length < 2) {
    redirect("/club?error=guest-pass");
  }

  await signIn("guest-pass", {
    city,
    displayName,
    redirectTo: "/club",
  });
}

export async function signInWithDiscord() {
  if (!env.AUTH_DISCORD_ID || !env.AUTH_DISCORD_SECRET) {
    redirect("/club?error=discord-unavailable");
  }

  await signIn("discord", { redirectTo: "/club" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function saveRouteAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/club");
  }

  const parsed = routeSaveSchema.safeParse({
    note: formData.get("note"),
    routeSlug: formData.get("routeSlug"),
  });

  if (!parsed.success) {
    redirect("/routes?error=save-route");
  }

  const route = await db.route.findUnique({
    where: { slug: parsed.data.routeSlug },
    select: { id: true },
  });

  if (!route) {
    redirect("/routes?error=missing-route");
  }

  await db.savedRoute.upsert({
    where: {
      userId_routeId: {
        routeId: route.id,
        userId: session.user.id,
      },
    },
    update: { note: parsed.data.note },
    create: {
      note: parsed.data.note,
      routeId: route.id,
      userId: session.user.id,
    },
  });

  revalidatePath("/club");
  revalidatePath("/routes");
}

export async function createReviewAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/club");
  }

  const parsed = reviewCreateSchema.safeParse({
    authorName: formData.get("authorName"),
    beerSlug: formData.get("beerSlug"),
    body: formData.get("body"),
    rating: formData.get("rating"),
    title: formData.get("title"),
    visitedAt: formData.get("visitedAt"),
  });

  if (!parsed.success) {
    redirect("/reviews?error=invalid-review");
  }

  const beer = await db.beer.findUnique({
    where: { slug: parsed.data.beerSlug },
    select: { id: true },
  });

  if (!beer) {
    redirect("/reviews?error=missing-beer");
  }

  await db.review.create({
    data: {
      authorName:
        parsed.data.authorName ?? session.user.name ?? "Hop Atlas member",
      beerId: beer.id,
      body: parsed.data.body,
      published: true,
      rating: parsed.data.rating,
      title: parsed.data.title,
      userId: session.user.id,
      visitedAt: parsed.data.visitedAt
        ? new Date(parsed.data.visitedAt)
        : undefined,
    },
  });

  revalidatePath("/");
  revalidatePath("/club");
  revalidatePath("/reviews");
}

export async function createBreweryAction(formData: FormData) {
  await requireAdminSession();

  const parsed = breweryCreateSchema.safeParse({
    city: formData.get("city"),
    country: formData.get("country"),
    description: formData.get("description"),
    heroBeer: formData.get("heroBeer"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    specialty: formData.get("specialty"),
    tags: formData.get("tags"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    redirect("/admin?error=brewery-invalid");
  }

  await db.brewery.create({
    data: {
      city: parsed.data.city,
      country: parsed.data.country,
      description: parsed.data.description,
      heroBeer: parsed.data.heroBeer,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      name: parsed.data.name,
      slug: parsed.data.slug,
      specialty: parsed.data.specialty,
      tags: parsed.data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      website: parsed.data.website,
    },
  });

  revalidateAdminSurfaces();
}

export async function createBeerAction(formData: FormData) {
  await requireAdminSession();

  const parsed = beerCreateSchema.safeParse({
    abv: formData.get("abv"),
    brewerySlug: formData.get("brewerySlug"),
    description: formData.get("description"),
    featured: readFormString(formData, "featured"),
    ibu: formData.get("ibu"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    style: formData.get("style"),
  });

  if (!parsed.success) {
    redirect("/admin?error=beer-invalid");
  }

  const brewery = await db.brewery.findUnique({
    where: { slug: parsed.data.brewerySlug },
    select: { id: true },
  });

  if (!brewery) {
    redirect("/admin?error=brewery-missing");
  }

  await db.beer.create({
    data: {
      abv: parsed.data.abv,
      breweryId: brewery.id,
      description: parsed.data.description,
      featured: parsed.data.featured,
      ibu: parsed.data.ibu,
      name: parsed.data.name,
      slug: parsed.data.slug,
      style: parsed.data.style,
    },
  });

  revalidateAdminSurfaces();
}

export async function createRouteAction(formData: FormData) {
  await requireAdminSession();

  const parsed = routeCreateSchema.safeParse({
    city: formData.get("city"),
    distanceKm: formData.get("distanceKm"),
    durationMinutes: formData.get("durationMinutes"),
    highlights: formData.get("highlights"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    stopSlugs: formData.get("stopSlugs"),
    summary: formData.get("summary"),
    vibe: formData.get("vibe"),
  });

  if (!parsed.success) {
    redirect("/admin?error=route-invalid");
  }

  const breweries = await db.brewery.findMany({
    where: { slug: { in: parsed.data.stopSlugs } },
    select: { id: true, slug: true },
  });

  if (breweries.length !== parsed.data.stopSlugs.length) {
    redirect("/admin?error=route-stops");
  }

  const breweryBySlug = new Map(
    breweries.map((brewery) => [brewery.slug, brewery.id]),
  );

  await db.route.create({
    data: {
      city: parsed.data.city,
      distanceKm: parsed.data.distanceKm,
      durationMinutes: parsed.data.durationMinutes,
      name: parsed.data.name,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      vibe: parsed.data.vibe,
      stops: {
        create: parsed.data.stopSlugs.map((slug, index) => ({
          breweryId: breweryBySlug.get(slug)!,
          position: index,
          recommendedPour: parsed.data.highlights[index],
        })),
      },
    },
  });

  revalidateAdminSurfaces();
}

export async function toggleReviewVisibilityAction(formData: FormData) {
  await requireAdminSession();

  const parsed = reviewModerationSchema.safeParse({
    published: formData.get("published"),
    reviewId: formData.get("reviewId"),
  });

  if (!parsed.success) {
    redirect("/admin?error=review-invalid");
  }

  await db.review.update({
    where: { id: parsed.data.reviewId },
    data: { published: parsed.data.published === "true" },
  });

  revalidateAdminSurfaces();
}

export async function toggleBeerFeaturedAction(formData: FormData) {
  await requireAdminSession();

  const parsed = beerFeatureSchema.safeParse({
    beerId: formData.get("beerId"),
    featured: formData.get("featured"),
  });

  if (!parsed.success) {
    redirect("/admin?error=beer-featured");
  }

  await db.beer.update({
    where: { id: parsed.data.beerId },
    data: { featured: parsed.data.featured === "true" },
  });

  revalidateAdminSurfaces();
}

export async function updateUserRoleAction(formData: FormData) {
  const session = await requireAdminSession();
  const parsed = userRoleSchema.safeParse({
    role: formData.get("role"),
    userId: formData.get("userId"),
  });

  if (!parsed.success) {
    redirect("/admin?error=user-role");
  }

  if (
    session.user.id === parsed.data.userId &&
    parsed.data.role !== UserRole.ADMIN
  ) {
    redirect("/admin?error=self-demote");
  }

  if (parsed.data.role !== UserRole.ADMIN) {
    await assertAdminMutationAllowed(session.user.id, parsed.data.userId);
  }

  await db.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  });

  revalidatePath("/admin");
}

export async function updateBreweryAction(formData: FormData) {
  await requireAdminSession();

  const parsed = breweryUpdateSchema.safeParse({
    breweryId: formData.get("breweryId"),
    city: formData.get("city"),
    country: formData.get("country"),
    description: formData.get("description"),
    heroBeer: formData.get("heroBeer"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    specialty: formData.get("specialty"),
    tags: formData.get("tags"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    redirect("/admin?error=brewery-invalid");
  }

  await db.brewery.update({
    where: { id: parsed.data.breweryId },
    data: {
      city: parsed.data.city,
      country: parsed.data.country,
      description: parsed.data.description,
      heroBeer: parsed.data.heroBeer,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      name: parsed.data.name,
      slug: parsed.data.slug,
      specialty: parsed.data.specialty,
      tags: parsed.data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      website: parsed.data.website,
    },
  });

  revalidateAdminSurfaces();
}

export async function deleteBreweryAction(formData: FormData) {
  await requireAdminSession();
  const parsed = deleteEntitySchema.safeParse({
    id: formData.get("breweryId"),
  });

  if (!parsed.success) {
    redirect("/admin?error=brewery-delete");
  }

  await db.brewery.delete({ where: { id: parsed.data.id } });
  revalidateAdminSurfaces();
}

export async function updateBeerAction(formData: FormData) {
  await requireAdminSession();

  const parsed = beerUpdateSchema.safeParse({
    abv: formData.get("abv"),
    beerId: formData.get("beerId"),
    brewerySlug: formData.get("brewerySlug"),
    description: formData.get("description"),
    featured: readFormString(formData, "featured"),
    ibu: formData.get("ibu"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    style: formData.get("style"),
  });

  if (!parsed.success) {
    redirect("/admin?error=beer-invalid");
  }

  const brewery = await db.brewery.findUnique({
    where: { slug: parsed.data.brewerySlug },
    select: { id: true },
  });

  if (!brewery) {
    redirect("/admin?error=brewery-missing");
  }

  await db.beer.update({
    where: { id: parsed.data.beerId },
    data: {
      abv: parsed.data.abv,
      breweryId: brewery.id,
      description: parsed.data.description,
      featured: parsed.data.featured,
      ibu: parsed.data.ibu,
      name: parsed.data.name,
      slug: parsed.data.slug,
      style: parsed.data.style,
    },
  });

  revalidateAdminSurfaces();
}

export async function deleteBeerAction(formData: FormData) {
  await requireAdminSession();
  const parsed = deleteEntitySchema.safeParse({ id: formData.get("beerId") });

  if (!parsed.success) {
    redirect("/admin?error=beer-delete");
  }

  await db.beer.delete({ where: { id: parsed.data.id } });
  revalidateAdminSurfaces();
}

export async function updateRouteAction(formData: FormData) {
  await requireAdminSession();

  const parsed = routeUpdateSchema.safeParse({
    city: formData.get("city"),
    distanceKm: formData.get("distanceKm"),
    durationMinutes: formData.get("durationMinutes"),
    highlights: formData.get("highlights"),
    name: formData.get("name"),
    routeId: formData.get("routeId"),
    slug: formData.get("slug"),
    stopSlugs: formData.get("stopSlugs"),
    summary: formData.get("summary"),
    vibe: formData.get("vibe"),
  });

  if (!parsed.success) {
    redirect("/admin?error=route-invalid");
  }

  const breweries = await db.brewery.findMany({
    where: { slug: { in: parsed.data.stopSlugs } },
    select: { id: true, slug: true },
  });

  if (breweries.length !== parsed.data.stopSlugs.length) {
    redirect("/admin?error=route-stops");
  }

  const breweryBySlug = new Map(
    breweries.map((brewery) => [brewery.slug, brewery.id]),
  );

  await db.route.update({
    where: { id: parsed.data.routeId },
    data: {
      city: parsed.data.city,
      distanceKm: parsed.data.distanceKm,
      durationMinutes: parsed.data.durationMinutes,
      name: parsed.data.name,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      vibe: parsed.data.vibe,
      stops: {
        deleteMany: {},
        create: parsed.data.stopSlugs.map((slug, index) => ({
          breweryId: breweryBySlug.get(slug)!,
          position: index,
          recommendedPour: parsed.data.highlights[index],
        })),
      },
    },
  });

  revalidateAdminSurfaces();
}

export async function deleteRouteAction(formData: FormData) {
  await requireAdminSession();
  const parsed = deleteEntitySchema.safeParse({ id: formData.get("routeId") });

  if (!parsed.success) {
    redirect("/admin?error=route-delete");
  }

  await db.route.delete({ where: { id: parsed.data.id } });
  revalidateAdminSurfaces();
}

export async function updateReviewAction(formData: FormData) {
  await requireAdminSession();

  const parsed = reviewUpdateSchema.safeParse({
    authorName: formData.get("authorName"),
    body: formData.get("body"),
    published: formData.get("published"),
    rating: formData.get("rating"),
    reviewId: formData.get("reviewId"),
    title: formData.get("title"),
    visitedAt: formData.get("visitedAt"),
  });

  if (!parsed.success) {
    redirect("/admin?error=review-invalid");
  }

  await db.review.update({
    where: { id: parsed.data.reviewId },
    data: {
      authorName: parsed.data.authorName,
      body: parsed.data.body,
      published: parsed.data.published === "true",
      rating: parsed.data.rating,
      title: parsed.data.title,
      visitedAt: parsed.data.visitedAt ? new Date(parsed.data.visitedAt) : null,
    },
  });

  revalidateAdminSurfaces();
}

export async function deleteReviewAction(formData: FormData) {
  await requireAdminSession();
  const parsed = deleteEntitySchema.safeParse({ id: formData.get("reviewId") });

  if (!parsed.success) {
    redirect("/admin?error=review-delete");
  }

  await db.review.delete({ where: { id: parsed.data.id } });
  revalidateAdminSurfaces();
}

export async function updateUserAction(formData: FormData) {
  const session = await requireAdminSession();

  const parsed = userUpdateSchema.safeParse({
    city: formData.get("city"),
    name: formData.get("name"),
    role: formData.get("role"),
    userId: formData.get("userId"),
  });

  if (!parsed.success) {
    redirect("/admin?error=user-role");
  }

  if (
    session.user.id === parsed.data.userId &&
    parsed.data.role !== UserRole.ADMIN
  ) {
    redirect("/admin?error=self-demote");
  }

  if (parsed.data.role !== UserRole.ADMIN) {
    await assertAdminMutationAllowed(session.user.id, parsed.data.userId);
  }

  await db.user.update({
    where: { id: parsed.data.userId },
    data: {
      city: parsed.data.city ?? null,
      name: parsed.data.name ?? null,
      role: parsed.data.role,
    },
  });

  revalidateAdminSurfaces();
}

export async function deleteUserAction(formData: FormData) {
  const session = await requireAdminSession();
  const parsed = deleteEntitySchema.safeParse({ id: formData.get("userId") });

  if (!parsed.success) {
    redirect("/admin?error=user-delete");
  }

  await assertAdminMutationAllowed(session.user.id, parsed.data.id);

  await db.user.delete({ where: { id: parsed.data.id } });
  revalidateAdminSurfaces();
}
