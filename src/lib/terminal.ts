import type { ArticleMetadata, ProjectMetadata } from "@lib/mdx";
import type { Language } from "@locales/dictionary";

export type TerminalLineKind = "ascii" | "error" | "link" | "muted" | "success" | "text";

export interface TerminalOutputLine {
  kind: TerminalLineKind;
  text: string;
  href?: string;
}

export interface TerminalCommandResult {
  lines: TerminalOutputLine[];
  action?: {
    type: "change-directory" | "clear" | "navigate" | "external" | "theme";
    target?: string;
  };
}

export type TerminalDirectory = "~" | "~/articles" | "~/projects" | "~/contributions";

export interface TerminalContext {
  articles: ArticleMetadata[];
  projects: ProjectMetadata[];
  language: Language;
  history: string[];
  currentDirectory: TerminalDirectory;
}

const TERMINAL_COMMANDS = [
  "about",
  "articles",
  "cat",
  "cd",
  "clear",
  "contact",
  "contributions",
  "date",
  "find",
  "help",
  "history",
  "ls",
  "neofetch",
  "open",
  "portfolio",
  "projects",
  "pwd",
  "skills",
  "theme",
  "whoami",
] as const;

const FLORKA = [
  "       _                        ",
  "       `*-.                    ",
  "        )  _`-.                 ",
  "       .  : `. .                ",
  "       : _   '  \\               ",
  "       ; *` _.   `*-._          ",
  "       `-.-'          `-.       ",
  "         ;       `       `.     ",
  "         :.       .        \\    ",
  "         . \\  .   :   .-'   .   ",
  "         '  `+.;  ;  '      :   ",
  "         :  '  |    ;       ;-. ",
  "         ; '   : :`-:     _.`* ;",
  "      .*' /  .*' ; .*`- +'  `*' ",
  "      `*-*   `*-*  `*-*'",
].join("\n");

const SEZAMEK = [
  "      |\\      _,,,---,,_",
  "ZZZzz /,`.-'`'    -.  ;-;;,_",
  "     |,4-  ) )-,_. ,\\ (  `-'",
  "    '---''(_/--'  `-'\\_)",
].join("\n");

const ENDEAVOUROS = [
  "                     ./o.",
  "                   ./sssso-",
  "                 `:osssssss+`",
  "               `:+sssssssssso/.",
  "             `-/ossssssssssssso/.",
  "           `-/+sssssssssssssssso+:`",
  "         `-:/+sssssssssssssssssso+/.",
  "       `.://osssssssssssssssssssso++-",
  "      .://+ssssssssssssssssssssssso++:",
  "    .:///ossssssssssssssssssssssssso++:",
  "  `:////ssssssssssssssssssssssssssso+++.",
  "`-////+ssssssssssssssssssssssssssso++++-",
  " `..-+oosssssssssssssssssssssssso+++++/`",
  "   ./++++++++++++++++++++++++++++++/:.",
  "  `:::::::::::::::::::::::::------``",
];

function createNeofetch(projectCount: number, articleCount: number) {
  const systemInfo = [
    "oskar@portfolio",
    "---------------",
    "OS: EndeavourOS Linux x86_64",
    "Host: Oskar Wichtowski",
    "Role: AI Engineer / Software Engineer / QA",
    "Location: Poznań, Poland",
    `Projects: ${projectCount}`,
    `Articles: ${articleCount}`,
    "Shell: portfolio-cli",
    "Status: available",
  ];

  return ENDEAVOUROS.map((logoLine, index) => {
    const infoLine = systemInfo[index - 2] ?? "";
    return `${logoLine.padEnd(48)} ${infoLine}`;
  }).join("\n");
}

const copy = {
  en: {
    about: [
      "Oskar Wichtowski",
      "AI Engineer / Software Engineer / QA Specialist",
      "I build dependable AI products, full-stack systems and test automation.",
      "Based in Poland. Available for remote and on-site work.",
    ],
    empty: "No matching entries found.",
    hint: "Type 'help' to list commands.",
    unknown: (command: string) => `command not found: ${command}`,
  },
  pl: {
    about: [
      "Oskar Wichtowski",
      "AI Engineer / Software Engineer / QA Specialist",
      "Buduję niezawodne produkty AI, systemy full-stack i automatyzację testów.",
      "Pracuję z Polski, zdalnie i stacjonarnie.",
    ],
    empty: "Nie znaleziono pasujących wpisów.",
    hint: "Wpisz 'help', aby zobaczyć dostępne komendy.",
    unknown: (command: string) => `nie znaleziono komendy: ${command}`,
  },
} as const;

