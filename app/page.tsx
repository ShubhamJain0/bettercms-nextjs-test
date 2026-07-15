import Link from "next/link";
import { notFound } from "next/navigation";

import { bcms } from "@/src/bettercms.bindings.generated";
import { cms } from "@/src/bettercms";
import type { HomeFields } from "@/src/bettercms.generated";

export default async function Home() {
  const home = await cms.getEntry<HomeFields>("home", {
    revalidate: 60,
    tags: ["home", "home:home"],
  });

  if (!home) {
    notFound();
  }

  const { fields } = home;
  const hero = fields.hero?.nonRepeatable;
  const features = fields.features?.repeatable ?? [];
  const stats = fields.stats?.repeatable ?? [];
  const testimonials = fields.testimonials?.repeatable ?? [];
  const cta = fields.cta?.nonRepeatable;

  return (
    <main className="flex-1">
      <section className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f3d2e,#1f6f54_48%,#102a43)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,color-mix(in_srgb,var(--signal)_22%,transparent),transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,43,32,0.18)_0%,rgba(10,43,32,0.45)_42%,rgba(16,42,67,0.88)_100%)]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-6xl flex-col justify-end px-6 pb-16 pt-28">
          <p className="reveal display text-5xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl">
            Northline
          </p>
          <div className="hero-accent mt-5 h-1 w-28 rounded-full bg-[var(--signal)]" />
          {hero?.eyebrow ? (
            <p
              {...bcms.home.hero.eyebrow}
              className="reveal-delay mt-8 font-mono text-xs uppercase tracking-[0.24em] text-[var(--signal)]"
            >
              {hero.eyebrow}
            </p>
          ) : null}
          <h1
            {...bcms.home.hero.heroTitle}
            className="reveal-delay mt-4 max-w-3xl text-3xl leading-tight text-white sm:text-5xl"
          >
            {hero?.heroTitle}
          </h1>
          {hero?.heroSubtitle ? (
            <p
              {...bcms.home.hero.heroSubtitle}
              className="reveal-delay mt-5 max-w-xl text-lg leading-8 text-white/80"
            >
              {hero.heroSubtitle}
            </p>
          ) : null}
          <div className="reveal-delay mt-10 flex flex-wrap items-center gap-4">
            {hero?.primaryCtaText && hero.primaryCtaHref ? (
              <Link
                {...bcms.home.hero.primaryCtaText}
                className="inline-flex items-center bg-[var(--signal)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--signal-ink)] transition hover:brightness-105"
                href={hero.primaryCtaHref}
              >
                {hero.primaryCtaText}
              </Link>
            ) : null}
            {hero?.secondaryCtaText && hero.secondaryCtaHref ? (
              <Link
                {...bcms.home.hero.secondaryCtaText}
                className="inline-flex items-center border border-white/35 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:border-white hover:bg-white/10"
                href={hero.secondaryCtaHref}
              >
                {hero.secondaryCtaText}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {features.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-6 py-24">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--ink-soft)]">
            Capabilities
          </p>
          <h2 className="display mt-3 max-w-3xl text-4xl font-bold text-[var(--brand)] sm:text-5xl">
            Why teams choose us
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {features.map((feature, index) => (
              <div
                {...bcms.home.features.$(index)}
                className="border-t border-[var(--line)] pt-8"
                key={`${feature.heading}-${index}`}
              >
                <h3
                  {...bcms.home.features.heading(index)}
                  className="display text-3xl font-bold text-[var(--ink)]"
                >
                  {feature.heading}
                </h3>
                {feature.description ? (
                  <p
                    {...bcms.home.features.description(index)}
                    className="mt-4 text-lg leading-8 text-[var(--ink-soft)]"
                  >
                    {feature.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {stats.length > 0 ? (
        <section className="border-y border-[var(--line)] bg-[var(--paper-deep)]">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div {...bcms.home.stats.$(index)} key={`${stat.description}-${index}`}>
                <p
                  {...bcms.home.stats.statValue(index)}
                  className="display text-4xl font-bold text-[var(--brand)] sm:text-5xl"
                >
                  {stat.statValue}
                </p>
                <p
                  {...bcms.home.stats.description(index)}
                  className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]"
                >
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {testimonials.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-6 py-24">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--ink-soft)]">
            Voices
          </p>
          <h2 className="display mt-3 text-4xl font-bold text-[var(--brand)] sm:text-5xl">
            Teams that ship with us
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <blockquote
                {...bcms.home.testimonials.$(index)}
                className="border border-[var(--line)] bg-[var(--paper)] p-7"
                key={`${item.clientName}-${index}`}
              >
                <p
                  {...bcms.home.testimonials.testimonial(index)}
                  className="text-lg leading-8 text-[var(--ink)]"
                >
                  {item.testimonial}
                </p>
                <footer className="mt-8">
                  <p
                    {...bcms.home.testimonials.clientName(index)}
                    className="display text-xl font-bold text-[var(--brand)]"
                  >
                    {item.clientName}
                  </p>
                  {item.designation ? (
                    <p
                      {...bcms.home.testimonials.designation(index)}
                      className="mt-1 text-sm text-[var(--ink-soft)]"
                    >
                      {item.designation}
                    </p>
                  ) : null}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}

      {cta ? (
        <section className="border-t border-[var(--line)] bg-[var(--brand)]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {cta.ctaHeading ? (
                <h2
                  {...bcms.home.cta.ctaHeading}
                  className="display text-4xl font-bold text-white sm:text-5xl"
                >
                  {cta.ctaHeading}
                </h2>
              ) : null}
              {cta.ctaBody ? (
                <p
                  {...bcms.home.cta.ctaBody}
                  className="mt-5 text-lg leading-8 text-white/80"
                >
                  {cta.ctaBody}
                </p>
              ) : null}
            </div>
            {cta.ctaButtonText && cta.ctaButtonHref ? (
              <Link
                {...bcms.home.cta.ctaButtonText}
                className="inline-flex items-center bg-[var(--signal)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--signal-ink)] transition hover:brightness-105"
                href={cta.ctaButtonHref}
              >
                {cta.ctaButtonText}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
