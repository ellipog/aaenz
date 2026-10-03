/*
 * The studio as an entity, stated once in JSON-LD.
 *
 * A brand query is answered from whichever entity a search engine can assemble
 * about the name, so the three nodes here are one thing seen three ways: the
 * Organization, the Person who is the studio's founder, and the WebSite. They
 * are stitched together by `@id` rather than repeated, and `sameAs` carries the
 * profiles the studio itself controls — every URL in it was checked to resolve.
 *
 * The LinkedIn company page is not here yet: it does not exist. When it does,
 * it belongs in the Organization's `sameAs`, beside the GitHub org.
 */
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@id": "https://aaenz.no/#organization",
      "@type": "Organization",
      alternateName: ["aaen studios", "aaen", "aaenz"],
      email: "elliot@aaenz.no",
      founder: { "@id": "https://aaenz.no/#elliot" },
      logo: {
        "@type": "ImageObject",
        url: "https://aaenz.no/assets/logo-mark.png",
      },
      name: "Aaen Studios",
      sameAs: [
        "https://github.com/aaen-studios",
        "https://ellipog.dev",
        "https://modrinth.com/user/Ellipog",
        "https://www.curseforge.com/members/ellipog/projects",
      ],
      url: "https://aaenz.no/",
    },
    {
      "@id": "https://aaenz.no/#elliot",
      "@type": "Person",
      jobTitle: "Founder & Lead Engineer",
      name: "Elliot Strand Aaen",
      sameAs: [
        "https://github.com/Ellipog",
        "https://www.linkedin.com/in/elliot-strand-aaen",
        "https://www.instagram.com/ellipog",
      ],
      worksFor: { "@id": "https://aaenz.no/#organization" },
    },
    {
      "@id": "https://aaenz.no/#website",
      "@type": "WebSite",
      alternateName: ["aaen", "aaenz"],
      inLanguage: "en",
      name: "aaen studios",
      publisher: { "@id": "https://aaenz.no/#organization" },
      url: "https://aaenz.no/",
    },
  ],
};

export default function SiteSchema() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type="application/ld+json"
    />
  );
}
