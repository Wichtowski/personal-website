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
      icon: "monitor" | "sparkles" | "server" | "layers" | "wrench" | "brain" | "scan" | "database";
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
  notFound: {
    ticker: string;
    eyebrow: string;
    title: string;
    description: string;
    backHome: string;
    rollLabel: string;
    rollPending: string;
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
      role: "AI Engineer / Software Engineer / QA Specialist",
      bio: "An versatile tech professional blending Artificial Intelligence capabilities with robust software engineering and rigid Quality Assurance standards. I design intelligent agents, craft modern web experiences, and build production-ready test suites.",
      ctaPrimary: "View Projects",
      ctaSecondary: "Get in Touch",
      statusActive: "Available for freelance & full-time roles",
      listeningTo: "Listening to",
      lastPlayed: "Last played",
      nothingPlaying: "Nothing playing",
      lastFmLabel: "Last.fm",
      idleTrack: "purring of my cats",
      idleArtist: "Sezamek & Florka",
    },
    techStack: {
      eyebrow: "tech stack",
      heading: "Tools I actually use",
      categories: [
        {
          key: "llms",
          title: "LLMs",
          summary: "The models, assistants, and speech tooling I reach for first.",
          icon: "sparkles",
        },
        {
          key: "computer-vision",
          title: "Computer Vision",
          summary: "Object detection, annotation, and applied vision work.",
          icon: "scan",
        },
        {
          key: "deep-learning",
          title: "Deep Learning",
          summary: "Model development, experimentation, and fine-tuning.",
          icon: "brain",
        },
        {
          key: "data-science",
          title: "Data Science",
          summary: "Numerical and tabular analysis tools.",
          icon: "database",
        },
        {
          key: "backend-storage",
          title: "Backend & Storage",
          summary: "APIs, workers, persistence, and infra that scales.",
          icon: "server",
        },
        {
          key: "frontend",
          title: "Frontend",
          summary: "Interfaces, app shells, and build tooling I ship with.",
          icon: "layers",
        },
        {
          key: "quality-delivery",
          title: "Quality & Delivery",
          summary: "Testing, static analysis, and release confidence.",
          icon: "wrench",
        },
        {
          key: "languages-tools",
          title: "Languages & Tools",
          summary: "The daily drivers behind the keyboard and in automation.",
          icon: "wrench",
        },
        {
          key: "current-os",
          title: "Current OS",
          summary: "The desktop setup I live in every day.",
          icon: "monitor",
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
    notFound: {
      ticker: "404 Error",
      eyebrow: "Lost route",
      title: "This page rolled into the void.",
      description:
        "The 404 is still here, but the destination is not. Grab the dice, throw them around and head back home.",
      backHome: "Back home",
      rollLabel: "Roll total",
      rollPending: "Counting the result...",
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
      role: "AI Engineer / Software Engineer / Specjalista QA",
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
          key: "computer-vision",
          title: "Widzenie komputerowe",
          summary: "Detekcja obiektów, anotacja i praktyczne projekty CV.",
          icon: "scan",
        },
        {
          key: "deep-learning",
          title: "Deep Learning",
          summary: "Budowanie, eksperymentowanie i fine-tuning modeli.",
          icon: "brain",
        },
        {
          key: "data-science",
          title: "Data Science",
          summary: "Narzędzia do analizy numerycznej i tabelarycznej.",
          icon: "database",
        },
        {
          key: "llms",
          title: "LLM-y",
          summary: "Modele, asystenci i narzędzia głosowe, po które sięgam jako pierwszych.",
          icon: "sparkles",
        },
        {
          key: "backend-storage",
          title: "Backend i Bazy",
          summary: "API, workerów, zapis danych i infrastruktura pod skalę.",
          icon: "server",
        },
        {
          key: "frontend",
          title: "Frontend",
          summary: "Interfejsy, app shelle i narzędzia, z którymi dowożę UI.",
          icon: "layers",
        },
        {
          key: "quality-delivery",
          title: "Jakość i Delivery",
          summary: "Testy, statyczna analiza i pewność przy wdrożeniach.",
          icon: "wrench",
        },
        {
          key: "languages-tools",
          title: "Języki i Narzędzia",
          summary: "Codzienne narzędzia spod klawiatury i automatyzacji.",
          icon: "wrench",
        },
        {
          key: "current-os",
          title: "Używany OS",
          summary: "Codzienne środowisko, w którym pracuję.",
          icon: "monitor",
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
    notFound: {
      ticker: "Błąd 404",
      eyebrow: "Zgubiona ścieżka",
      title: "Ta strona poturlała się w pustkę.",
      description:
        "Kod 404 nadal tu jest, ale celu już nie ma. Złap kości, porzucaj nimi i wróć na stronę główną.",
      backHome: "Wróć do strony głównej",
      rollLabel: "Suma rzutu",
      rollPending: "Liczenie wyniku...",
    },
    theme: {
      light: "Jasny",
      dark: "Ciemny",
      system: "Systemowy",
    },
  },
};
