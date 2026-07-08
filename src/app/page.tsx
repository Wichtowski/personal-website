import { LandingPage } from "@components/landingpage/LandingPage";
import { SITE_URL, AUTHOR_NAME } from "@lib/site";

const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: AUTHOR_NAME,
    url: SITE_URL,
    jobTitle: "AI Engineer & Fullstack Developer",
  },
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
