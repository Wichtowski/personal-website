import { redirect } from "next/navigation";

export default function LegacyGithubPage() {
  redirect("/contributions");
}
