import Link from "next/link";
import { ContourMark } from "@/components/ui/ContourMark";

/** Global 404 — catches requests outside any locale segment. */
export default function NotFound() {
  return (
    <html lang="no">
      <body className="bg-paper text-ink">
        <section className="relative flex min-h-screen items-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-contour-grid" aria-hidden />
          <div className="relative mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
            <ContourMark className="mx-auto h-20 w-20 text-moss" />
            <h1 className="mt-8 font-display text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
              Terrenget her er ikke kartlagt
            </h1>
            <p className="mt-5 font-display text-lg leading-relaxed text-ink-soft">
              Vi fant ikke denne siden. Kanskje stien er gammel, kanskje kartet er tatt ned.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center rounded-sm bg-moss px-6 py-3 font-medium text-paper transition-colors hover:bg-moss-deep"
            >
              Tilbake til starten
            </Link>
          </div>
        </section>
      </body>
    </html>
  );
}
