export type Language = "en" | "pl";

export interface TranslationDict {
  nav: {
    home: string;
    portfolio: string;
    articles: string;
    github: string;
    contact: string;
  };
  hero: {
    greeting: string;
    role: string;
    bio: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statusActive: string;
    listeningTo: string;
    lastPlayed: string;
    nothingPlaying: string;
    lastFmLabel: string;
    idleTrack: string;
    idleArtist: string;
  };
  techStack: {
    eyebrow: string;
    heading: string;
    categories: Array<{
      key: string;
      title: string;
      summary: string;
      icon: "monitor" | "sparkles" | "server" | "layers" | "wrench";
      items: string[];
    }>;
  };
  github: {
    title: string;
    subtitle: string;
    latestActivity: string;
    lastPushedRepo: string;
    pushedAt: string;
    viewOnGithub: string;
    statsTitle: string;
    stars: string;
    repos: string;
    followers: string;
    following: string;
    workAccountInput: string;
    workAccountLabel: string;
    workAccountBtn: string;
    noRecentActivity: string;
    loading: string;
    error: string;
    totalCommits: string;
    totalPRs: string;
    totalIssues: string;
    primaryAccountLabel: string;
    workAccountTag: string;
  };
  portfolio: {
    title: string;
    subtitle: string;
    all: string;
    ai: string;
    dev: string;
    qa: string;
    viewProject: string;
    backToProjects: string;
  };
  blog: {
    title: string;
    subtitle: string;
    readTime: string;
    published: string;
    backToArticles: string;
    noArticles: string;
  };
  contact: {
    title: string;
    subtitle: string;
    emailMe: string;
    downloadCv: string;
    cvConfirm: string;
    viewSocials: string;
  };
  theme: {
    light: string;
    dark: string;
    system: string;
  };
}

