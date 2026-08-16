import { LandingPage } from "@components/landingpage/LandingPage";
import type { Metadata } from "next";
import { AUTHOR_NAME, AUTHOR_PROFILES, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@lib/site";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
};

const profileJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: AUTHOR_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile`,
      url: SITE_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      mainEntity: { "@id": `${SITE_URL}/#person` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: AUTHOR_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      jobTitle: "AI Engineer and Software Developer",
      address: {
        "@type": "PostalAddress",
        addressCountry: "PL",
      },
      knowsAbout: [
        "Artificial Intelligence",
        "Large Language Models",
        "Software development",
        "Software quality assurance",
      ],
      sameAs: AUTHOR_PROFILES,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <LandingPage />
    </>
  );
}
