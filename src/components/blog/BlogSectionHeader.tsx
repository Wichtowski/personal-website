import { BookOpen } from "lucide-react";

interface BlogSectionHeaderProps {
  title: string;
  subtitle: string;
}

export const BlogSectionHeader = ({ title, subtitle }: BlogSectionHeaderProps) => {
  return (
    <div className="max-w-2xl mb-16">
      <h2 className="flex flex-row items-center gap-2 text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
        <BookOpen size={36} className="text-primary animate-pulse shrink-0" />
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
};