export const dictionaries: Record<Language, TranslationDict> = {
  en: {
    nav: {
      home: "Home",
      portfolio: "Portfolio",
      articles: "Articles",
      github: "Activity",
      contact: "Contact",
    },
    hero: {
      greeting: "Hi, I'm",
      role: "AI Engineer / Fullstack Developer / QA Specialist",
      bio: "An versatile tech professional blending Artificial Intelligence capabilities with robust software engineering and rigid Quality Assurance standards. I design intelligent agents, craft modern web experiences, and build production-ready test suites.",
      ctaPrimary: "View Projects",
      ctaSecondary: "Get in Touch",
      statusActive: "Available for freelance & full-time roles",
      listeningTo: "Listening to",
      lastPlayed: "Last played",
      nothingPlaying: "Nothing playing",
      lastFmLabel: "Last.fm",
      idleTrack: "purring of my cat",
      idleArtist: "Sezamek & Florka",
    },
    techStack: {
      eyebrow: "Selected stack",
      heading: "Tools I actually use",
      categories: [
        {
          key: "current-os",
          title: "Current OS",
          summary: "The desktop setup I live in every day.",
          icon: "monitor",
          items: ["EndeavourOS", "Ubuntu", "Windows"],
        },
        {
          key: "ai-data",
          title: "AI & Data",
          summary: "Experimentation, models, and data tooling.",
          icon: "sparkles",
          items: ["ChatGPT", "Gemini", "Mistral AI", "Qwen", "PyTorch", "NumPy", "Pandas"],
        },
        {
          key: "backend-storage",
          title: "Backend & Storage",
          summary: "APIs, persistence, and infra that scales.",
          icon: "server",
          items: ["Postgres", "MongoDB", "Redis", "SurrealDB", "DynamoDB", "AWS", "Azure", "GCP"],
        },
        {
          key: "frontend",
          title: "Frontend",
          summary: "Interfaces and build tooling I ship with.",
          icon: "layers",
          items: ["React", "React Native", "Next.js", "Vite", "Angular", "Bun"],
        },
        {
          key: "quality-delivery",
          title: "Quality & Delivery",
          summary: "Testing, coverage, and release confidence.",
          icon: "wrench",
          items: ["Playwright", "Cypress", "Vitest", "Jest", "Pytest", "Testing Library", "Snyk"],
        },
        {
          key: "languages-tools",
          title: "Languages & Tools",
          summary: "The daily drivers behind the keyboard.",
          icon: "wrench",
          items: [
            "TypeScript",
            "Python",
            "FastAPI",
            "Pydantic",
            "Bash",
            "Git",
            "Docker",
            "Figma",
            "Cursor",
          ],
        },
      ],
    },
    github: {
      title: "Real-time WorkStream",
      subtitle: "My latest development activity, powered directly by public GitHub APIs.",
      latestActivity: "Latest GitHub Action",
      lastPushedRepo: "Last Public Repo Pushed To",
      pushedAt: "Pushed",
      viewOnGithub: "View on GitHub",
      statsTitle: "GitHub Pulse Metrics",
      stars: "Stars Earned",
      repos: "Public Repos",
      followers: "Followers",
      following: "Following",
      workAccountInput: "Enter secondary GitHub username (e.g. Work/Alt account)...",
      workAccountLabel: "Work/Secondary Account Stats",
      workAccountBtn: "Merge Stats",
      noRecentActivity: "No recent public events found on GitHub.",
      loading: "Fetching live GitHub metrics...",
      error: "Could not load GitHub stats. Please try again later.",
      totalCommits: "Commits",
      totalPRs: "PRs",
      totalIssues: "QA Issues",
      primaryAccountLabel: "Primary Account",
      workAccountTag: "Work Account",
    },
    portfolio: {
      title: "Portfolio Showcase",
      subtitle:
        "Selected works written in MDX. Explore project documentation, tech specs, and architectural details.",
      all: "All Projects",
      ai: "AI & ML",
      dev: "Software Eng",
      qa: "QA & Testing",
      viewProject: "Read Case Study",
      backToProjects: "Back to Projects",
    },
    blog: {
      title: "Insight & Articles",
      subtitle:
        "My thoughts on artificial intelligence, software design patterns, and rigorous testing methodologies.",
      readTime: "min read",
      published: "Published on",
      backToArticles: "Back to Articles",
      noArticles: "No articles published yet. Check back soon!",
    },
    contact: {
      title: "Let's Build Something Great",
      subtitle:
        "Looking for an engineer who can connect AI models, write clean code, and guarantee software quality? Let's connect.",
      emailMe: "Email Me Directly",
      downloadCv: "Download CV",
      cvConfirm: "Do you want to download my CV now?",
      viewSocials: "Connect on Socials",
    },
    theme: {
      light: "Light",
      dark: "Dark",
      system: "System",
    },
  },
  pl: {
    nav: {
      home: "Start",
      portfolio: "Portfolio",
      articles: "Artykuły",
      github: "Aktywność",
      contact: "Kontakt",
    },
    hero: {
      greeting: "Cześć, jestem",
      role: "AI Engineer / Fullstack Developer / Specjalista QA",
      bio: "Wszechstronny inżynier łączący możliwości sztucznej inteligencji z solidną inżynierią oprogramowania i rygorystycznymi standardami zapewnienia jakości. Projektuję inteligentne agenty, tworzę nowoczesne strony oraz buduję produkcyjne zestawy testów automatycznych.",
      ctaPrimary: "Zobacz Projekty",
      ctaSecondary: "Skontaktuj się",
      statusActive: "Dostępny na zlecenia i pełen etat",
      listeningTo: "Słucham",
      lastPlayed: "Ostatnio słuchane",
      nothingPlaying: "Nic nie gra",
      lastFmLabel: "Last.fm",
      idleTrack: "mruczenia mojego kota",
      idleArtist: "Sezamek & Florka",
    },
    techStack: {
      eyebrow: "Wybrany stack",
      heading: "Narzędzia, których używam",
      categories: [
        {
          key: "current-os",
          title: "Używany OS",
          summary: "Codzienne środowisko, w którym pracuję.",
          icon: "monitor",
          items: ["EndeavourOS", "Ubuntu", "Windows"],
        },
        {
          key: "ai-data",
          title: "AI i Dane",
          summary: "Eksperymenty, modele i narzędzia danych.",
          icon: "sparkles",
          items: ["ChatGPT", "Gemini", "Mistral AI", "Qwen", "PyTorch", "NumPy", "Pandas"],
        },
        {
          key: "backend-storage",
          title: "Backend i Bazy",
          summary: "API, zapis danych i infrastruktura pod skalę.",
          icon: "server",
          items: ["Postgres", "MongoDB", "Redis", "SurrealDB", "DynamoDB", "AWS", "Azure", "GCP"],
        },
        {
          key: "frontend",
          title: "Frontend",
          summary: "Interfejsy i narzędzia, z którymi dowożę UI.",
          icon: "layers",
          items: ["React", "React Native", "Next.js", "Vite", "Angular", "Bun"],
        },
        {
          key: "quality-delivery",
          title: "Jakość i Delivery",
          summary: "Testy, pokrycie i pewność przy wdrożeniach.",
          icon: "wrench",
          items: ["Playwright", "Cypress", "Vitest", "Jest", "Pytest", "Testing Library", "Snyk"],
        },
        {
          key: "languages-tools",
          title: "Języki i Narzędzia",
          summary: "Codzienne narzędzia spod klawiatury.",
          icon: "wrench",
          items: [
            "TypeScript",
            "Python",
            "FastAPI",
            "Pydantic",
            "Bash",
            "Git",
            "Docker",
            "Figma",
            "Cursor",
          ],
        },
      ],
    },
    github: {
      title: "Aktywność deweloperska",
      subtitle:
        "Moje najnowsze działania na GitHub, pobierane bezpośrednio przez publiczne API. Bezserwerowe i na żywo.",
      latestActivity: "Ostatnie zdarzenie",
      lastPushedRepo: "Ostatnie repozytoria z wypchniętymi zmianami",
      pushedAt: "Wypchnięto",
      viewOnGithub: "Zobacz na GitHubie",
      statsTitle: "Statystyki GitHub",
      stars: "Zdobyte gwiazdki",
      repos: "Publiczne repozytoria",
      followers: "Obserwujący",
      following: "Obserwuje",
      workAccountInput: "Wpisz drugą nazwę użytkownika (np. konto firmowe)...",
      workAccountLabel: "Statystyki konta dodatkowego",
      workAccountBtn: "Połącz statystyki",
      noRecentActivity: "Nie znaleziono ostatniej aktywności na GitHubie.",
      loading: "Pobieranie statystyk GitHub...",
      error: "Nie udało się pobrać statystyk GitHub. Spróbuj ponownie później.",
      totalCommits: "Commity",
      totalPRs: "PR-y",
      totalIssues: "Zgłoszenia QA",
      primaryAccountLabel: "Konto Główne",
      workAccountTag: "Konto Pracownicze",
    },
    portfolio: {
      title: "Moje portfolio",
      subtitle:
        "Wybrane projekty opisane w formacie MDX. Przeczytaj studia przypadków, specyfikacje techniczne i szczegóły architektury.",
      all: "Wszystkie projekty",
      ai: "Sztuczna Inteligencja",
      dev: "Oprogramowanie",
      qa: "QA i Testy",
      viewProject: "Przeczytaj case study",
      backToProjects: "← Powrót do projektów",
    },
    blog: {
      title: "Artykuły i Przemyślenia",
      subtitle:
        "Moje refleksje na temat sztucznej inteligencji, wzorców projektowych i rygorystycznych metodologii testowania.",
      readTime: "min czytania",
      published: "Opublikowano",
      backToArticles: "← Powrót do artykułów",
      noArticles: "Brak opublikowanych artykułów. Zajrzyj tu wkrótce!",
    },
    contact: {
      title: "Zbudujmy coś niezwykłego",
      subtitle:
        "Szukasz inżyniera, który połączy modele AI, napisze czysty kod i zagwarantuje jakość oprogramowania? Skontaktuj się ze mną.",
      emailMe: "Napisz bezpośrednio",
      downloadCv: "Pobierz CV",
      cvConfirm: "Czy chcesz teraz pobrać moje CV?",
      viewSocials: "Znajdź mnie w mediach społecznościowych",
    },
    theme: {
      light: "Jasny",
      dark: "Ciemny",
      system: "Systemowy",
    },
  },
};
