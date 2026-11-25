export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-sm text-foreground/70 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>Saans — built for PromptWars Virtual, Challenge 06: Urban Air Quality Assistant.</p>
        <p>
          Air quality data via{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-2 hover:text-brand"
          >
            Open-Meteo
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
