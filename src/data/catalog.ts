export const routeVibes = [
  "scenic",
  "sessionable",
  "cellar-hunt",
  "food-first",
] as const;

export type RouteVibe = (typeof routeVibes)[number];

export type BrewerySummary = {
  slug: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  description: string;
  specialty: string;
  heroBeer?: string;
  website?: string;
  tags: string[];
};

export type BeerSummary = {
  slug: string;
  name: string;
  style: string;
  abv: number;
  ibu?: number;
  description: string;
  featured: boolean;
  brewerySlug: string;
};

export type ReviewSummary = {
  createdAt?: string;
  id: string;
  beerSlug: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  visitedAt?: string;
};

export type RouteSummary = {
  slug: string;
  name: string;
  city: string;
  vibe: RouteVibe;
  summary: string;
  durationMinutes: number;
  distanceKm: number;
  stopSlugs: string[];
  highlights: string[];
};

export const breweries: BrewerySummary[] = [
  {
    slug: "wild-yeast-society",
    name: "Wild Yeast Society",
    city: "Ljubljana",
    country: "Slovenia",
    latitude: 46.0569,
    longitude: 14.5058,
    description:
      "Mixed fermentation specialists pouring bright farmhouse ales and quietly ambitious barrel work.",
    specialty: "Farmhouse & mixed culture",
    heroBeer: "River Saison",
    website: "https://example.com/wild-yeast-society",
    tags: ["barrel", "wild", "patio"],
  },
  {
    slug: "black-forest-lagerhaus",
    name: "Black Forest Lagerhaus",
    city: "Munich",
    country: "Germany",
    latitude: 48.1374,
    longitude: 11.5755,
    description:
      "Crisp lager house balancing old-school discipline with modern dry-hop restraint.",
    specialty: "Lagers & smoked beer",
    heroBeer: "Midnight Keller",
    website: "https://example.com/black-forest-lagerhaus",
    tags: ["lager", "classic", "food"],
  },
  {
    slug: "sunset-hops-collective",
    name: "Sunset Hops Collective",
    city: "Portland",
    country: "USA",
    latitude: 45.5152,
    longitude: -122.6784,
    description:
      "Low-bitterness hazies, IPA flights, and a tight food menu built for long afternoons.",
    specialty: "Fresh hop & hazy IPA",
    heroBeer: "Signal Glow",
    website: "https://example.com/sunset-hops-collective",
    tags: ["ipa", "flights", "friends"],
  },
  {
    slug: "cellar-north-project",
    name: "Cellar North Project",
    city: "Copenhagen",
    country: "Denmark",
    latitude: 55.6761,
    longitude: 12.5683,
    description:
      "A focused cellar bar and brewery hybrid for pastry stouts, barleywine pours, and rare bottle shares.",
    specialty: "Cellar releases & strong ales",
    heroBeer: "Night Engine",
    website: "https://example.com/cellar-north-project",
    tags: ["cellar", "rare", "dessert"],
  },
];

export const beers: BeerSummary[] = [
  {
    slug: "river-saison",
    name: "River Saison",
    style: "Saison",
    abv: 6.4,
    ibu: 28,
    description:
      "Peppery, lemon-zest saison with a dry finish that stays elegant on repeat pours.",
    featured: true,
    brewerySlug: "wild-yeast-society",
  },
  {
    slug: "midnight-keller",
    name: "Midnight Keller",
    style: "Kellerbier",
    abv: 5.2,
    ibu: 24,
    description:
      "Soft-malted dark lager with bitter chocolate aromatics and a clean, herbal snap.",
    featured: true,
    brewerySlug: "black-forest-lagerhaus",
  },
  {
    slug: "signal-glow",
    name: "Signal Glow",
    style: "Hazy IPA",
    abv: 6.8,
    ibu: 32,
    description:
      "Mango and white grape up front, then a softer resin note that keeps it from drifting sweet.",
    featured: true,
    brewerySlug: "sunset-hops-collective",
  },
  {
    slug: "night-engine",
    name: "Night Engine",
    style: "Imperial Stout",
    abv: 11.5,
    ibu: 48,
    description:
      "Dense espresso stout with toasted coconut and a surprisingly polished finish.",
    featured: false,
    brewerySlug: "cellar-north-project",
  },
  {
    slug: "granite-smoke",
    name: "Granite Smoke",
    style: "Rauchbier",
    abv: 5.6,
    ibu: 26,
    description:
      "Campfire smoke, fresh bread crust, and enough lift to keep the glass moving.",
    featured: false,
    brewerySlug: "black-forest-lagerhaus",
  },
  {
    slug: "petal-logic",
    name: "Petal Logic",
    style: "Foeder Sour",
    abv: 7.1,
    ibu: 12,
    description:
      "Tart stone fruit and white wine acidity with a quietly tannic finish.",
    featured: false,
    brewerySlug: "wild-yeast-society",
  },
];

