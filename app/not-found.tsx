import type { Metadata } from "next";
import Plate from "@/components/ascii/plate";
import Decode from "@/components/decode";
import Leaders from "@/components/leaders";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Not found — Aaen Studios",
  robots: { index: false },
};

/* A missing page: 無 drawn in the characters for nothing, fading into the void. */
export default function NotFound() {
  return (
    <>
      <SiteHeader home={false} />
      <main className="relative px-5 pb-24 pt-[110px] sm:px-7">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center">
            <Plate
              cell={12}
              cellSm={8}
              className="fade-soft aspect-square w-full"
              kind="kanji"
              label="The kanji 無, nothing, drawn in smaller kanji for empty and void"
              options={{ ch: "無", fill: "無空虚" }}
              reveal="center"
            />
            <div>
              <p className="mono m-0 text-red">WARNING ・ 404</p>
              <h1 className="mincho m-0 mt-6 text-[clamp(48px,6vw,92px)] leading-[1]">
                <Decode text="Nothing" /> <span className="text-red">here</span>.
              </h1>
              <p className="m-0 mt-6 max-w-[46ch] text-dim">
                The page you asked for does not exist — moved, renamed, or never built.
              </p>
              <Leaders
                rows={[
                  ["SEARCH", "REJECTED", "text-red"],
                  ["RESTORE", "REJECTED", "text-red"],
                  ["RETURN", "APPROVED"],
                ]}
              />
              <a
                className="mono mt-10 inline-block text-bone no-underline transition-colors hover:text-red"
                href="/"
              >
                RETURN TO AAENZ.NO →
              </a>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter home={false} />
    </>
  );
}
