import { Badge } from "~/components/ui/badge";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats?: Array<{ label: string; value: string }>;
};

export function PageHero({
  description,
  eyebrow,
  stats,
  title,
}: PageHeroProps) {
  return (
    <section className="grid gap-6 rounded-[2rem] border border-black/10 bg-[var(--panel)] px-6 py-7 shadow-[0_18px_60px_rgba(61,31,10,0.08)] md:px-8 md:py-8 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <Badge variant="muted" className="w-fit text-[var(--color-hop)]">
          {eyebrow}
        </Badge>
        <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--color-cellar)] md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-black/68 md:text-lg">
          {description}
        </p>
      </div>
      {stats?.length ? (
        <div className="grid grid-cols-2 gap-3 md:min-w-[18rem]">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.25rem] bg-[var(--color-cellar)] px-4 py-4 text-[var(--color-foam)]"
            >
              <p className="text-[11px] font-semibold tracking-[0.18em] text-white/56 uppercase">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
