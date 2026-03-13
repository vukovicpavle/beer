export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  intro: string;
  sections: { heading: string; body: string }[];
};

export const journalPosts: JournalPost[] = [
  {
    slug: "how-to-build-a-beer-trip-without-overplanning",
    title: "How to Build a Beer Trip Without Overplanning",
    excerpt:
      "A lightweight framework for planning a beer-focused day that still leaves room for detours and great surprises.",
    category: "Planning",
    readTime: "5 min read",
    publishedAt: "2026-03-10",
    intro:
      "The best beer trips feel intentional, not over-scripted. Start with one anchor stop, one backup neighborhood, and one pour you know you will regret missing.",
    sections: [
      {
        heading: "Pick an anchor, not a spreadsheet",
        body: "Choose the brewery or bottle list you care about most and let that define the tempo of the day. Once the anchor is locked, every other stop becomes a supporting decision instead of a research rabbit hole.",
      },
      {
        heading: "Control for palate fatigue",
        body: "Mix lower-ABV or cleaner styles between bigger pours. A route that goes pale lager, saison, and then stout almost always lands better than stacking heavy hitters early.",
      },
      {
        heading: "Use distance as a quality filter",
        body: "If moving between venues becomes a project, the route is too complicated. Tight clusters create momentum and keep you focused on the beer instead of the logistics.",
      },
    ],
  },
  {
    slug: "what-makes-a-review-useful",
    title: "What Makes a Beer Review Useful",
    excerpt:
      "Strong tasting notes are concise, comparative, and specific about balance instead of chasing dramatic adjectives.",
    category: "Reviews",
    readTime: "4 min read",
    publishedAt: "2026-03-06",
    intro:
      "A useful beer review helps the next person make a decision. That means describing structure, balance, and context more than performing your vocabulary.",
    sections: [
      {
        heading: "Lead with the drinking experience",
        body: "Talk about what happens in the glass from first sip to finish. Was the bitterness sharp or polished? Did sweetness build or stay in check? Those details travel well.",
      },
      {
        heading: "Context matters",
        body: "A review written during a busy festival pour should not sound the same as a calm bar pour from the source. Mentioning the setting improves trust without making the note long.",
      },
      {
        heading: "Score only after the note works",
        body: "Ratings are fast, but they are not enough. If the written note cannot explain why something earned a four or a five, the score is just noise.",
      },
    ],
  },
  {
    slug: "map-design-for-beer-discovery",
    title: "Map Design for Beer Discovery",
    excerpt:
      "A beer map should help you plan movement, not just dump markers on a city and call it discovery.",
    category: "Product",
    readTime: "6 min read",
    publishedAt: "2026-02-28",
    intro:
      "Beer maps get useful when they combine location, style strength, and route logic. The goal is not volume of places; it is confidence in where to go next.",
    sections: [
      {
        heading: "Markers need meaning",
        body: "A marker should immediately suggest whether the place is right for a quick lager, a route anchor, or a deeper cellar detour. Visual sameness wastes map real estate.",
      },
      {
        heading: "Neighborhood beats citywide sprawl",
        body: "Users usually make route decisions within walking or short-transit distance. Optimizing for neighborhood clusters is more valuable than showing every possible venue on the first load.",
      },
      {
        heading: "The side panel closes the planning loop",
        body: "Maps are good at geography, not nuance. Pairing pins with side-panel tasting notes, specialties, and route fit turns exploration into decision-making.",
      },
    ],
  },
];

export function getJournalPost(slug: string) {
  return journalPosts.find((post) => post.slug === slug);
}
