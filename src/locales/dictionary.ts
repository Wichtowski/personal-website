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
    selectionHint: string;
    groups: Array<{
      key:
        | "ai-ml"
        | "application-engineering"
        | "data-infrastructure"
        | "quality-workflow"
        | "environment";
      title: string;
      description?: string;
    }>;
    categories: Array<{
      key: string;
      group:
        | "ai-ml"
        | "application-engineering"
        | "data-infrastructure"
        | "quality-workflow"
        | "environment";
      title: string;
      icon:
        | "monitor"
        | "sparkles"
        | "server"
        | "layers"
        | "wrench"
        | "brain"
        | "scan"
        | "database"
        | "shield";
      summary?: string;
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
    onThisPage: string;
  };
  blog: {
    title: string;
    subtitle: string;
    readTime: string;
    published: string;
    backToArticles: string;
    noArticles: string;
    onThisPage: string;
  };
  engagement: {
    endorseSectionTitle: string;
    endorseBtn: string;
    endorsedBtn: string;
    endorseCount: string;
    endorseEmailPlaceholder: string;
    endorseEmailLabel: string;
    endorseEmailHint: string;
    endorseEmailError: string;
    endorseEmailAlreadyUsed: string;
    commentsSectionTitle: string;
    commentBtn: string;
    commenting: string;
    commentInputName: string;
    commentInputEmail: string;
    commentInputEmailHint: string;
    commentInputBody: string;
    commentValidationEmail: string;
    commentValidationBody: string;
    commentSuccess: string;
    noComments: string;
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
    rollBreakdown: string;
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
      bio: "A versatile tech professional blending Artificial Intelligence capabilities with robust software engineering and rigid Quality Assurance standards. I design intelligent agents, craft modern web experiences, and build production-ready test suites.",
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
      selectionHint: "Select technologies, then use Explore to see matching projects and articles.",
      groups: [
        {
          key: "ai-ml",
          title: "AI & Machine Learning",
        },
        {
          key: "application-engineering",
          title: "Application Engineering",
        },
        {
          key: "data-infrastructure",
          title: "Data & Infrastructure",
        },
        {
          key: "quality-workflow",
          title: "Quality & Workflow",
        },
        {
          key: "environment",
          title: "Environment",
        },
      ],
      categories: [
        {
          key: "llms",
          group: "ai-ml",
          title: "LLMs",
          icon: "sparkles",
        },
        {
          key: "computer-vision",
          group: "ai-ml",
          title: "Computer Vision",
          icon: "scan",
        },
        {
          key: "deep-learning",
          group: "ai-ml",
          title: "Deep Learning",
          icon: "brain",
        },
        {
          key: "data-science",
          group: "ai-ml",
          title: "Data Science",
          icon: "database",
        },
        {
          key: "backend",
          group: "application-engineering",
          title: "Backend",
          icon: "server",
        },
        {
          key: "storage",
          group: "data-infrastructure",
          title: "Storage",
          icon: "database",
        },
        {
          key: "retrieval",
          group: "ai-ml",
          title: "Retrieval",
          icon: "scan",
        },
        {
          key: "languages-runtimes",
          group: "application-engineering",
          title: "Languages & Runtimes",
          icon: "monitor",
        },
        {
          key: "developer-tools-platforms",
          group: "application-engineering",
          title: "Developer Tools & Platforms",
          icon: "wrench",
        },
        {
          key: "frontend",
          group: "application-engineering",
          title: "Frontend",
          icon: "layers",
        },
        {
          key: "quality-delivery",
          group: "quality-workflow",
          title: "Quality & Delivery",
          icon: "shield",
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
      viewProject: "View Project",
      backToProjects: "Back to Projects",
      onThisPage: "On this page",
    },
    blog: {
      title: "Insight & Articles",
      subtitle:
        "My thoughts on artificial intelligence, software design patterns, and rigorous testing methodologies.",
      readTime: "min read",
      published: "Published on",
      backToArticles: "Back to Articles",
      noArticles: "No articles published yet. Check back soon!",
      onThisPage: "On this page",
    },
    engagement: {
      endorseSectionTitle: "Endorse this",
      endorseBtn: "Endorse",
      endorsedBtn: "Endorsed",
      endorseCount: "endorsements",
      endorseEmailPlaceholder: "your@email.com",
      endorseEmailLabel: "Enter your email to endorse",
      endorseEmailHint: "Email is required to prevent spam and is never displayed",
      endorseEmailError: "Please enter a valid email",
      endorseEmailAlreadyUsed: "This email has already endorsed this content",
      commentsSectionTitle: "Comments",
      commentBtn: "Post Comment",
      commenting: "Posting...",
      commentInputName: "Name or Username (optional, to hide your email)",
      commentInputEmail: "Email (required, never shown to public)",
      commentInputEmailHint:
        "Email is required to prevent spam. It is never displayed if a username is provided.",
      commentInputBody: "Your comment",
      commentValidationEmail: "Please provide a valid email.",
      commentValidationBody: "Comment cannot be empty.",
      commentSuccess: "Comment posted successfully!",
      noComments: "No comments yet. Be the first to share your thoughts!",
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
      rollBreakdown: "Dice values",
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
      idleTrack: "mruczenia moich kotów",
      idleArtist: "Sezamek & Florka",
    },
    techStack: {
      eyebrow: "Wybrany stack",
      heading: "Narzędzia, których używam",
      selectionHint:
        "Wybierz technologie, potem użyj Explore, żeby zobaczyć pasujące projekty i artykuły.",
      groups: [
        {
          key: "ai-ml",
          title: "AI i Machine Learning",
        },
        {
          key: "application-engineering",
          title: "Inżynieria aplikacji",
        },
        {
          key: "data-infrastructure",
          title: "Dane i infrastruktura",
        },
        {
          key: "quality-workflow",
          title: "Jakość i workflow",
        },
        {
          key: "environment",
          title: "Środowisko",
        },
      ],
      categories: [
        {
          key: "llms",
          group: "ai-ml",
          title: "LLM-y",
          icon: "sparkles",
        },
        {
          key: "computer-vision",
          group: "ai-ml",
          title: "Widzenie komputerowe",
          icon: "scan",
        },
        {
          key: "deep-learning",
          group: "ai-ml",
          title: "Deep Learning",
          icon: "brain",
        },
        {
          key: "data-science",
          group: "ai-ml",
          title: "Data Science",
          icon: "database",
        },
        {
          key: "backend",
          group: "application-engineering",
          title: "Backend",
          icon: "server",
        },
        {
          key: "storage",
          group: "data-infrastructure",
          title: "Bazy i Storage",
          icon: "database",
        },
        {
          key: "retrieval",
          group: "ai-ml",
          title: "Retrieval",
          icon: "scan",
        },
        {
          key: "languages-runtimes",
          group: "application-engineering",
          title: "Języki i środowiska uruchomieniowe",
          icon: "monitor",
        },
        {
          key: "developer-tools-platforms",
          group: "application-engineering",
          title: "Narzędzia deweloperskie i platformy",
          icon: "wrench",
        },
        {
          key: "frontend",
          group: "application-engineering",
          title: "Frontend",
          icon: "layers",
        },
        {
          key: "quality-delivery",
          group: "quality-workflow",
          title: "Jakość i Delivery",
          icon: "shield",
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
      viewProject: "Zobacz projekt",
      backToProjects: "Powrót do projektów",
      onThisPage: "Na tej stronie",
    },
    blog: {
      title: "Artykuły i Przemyślenia",
      subtitle:
        "Moje refleksje na temat sztucznej inteligencji, wzorców projektowych i rygorystycznych metodologii testowania.",
      readTime: "min czytania",
      published: "Opublikowano",
      backToArticles: "Powrót do artykułów",
      noArticles: "Brak opublikowanych artykułów. Zajrzyj tu wkrótce!",
      onThisPage: "Na tej stronie",
    },
    engagement: {
      endorseSectionTitle: "Rekomendacja",
      endorseBtn: "Rekomenduj",
      endorsedBtn: "Rekomendowano",
      endorseCount: "rekomendacji",
      endorseEmailPlaceholder: "twoj@email.com",
      endorseEmailLabel: "Wpisz email, aby polecić",
      endorseEmailHint:
        "Email jest wymagany do ochrony przed spamem i nigdy nie jest pokazywany publicznie",
      endorseEmailError: "Podaj prawidłowy email",
      endorseEmailAlreadyUsed: "Ten email został już użyty do polecenia tego wpisu",
      commentsSectionTitle: "Komentarze",
      commentBtn: "Dodaj komentarz",
      commenting: "Wysyłanie...",
      commentInputName: "Nazwa lub pseudonim (opcjonalne, aby ukryć email)",
      commentInputEmail: "Email (wymagany, nigdy nie jest upubliczniany)",
      commentInputEmailHint:
        "Adres email jest wymagany do ochrony przed spamem. Nigdy nie będzie wyświetlany, jeśli podasz pseudonim.",
      commentInputBody: "Twój komentarz",
      commentValidationEmail: "Podaj prawidłowy adres email.",
      commentValidationBody: "Komentarz nie może być pusty.",
      commentSuccess: "Pomyślnie dodano komentarz!",
      noComments: "Brak komentarzy. Bądź pierwszą osobą, która skomentuje!",
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
      rollBreakdown: "Wyniki kostek",
      rollPending: "Liczenie wyniku...",
    },
    theme: {
      light: "Jasny",
      dark: "Ciemny",
      system: "Systemowy",
    },
  },
};
