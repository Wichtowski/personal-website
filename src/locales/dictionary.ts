export type Language = "en" | "pl";

export interface TranslationDict {
  nav: {
    home: string;
    portfolio: string;
    articles: string;
    contributions: string;
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
    catsLoading: string;
  };
  techStack: {
    eyebrow: string;
    heading: string;
    selectionHint: string;
    toolCount: string;
    tabListLabel: string;
    exploreLabel: string;
    tabs: Array<{
      key: "frontend" | "backend" | "ai-data" | "platform-quality";
      title: string;
      description: string;
    }>;
    subcategories: Array<{
      key: string;
      title: string;
    }>;
  };
  github: {
    title: string;
    latestActivity: string;
    activityTabsLabel: string;
    privateActivity: string;
    publicActivity: string;
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
    personalGithubAccount: string;
    workGithubAccount: string;
    gitlabAccount: string;
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
      contributions: "Contributions",
      contact: "Contact",
    },
    hero: {
      greeting: "Hi, I'm",
      role: "AI Engineer / Software Engineer / QA Specialist",
      bio: "I build useful things with AI, thoughtful software, and a healthy obsession with quality. From intelligent agents and polished web experiences to dependable test automation, I enjoy turning ambitious ideas into products people can trust.",
      ctaPrimary: "View Projects",
      ctaSecondary: "Get in Touch",
      statusActive: "Available for freelance & full-time roles",
      listeningTo: "Listening to",
      lastPlayed: "Last played",
      nothingPlaying: "Nothing playing",
      lastFmLabel: "Last.fm",
      idleTrack: "purring of my cats",
      idleArtist: "Sezamek & Florka",
      catsLoading: "Waking up the cats...",
    },
    techStack: {
      eyebrow: "tech stack",
      heading: "Tools I actually use",
      selectionHint: "Shiny items are the ones I use on daily basis",
      toolCount: "tools",
      tabListLabel: "Technology areas",
      exploreLabel: "Explore",
      tabs: [
        {
          key: "frontend",
          title: "Frontend",
          description: "Interfaces, web runtimes, styling, and cross-platform experiences.",
        },
        {
          key: "backend",
          title: "Backend",
          description: "APIs, services, persistence, and asynchronous workloads.",
        },
        {
          key: "ai-data",
          title: "AI & Data",
          description: "Applied ML, model APIs, computer vision, and retrieval systems.",
        },
        {
          key: "platform-quality",
          title: "Platform & Quality",
          description:
            "Cloud infrastructure, developer tooling, testing, delivery, and observability.",
        },
      ],
      subcategories: [
        { key: "frontend-languages-frameworks", title: "Languages & frameworks" },
        { key: "build-styling", title: "Build, styling & design" },
        { key: "desktop", title: "Desktop & native" },
        {
          key: "backend-languages-apis-frameworks",
          title: "Languages, APIs & frameworks",
        },
        { key: "data-storage", title: "Data & storage" },
        { key: "jobs-messaging", title: "Jobs & messaging" },
        { key: "models-apis", title: "Models & APIs" },
        { key: "computer-vision", title: "Computer vision" },
        { key: "ml-data", title: "ML & data science" },
        { key: "retrieval", title: "Retrieval" },
        { key: "speech", title: "Speech & audio" },
        {
          key: "infrastructure-runtime",
          title: "Cloud, runtime & infrastructure",
        },
        { key: "developer-tooling", title: "Developer tooling" },
        { key: "browser-e2e", title: "Browser & E2E" },
        { key: "unit-code-quality", title: "Unit & code quality" },
        { key: "delivery-observability", title: "Delivery & observability" },
      ],
    },
    github: {
      title: "Contributions",
      latestActivity: "Latest GitHub Contributions",
      activityTabsLabel: "Contribution visibility",
      privateActivity: "Private",
      publicActivity: "Public",
      lastPushedRepo: "Last Public Repo Pushed To",
      pushedAt: "Pushed",
      viewOnGithub: "View on GitHub",
      statsTitle: "GitHub Contributions Metrics",
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
      personalGithubAccount: "GitHub - Personal",
      workGithubAccount: "GitHub - Work",
      gitlabAccount: "GitLab",
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
      contributions: "Aktywność",
      contact: "Kontakt",
    },
    hero: {
      greeting: "Cześć, jestem",
      role: "AI Engineer / Software Engineer / Specjalista QA",
      bio: "Tworzę przydatne rozwiązania z AI i dopracowane oprogramowanie, zawsze z dużą dbałością o jakość. Od inteligentnych agentów i nowoczesnych aplikacji internetowych po niezawodną automatyzację testów - najbardziej lubię zamieniać ambitne pomysły w produkty, którym można zaufać.",
      ctaPrimary: "Zobacz Projekty",
      ctaSecondary: "Skontaktuj się",
      statusActive: "Dostępny na zlecenia i pełen etat",
      listeningTo: "Słucham",
      lastPlayed: "Ostatnio słuchane",
      nothingPlaying: "Nic nie gra",
      lastFmLabel: "Last.fm",
      idleTrack: "mruczenia moich kotów",
      idleArtist: "Sezamek & Florka",
      catsLoading: "Budzenie kotów...",
    },
    techStack: {
      eyebrow: "Wybrany stack",
      heading: "Narzędzia, których używam",
      selectionHint: "Błyszczące pozycje to te, których używam na co dzień.",
      toolCount: "narzędzi",
      tabListLabel: "Obszary technologiczne",
      exploreLabel: "Odkrywaj",
      tabs: [
        {
          key: "frontend",
          title: "Frontend",
          description: "Interfejsy, środowiska webowe, stylowanie i aplikacje wieloplatformowe.",
        },
        {
          key: "backend",
          title: "Backend",
          description: "API, serwisy, przechowywanie danych i zadania asynchroniczne.",
        },
        {
          key: "ai-data",
          title: "AI i dane",
          description: "Praktyczny ML, API modeli, widzenie komputerowe i systemy wyszukiwania.",
        },
        {
          key: "platform-quality",
          title: "Platforma i jakość",
          description:
            "Infrastruktura chmurowa, narzędzia deweloperskie, testy, delivery i obserwowalność.",
        },
      ],
      subcategories: [
        { key: "frontend-languages-frameworks", title: "Języki i frameworki" },
        { key: "build-styling", title: "Build, stylowanie i design" },
        { key: "desktop", title: "Desktop i aplikacje natywne" },
        {
          key: "backend-languages-apis-frameworks",
          title: "Języki, API i frameworki",
        },
        { key: "data-storage", title: "Dane i storage" },
        { key: "jobs-messaging", title: "Zadania i komunikacja" },
        { key: "models-apis", title: "Modele i API" },
        { key: "computer-vision", title: "Widzenie komputerowe" },
        { key: "ml-data", title: "ML i data science" },
        { key: "retrieval", title: "Retrieval" },
        { key: "speech", title: "Mowa i audio" },
        {
          key: "infrastructure-runtime",
          title: "Chmura, runtime i infrastruktura",
        },
        { key: "developer-tooling", title: "Narzędzia deweloperskie" },
        { key: "browser-e2e", title: "Przeglądarka i E2E" },
        { key: "unit-code-quality", title: "Testy jednostkowe i jakość kodu" },
        { key: "delivery-observability", title: "Delivery i obserwowalność" },
      ],
    },
    github: {
      title: "Aktywność deweloperska",
      latestActivity: "Najnowsza aktywność",
      activityTabsLabel: "Widoczność aktywności",
      privateActivity: "Prywatne",
      publicActivity: "Publiczne",
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
      personalGithubAccount: "GitHub - konto prywatne",
      workGithubAccount: "GitHub - konto służbowe",
      gitlabAccount: "GitLab",
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
