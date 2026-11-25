import Link from "next/link";
import {
  Activity,
  Home as HomeIcon,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const FEATURES = [
  {
    icon: MapPin,
    title: "Live, location-aware readings",
    detail:
      "Enter any city and get the current US AQI plus a 24-hour forecast, pulled from real-time monitoring data — no sign-up, no stale numbers.",
  },
  {
    icon: ShieldCheck,
    title: "Household risk, not just a number",
    detail:
      "Tell us who's home — kids, elders, anyone with asthma or a pregnancy — and get risk guidance tailored to each of them, not a generic warning.",
  },
  {
    icon: Activity,
    title: "Best hours to step outside",
    detail:
      "We scan the next 24 hours of forecast AQI and surface the cleanest windows for exercise, school runs, or errands.",
  },
  {
    icon: HomeIcon,
    title: "Indoor air quality hacks",
    detail:
      "Purifier placement, box-fan filters, exhaust timing, and plant picks — concrete actions, not vague advice.",
  },
  {
    icon: Leaf,
    title: "Sustainable swaps with real numbers",
    detail:
      "See exactly how much CO2 and personal exposure you cut by carpooling, taking transit, or shifting your commute.",
  },
  {
    icon: Sparkles,
    title: "AI-written, human-readable summary",
    detail:
      "A GenAI narrative ties your plan together in plain language — with a fully functional deterministic plan underneath if the AI layer is ever unavailable.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-surface-muted to-background"
          />
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-surface border border-border px-4 py-1.5 text-sm font-medium text-foreground/80">
              <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
              GenAI assistant for winter smog &amp; urban air pollution
            </p>
            <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight text-balance">
              Breathe smarter through{" "}
              <span className="text-brand">smog season</span>.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-foreground/70 text-balance">
              Saans reads live air-quality data for your city and turns it into a
              personalized daily routine — when to step out, how to clean your
              indoor air, and which low-emission swaps protect your family and the
              planet.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/app"
                className="inline-flex items-center rounded-full bg-brand px-7 py-3 text-base font-semibold text-brand-foreground transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Check your air quality
              </Link>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="features-heading"
          className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24"
        >
          <h2 id="features-heading" className="text-3xl font-bold text-center">
            One assistant, your whole household&apos;s plan
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <feature.icon
                  className="h-8 w-8 text-brand"
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-semibold text-lg">{feature.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{feature.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-20 sm:pb-28 text-center">
          <div className="rounded-3xl border border-border bg-surface-muted p-10 sm:p-14">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Severe smog shouldn&apos;t mean guesswork.
            </h2>
            <p className="mt-4 text-foreground/70 max-w-xl mx-auto">
              Get a plan built from your city&apos;s live air data and your household&apos;s
              actual needs — in under a minute.
            </p>
            <Link
              href="/app"
              className="mt-8 inline-flex items-center rounded-full bg-brand px-7 py-3 text-base font-semibold text-brand-foreground transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Get my plan
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
