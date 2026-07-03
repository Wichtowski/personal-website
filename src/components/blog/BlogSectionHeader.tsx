import { BookOpen } from "lucide-react";

interface BlogSectionHeaderProps {
  title: string;
  subtitle: string;
}

export function BlogSectionHeader({ title, subtitle }: BlogSectionHeaderProps) {
  return (
    <div className="max-w-2xl mb-16">
      <h2 className="flex flex-row items-center gap-2 text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
        <BookOpen size={56} className="text-primary shrink-0 mr-2" />
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
