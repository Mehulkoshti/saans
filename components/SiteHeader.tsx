import Link from "next/link";
import { Wind } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Wind className="h-6 w-6 text-brand" aria-hidden="true" />
          <span>Saans</span>
        </Link>
        <nav aria-label="Primary">
          <Link
            href="/app"
            className="inline-flex items-center rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Check your air
          </Link>
        </nav>
      </div>
    </header>
  );
}