const helpLines: TerminalOutputLine[] = [
  { kind: "success", text: "AVAILABLE COMMANDS" },
  { kind: "text", text: "  about | whoami          profile summary" },
  { kind: "text", text: "  skills                  tools and specialties" },
  { kind: "text", text: "  projects [query]        browse or search projects" },
  { kind: "text", text: "  articles [query]        browse or search articles" },
  { kind: "text", text: "  find <query>            search all published work" },
  { kind: "text", text: "  ls | cd <dir> | pwd     browse portfolio files" },
  { kind: "text", text: "  contributions           GitHub and GitLab activity" },
  { kind: "text", text: "  contact                 contact details" },
  { kind: "text", text: "  open <target>           open a route or item slug" },
  { kind: "text", text: "  cat [florka|sezamek]    summon the terminal cats" },
  { kind: "text", text: "  neofetch                definitely serious system info" },
  { kind: "text", text: "  history | date | theme  utilities" },
  { kind: "text", text: "  clear                    clear this session" },
  { kind: "muted", text: "Use ↑ and ↓ to navigate command history." },
];

const skillsLines: TerminalOutputLine[] = [
  { kind: "success", text: "CORE" },
  { kind: "text", text: "  TypeScript  Python  Go  Rust  PHP" },
  { kind: "success", text: "AI / DATA" },
  { kind: "text", text: "  LLMs  RAG  PyTorch  Computer Vision  Qdrant" },
  { kind: "success", text: "PLATFORM" },
  { kind: "text", text: "  Cloudflare  Docker  Kubernetes  AWS  CI/CD" },
  { kind: "success", text: "QUALITY" },
  { kind: "text", text: "  Playwright  Cypress  Pytest  Vitest  observability" },
];

const routeTargets: Record<string, string> = {
  home: "/",
  portfolio: "/portfolio",
  projects: "/portfolio",
  articles: "/articles",
  blog: "/articles",
  contributions: "/contributions",
  github: "/contributions",
  contact: "/contact",
  terminal: "/terminal",
};

function searchableText(item: ArticleMetadata | ProjectMetadata) {
  const projectFields = "category" in item ? [item.category, item.status ?? ""] : [];
  return [item.title, item.description, item.slug, ...item.tags, ...projectFields]
    .join(" ")
    .toLowerCase();
}

function listArticles(articles: ArticleMetadata[], query: string): TerminalOutputLine[] {
  const normalizedQuery = query.toLowerCase();
  const matches = normalizedQuery
    ? articles.filter((article) => searchableText(article).includes(normalizedQuery))
    : articles;

  if (matches.length === 0) return [];

  return matches.flatMap((article) => [
    { kind: "link" as const, text: `↗ ${article.title}`, href: `/blog/${article.slug}` },
    {
      kind: "muted" as const,
      text: `  ${article.date} · ${article.readTime} · ${article.tags.join(", ")}`,
    },
  ]);
}

function listProjects(projects: ProjectMetadata[], query: string): TerminalOutputLine[] {
  const normalizedQuery = query.toLowerCase();
  const matches = normalizedQuery
    ? projects.filter((project) => searchableText(project).includes(normalizedQuery))
    : projects;

  if (matches.length === 0) return [];

  return matches.flatMap((project) => [
    { kind: "link" as const, text: `↗ ${project.title}`, href: `/portfolio/${project.slug}` },
    {
      kind: "muted" as const,
      text: `  ${project.category} · ${project.status ?? "published"} · ${project.tags.join(", ")}`,
    },
  ]);
}

function resolveDirectory(
  currentDirectory: TerminalDirectory,
  target: string,
): TerminalDirectory | null {
  const normalized = target.trim().replace(/\/$/, "").toLowerCase();

  if (!normalized || normalized === "~" || normalized === "/") return "~";
  if (normalized === ".") return currentDirectory;
  if (normalized === "..") return "~";

  const directoryName = normalized.replace(/^(?:~\/|\.\.\/)/, "");
  if (
    directoryName === "articles" ||
    directoryName === "projects" ||
    directoryName === "contributions"
  ) {
    return `~/${directoryName}`;
  }

  return null;
}

function listDirectory(context: TerminalContext, directory: TerminalDirectory) {
  if (directory === "~") {
    return [
      { kind: "success" as const, text: "articles/" },
      { kind: "success" as const, text: "projects/" },
      { kind: "success" as const, text: "contributions/" },
    ];
  }

  if (directory === "~/articles") {
    return context.articles.map((article) => ({
      kind: "link" as const,
      text: `${article.slug}.md`,
      href: `/blog/${article.slug}`,
    }));
  }

  if (directory === "~/projects") {
    return context.projects.map((project) => ({
      kind: "link" as const,
      text: `${project.slug}/`,
      href: `/portfolio/${project.slug}`,
    }));
  }

  return [
    { kind: "link" as const, text: "dashboard", href: "/contributions" },
    { kind: "link" as const, text: "github.url", href: "https://github.com/Wichtowski" },
    { kind: "link" as const, text: "gitlab.url", href: "https://gitlab.com/Wichtowski1" },
  ];
}