export const reviews: ReviewSummary[] = [
  {
    createdAt: "2026-02-14T18:30:00.000Z",
    id: "rev-1",
    beerSlug: "river-saison",
    authorName: "Mila P.",
    rating: 5,
    title: "Exactly what a house saison should be",
    body: "Structured, bright, and dry enough to keep you ordering another without thinking twice.",
    visitedAt: "2026-02-14",
  },
  {
    createdAt: "2026-01-18T16:20:00.000Z",
    id: "rev-2",
    beerSlug: "midnight-keller",
    authorName: "Jonas K.",
    rating: 4,
    title: "Dark lager with real lift",
    body: "The roast note stays controlled and the finish is cleaner than the color suggests.",
    visitedAt: "2026-01-18",
  },
  {
    createdAt: "2026-03-03T20:10:00.000Z",
    id: "rev-3",
    beerSlug: "signal-glow",
    authorName: "Sara W.",
    rating: 4,
    title: "Hazy without the sugar overload",
    body: "Soft fruit, no palate fatigue, and the flight menu makes it easy to compare side by side.",
    visitedAt: "2026-03-03",
  },
  {
    createdAt: "2026-02-02T21:30:00.000Z",
    id: "rev-4",
    beerSlug: "night-engine",
    authorName: "Elias R.",
    rating: 5,
    title: "Cellar release worth planning around",
    body: "Big stout energy, but the balance and pour size options keep it from becoming a novelty bottle.",
    visitedAt: "2026-02-02",
  },
  {
    createdAt: "2026-01-29T19:15:00.000Z",
    id: "rev-5",
    beerSlug: "granite-smoke",
    authorName: "Lea V.",
    rating: 4,
    title: "Smoke handled with restraint",
    body: "You get the campfire immediately, then it settles into bread crust and herbs instead of overwhelming the palate.",
    visitedAt: "2026-01-29",
  },
];

export const routes: RouteSummary[] = [
  {
    slug: "ljubljana-wild-loop",
    name: "Ljubljana Wild Loop",
    city: "Ljubljana",
    vibe: "scenic",
    summary:
      "A relaxed afternoon route built around mixed culture pours, riverside walking, and low decision fatigue.",
    durationMinutes: 210,
    distanceKm: 3.8,
    stopSlugs: ["wild-yeast-society"],
    highlights: [
      "Riverside pacing",
      "Bottle takeaway",
      "Great first-night route",
    ],
  },
  {
    slug: "munich-lager-lunch",
    name: "Munich Lager Lunch",
    city: "Munich",
    vibe: "food-first",
    summary:
      "Classic lager flow with enough smoked beer depth to make lunch feel like the center of the plan.",
    durationMinutes: 180,
    distanceKm: 2.4,
    stopSlugs: ["black-forest-lagerhaus"],
    highlights: [
      "Excellent kitchen",
      "Traditional pours",
      "Low-friction navigation",
    ],
  },
  {
    slug: "north-cellar-night",
    name: "North Cellar Night",
    city: "Copenhagen",
    vibe: "cellar-hunt",
    summary:
      "An evening route for stout drinkers and bottle-share energy with enough structure to feel intentional.",
    durationMinutes: 240,
    distanceKm: 4.6,
    stopSlugs: ["cellar-north-project"],
    highlights: [
      "Strong-ale focus",
      "Dessert pairing potential",
      "Rare release timing",
    ],
  },
  {
    slug: "portland-soft-hop-crawl",
    name: "Portland Soft Hop Crawl",
    city: "Portland",
    vibe: "sessionable",
    summary:
      "A hop-forward route with room for flights, snack breaks, and a second wind instead of palate burnout.",
    durationMinutes: 220,
    distanceKm: 5.2,
    stopSlugs: ["sunset-hops-collective"],
    highlights: ["Fresh hop focus", "Easy group energy", "Great for visitors"],
  },
];

export const cityOptions = Array.from(
  new Set(routes.map((route) => route.city)),
).sort();
