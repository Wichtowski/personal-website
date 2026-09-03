import { GithubAccountCard } from "./GithubAccountCard";
import Link from "next/link";

interface GithubAccountsPanelProps {
  labels: {
    personalGithubAccount: string;
    workGithubAccount: string;
    gitlabAccount: string;
  };
}

export function GithubAccountsPanel({ labels }: GithubAccountsPanelProps) {
  return (
    <div className="w-full lg:w-max lg:max-w-full lg:justify-self-end p-6 md:p-8 rounded-2xl bg-muted/15 backdrop-blur-sm flex flex-col justify-between">
      <div className="space-y-4 gap-3 flex flex-col">
        <Link href="https://github.com/Wichtowski" target="_blank" rel="noopener noreferrer">
          <GithubAccountCard
            label={labels.personalGithubAccount}
            username="Wichtowski"
            avatarUrl="/contributions/private.png"
            avatarAlt="Personal Account"
            labelClassName="text-primary"
          />
        </Link>

        <Link
          href="https://github.com/oskar-wichtowski-wttech"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubAccountCard
            label={labels.workGithubAccount}
            username="oskar-wichtowski-wttech"
            avatarUrl="/contributions/work.png"
            avatarAlt="Work Account"
            labelClassName="text-blue-500"
          />
        </Link>

        <Link href="https://gitlab.com/Wichtowski1" target="_blank" rel="noopener noreferrer">
          <GithubAccountCard
            label={labels.gitlabAccount}
            username="Wichtowski1"
            avatarUrl="/contributions/gitlab.png"
            avatarAlt="GitLab Account"
            labelClassName="text-[#FC6D26]"
          />
        </Link>
      </div>
    </div>
  );
}