export function getTerminalCompletions(input: string, context: TerminalContext): string[] {
  const trimmedStart = input.trimStart();
  const hasArgument = trimmedStart.includes(" ");
  const [rawCommand = "", ...argumentParts] = trimmedStart.split(/\s+/);
  const command = rawCommand.toLowerCase();
  const argument = argumentParts.join(" ").toLowerCase();

  if (!hasArgument) {
    return TERMINAL_COMMANDS.filter((candidate) => candidate.startsWith(command));
  }

  let candidates: string[] = [];
  if (command === "cd" || command === "ls") {
    candidates =
      context.currentDirectory === "~"
        ? ["articles/", "projects/", "contributions/"]
        : ["../", "../articles/", "../projects/", "../contributions/", "~/"];
  } else if (command === "cat") {
    if (context.currentDirectory === "~/articles") {
      candidates = context.articles.map((article) => `${article.slug}.md`);
    } else if (context.currentDirectory === "~/projects") {
      candidates = context.projects.map((project) => `${project.slug}/`);
    } else if (context.currentDirectory === "~/contributions") {
      candidates = ["dashboard", "github.url", "gitlab.url"];
    } else {
      candidates = ["florka", "sezamek"];
    }
  } else if (command === "open") {
    candidates = [
      ...Object.keys(routeTargets),
      ...context.articles.map((article) => article.slug),
      ...context.projects.map((project) => project.slug),
    ];
  }

  return candidates.filter((candidate) => candidate.toLowerCase().startsWith(argument));
}

function readDirectoryEntry(
  context: TerminalContext,
  entryName: string,
): TerminalOutputLine[] | null {
  const normalized = entryName.replace(/\.md$|\/$/, "").toLowerCase();

  if (context.currentDirectory === "~/articles") {
    const article = context.articles.find((item) => item.slug.toLowerCase() === normalized);
    if (!article) return null;
    return [
      { kind: "success", text: article.title },
      { kind: "text", text: article.description },
      { kind: "muted", text: `${article.date} · ${article.readTime} · ${article.tags.join(", ")}` },
      { kind: "link", text: "↗ read article", href: `/blog/${article.slug}` },
    ];
  }

  if (context.currentDirectory === "~/projects") {
    const project = context.projects.find((item) => item.slug.toLowerCase() === normalized);
    if (!project) return null;
    return [
      { kind: "success", text: project.title },
      { kind: "text", text: project.description },
      { kind: "muted", text: `${project.category} · ${project.tags.join(", ")}` },
      { kind: "link", text: "↗ inspect project", href: `/portfolio/${project.slug}` },
    ];
  }

  if (context.currentDirectory === "~/contributions") {
    return listDirectory(context, context.currentDirectory).filter(
      (line) => line.text.toLowerCase() === entryName.toLowerCase(),
    );
  }

  return null;
}

function openTarget(
  target: string,
  articles: ArticleMetadata[],
  projects: ProjectMetadata[],
): TerminalCommandResult {
  const normalized = target.toLowerCase();
  const route = routeTargets[normalized];
  if (route) {
    return {
      lines: [{ kind: "success", text: `opening ${route} ...` }],
      action: { type: "navigate", target: route },
    };
  }

  const article = articles.find((item) => item.slug.toLowerCase() === normalized);
  if (article) {
    const href = `/blog/${article.slug}`;
    return {
      lines: [{ kind: "success", text: `opening ${article.title} ...` }],
      action: { type: "navigate", target: href },
    };
  }

  const project = projects.find((item) => item.slug.toLowerCase() === normalized);
  if (project) {
    const href = `/portfolio/${project.slug}`;
    return {
      lines: [{ kind: "success", text: `opening ${project.title} ...` }],
      action: { type: "navigate", target: href },
    };
  }

  if (normalized === "github") {
    return {
      lines: [{ kind: "success", text: "opening github.com/Wichtowski ..." }],
      action: { type: "external", target: "https://github.com/Wichtowski" },
    };
  }

  return { lines: [{ kind: "error", text: `cannot open: ${target}` }] };
}

