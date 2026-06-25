import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { getProjects } from "@/lib/mdx";

export default function PortfolioPage() {
  const projects = getProjects("en").concat(getProjects("pl"));
  return <PortfolioSection projects={projects} />;
}