export function runTerminalCommand(
  rawInput: string,
  context: TerminalContext,
): TerminalCommandResult {
  const input = rawInput.trim();
  const [rawCommand = "", ...args] = input.split(/\s+/);
  const command = rawCommand.toLowerCase();
  const query = args.join(" ").trim();
  const localized = copy[context.language];

  if (!command) return { lines: [] };

  switch (command) {
    case "help":
    case "pomoc":
    case "?":
      return { lines: helpLines };
    case "about":
    case "whoami":
    case "o-mnie":
      return {
        lines: localized.about.map((text, index) => ({
          kind: index === 0 ? "success" : "text",
          text,
        })),
      };
    case "skills":
    case "stack":
      return { lines: skillsLines };
    case "pwd":
      return { lines: [{ kind: "text", text: context.currentDirectory }] };
    case "ls": {
      const targetDirectory = query
        ? resolveDirectory(context.currentDirectory, query)
        : context.currentDirectory;
      return targetDirectory
        ? { lines: listDirectory(context, targetDirectory) }
        : { lines: [{ kind: "error", text: `ls: cannot access '${query}'` }] };
    }
    case "cd": {
      const targetDirectory = resolveDirectory(context.currentDirectory, query);
      return targetDirectory
        ? {
            lines: [],
            action: { type: "change-directory", target: targetDirectory },
          }
        : { lines: [{ kind: "error", text: `cd: no such directory: ${query}` }] };
    }
    case "projects":
    case "portfolio": {
      const lines = listProjects(context.projects, query);
      return { lines: lines.length ? lines : [{ kind: "error", text: localized.empty }] };
    }
    case "articles":
    case "blog": {
      const lines = listArticles(context.articles, query);
      return { lines: lines.length ? lines : [{ kind: "error", text: localized.empty }] };
    }
    case "find":
    case "search":
    case "grep": {
      if (!query) return { lines: [{ kind: "error", text: "usage: find <query>" }] };
      const lines = [
        ...listProjects(context.projects, query),
        ...listArticles(context.articles, query),
      ];
      return { lines: lines.length ? lines : [{ kind: "error", text: localized.empty }] };
    }
    case "contributions":
    case "github":
      return {
        lines: [
          { kind: "success", text: "PUBLIC DEV ACTIVITY" },
          { kind: "link", text: "↗ Interactive contribution dashboard", href: "/contributions" },
          { kind: "link", text: "↗ github.com/Wichtowski", href: "https://github.com/Wichtowski" },
          {
            kind: "link",
            text: "↗ gitlab.com/Wichtowski1",
            href: "https://gitlab.com/Wichtowski1",
          },
        ],
      };
    case "contact":
      return {
        lines: [
          { kind: "success", text: "CONTACT" },
          {
            kind: "link",
            text: "↗ oskar.wichtowski3@gmail.com",
            href: "mailto:oskar.wichtowski3@gmail.com",
          },
          {
            kind: "link",
            text: "↗ LinkedIn",
            href: "https://www.linkedin.com/in/oskar-wichtowski/",
          },
          { kind: "link", text: "↗ Full contact page", href: "/contact" },
        ],
      };
    case "cat":
      if (query && context.currentDirectory !== "~") {
        const lines = readDirectoryEntry(context, query);
        return {
          lines: lines?.length
            ? lines
            : [{ kind: "error", text: `cat: ${query}: no such file or directory` }],
        };
      }

      if (query.toLowerCase() === "florka") {
        return {
          lines: [
            { kind: "success", text: "FLORKA" },
            { kind: "ascii", text: FLORKA },
          ],
        };
      }

      if (query.toLowerCase() === "sezamek") {
        return {
          lines: [
            { kind: "success", text: "SEZAMEK" },
            { kind: "ascii", text: SEZAMEK },
          ],
        };
      }

      return {
        lines: [
          { kind: "success", text: "FLORKA" },
          { kind: "ascii", text: FLORKA },
          { kind: "success", text: "SEZAMEK" },
          { kind: "ascii", text: SEZAMEK },
          { kind: "muted", text: "The cats say: ship it, but run the tests first." },
        ],
      };
    case "neofetch":
      return {
        lines: [
          {
            kind: "ascii",
            text: createNeofetch(context.projects.length, context.articles.length),
          },
        ],
      };
    case "history":
      return {
        lines: context.history.length
          ? context.history.map((entry, index) => ({
              kind: "muted",
              text: `${index + 1}  ${entry}`,
            }))
          : [{ kind: "muted", text: "history is empty" }],
      };
    case "date":
      return { lines: [{ kind: "text", text: new Date().toLocaleString(context.language) }] };
    case "theme":
      return {
        lines: [{ kind: "success", text: "switching color scheme ..." }],
        action: { type: "theme" },
      };
    case "open":
      return query
        ? openTarget(query, context.articles, context.projects)
        : { lines: [{ kind: "error", text: "usage: open <target>" }] };
    case "clear":
    case "cls":
      return { lines: [], action: { type: "clear" } };
    default: {
      const matches = [
        ...listProjects(context.projects, input),
        ...listArticles(context.articles, input),
      ];
      return {
        lines: matches.length
          ? [{ kind: "muted", text: `search results for '${input}':` }, ...matches]
          : [
              { kind: "error", text: localized.unknown(command) },
              { kind: "muted", text: localized.hint },
            ],
      };
    }
  }
}
