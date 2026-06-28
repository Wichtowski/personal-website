import type { ComponentType } from "react";
import {
  SiBun,
  SiCelery,
  SiCloudflareworkers,
  SiCloudflare,
  SiDocker,
  SiFastapi,
  SiFigma,
  SiGit,
  SiGo,
  SiGooglegemini,
  SiHuggingface,
  SiMistralai,
  SiMinio,
  SiMongodb,
  SiNextdotjs,
  SiNumpy,
  SiOpenai,
  SiPandas,
  SiPostgresql,
  SiPydantic,
  SiPytorch,
  SiPython,
  SiRabbitmq,
  SiReact,
  SiRedis,
  SiRust,
  SiSnyk,
  SiSurrealdb,
  SiSqlalchemy,
  SiTailwindcss,
  SiTauri,
  SiTypescript,
  SiVite,
  SiElectron,
  SiGrafana,
  SiOpencv,
  SiJest,
  SiVitest,
  SiCypress,
  SiPytest,
  SiTestinglibrary,
  SiRuff,
  SiYolo,
  SiGithubactions,
} from "react-icons/si";
import {
  Bot,
  Boxes,
  CloudCog,
  Code2,
  Crosshair,
  FileCode2,
  Gauge,
  LaptopMinimal,
  Mic,
  SearchCheck,
  Server,
  Sigma,
  SquareMousePointer,
  Terminal,
  TestTube2,
  ChartNoAxesCombined,
  BrainCircuit,
  Zap,
  Wrench,
} from "lucide-react";
import { OpenRouterIcon } from "@/components/icons/openrouter-icon";
import { QdrantIcon } from "@/components/icons/qdrant-icon";
import { GiArtificialHive, GiThorHammer } from "react-icons/gi";
import { FaAws } from "react-icons/fa";
import { LuBrainCircuit } from "react-icons/lu";

export type TechStackIconComponent = ComponentType<{ size?: number; className?: string }>;

export type TechStackItem = {
  label: string;
  icon: TechStackIconComponent;
  iconSize?: number;
  iconClassName?: string;
};

export type TechStackCategoryLayout = {
  lightClassName: string;
  darkClassName: string;
  lightAccentClassName: string;
  darkAccentClassName: string;
};

export type TechStackGroupKey =
  | "ai-ml"
  | "application-engineering"
  | "data-infrastructure"
  | "quality-workflow"
  | "environment";

export type TechStackGroup = {
  key: TechStackGroupKey;
  title: string;
  icon: TechStackIconComponent;
};

export type TechStackSection = {
  key: string;
  group: TechStackGroupKey;
  icon: TechStackIconComponent;
  layout: TechStackCategoryLayout;
  items: readonly TechStackItem[];
};

export const TECH_STACK_GROUPS: readonly TechStackGroup[] = [
  {
    key: "ai-ml",
    title: "AI & Machine Learning",
    icon: GiArtificialHive,
  },
  {
    key: "application-engineering",
    title: "Application Engineering",
    icon: Code2,
  },
  {
    key: "data-infrastructure",
    title: "Data & Infrastructure",
    icon: CloudCog,
  },
  {
    key: "quality-workflow",
    title: "Quality & Workflow",
    icon: Gauge,
  },
  {
    key: "environment",
    title: "Environment",
    icon: LaptopMinimal,
  },
];

export const TECH_STACK_SECTIONS: readonly TechStackSection[] = [
  {
    key: "computer-vision",
    group: "ai-ml",
    icon: Crosshair,
    layout: {
      lightClassName:
        "lg:col-span-6 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))]",
      darkClassName:
        "lg:col-span-6 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_34%),linear-gradient(180deg,rgba(10,10,14,0.98),rgba(6,6,9,0.96))]",
      lightAccentClassName: "from-sky-500/15 via-cyan-500/8 to-transparent",
      darkAccentClassName: "from-sky-500/20 via-cyan-500/10 to-transparent",
    },
    items: [
      { label: "YOLO", icon: SiYolo, iconClassName: "text-[#FFCB05]" },
      { label: "OpenCV", icon: SiOpencv, iconClassName: "text-[#5C3EE8]" },
      { label: "Faster R-CNN", icon: Boxes, iconClassName: "text-sky-400" },
      { label: "RCNN", icon: SearchCheck, iconClassName: "text-cyan-400" },
      { label: "RT-DETRv2", icon: Crosshair, iconClassName: "text-blue-400" },
      { label: "Albumentations", icon: TestTube2, iconClassName: "text-fuchsia-400" },
    ],
  },
  {
    key: "llms",
    group: "ai-ml",
    icon: Bot,
    layout: {
      lightClassName:
        "lg:col-span-6 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))]",
      darkClassName:
        "lg:col-span-6 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.2),transparent_35%),linear-gradient(180deg,rgba(10,10,14,0.98),rgba(6,6,9,0.96))]",
      lightAccentClassName: "from-violet-500/15 via-fuchsia-500/8 to-transparent",
      darkAccentClassName: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
    },
    items: [
      { label: "ChatGPT", icon: SiOpenai, iconClassName: "text-[#10A37F]" },
      { label: "Mistral AI", icon: SiMistralai, iconClassName: "text-[#FF7000]" },
      { label: "Qwen", icon: Bot, iconClassName: "text-violet-400" },
      { label: "Gemini", icon: SiGooglegemini, iconClassName: "text-[#4285F4]" },
      { label: "OpenRouter", icon: OpenRouterIcon, iconClassName: "text-slate-400", iconSize: 26 },
      { label: "AWS Bedrock", icon: LuBrainCircuit, iconClassName: "text-[#FF9900]" },
    ],
  },
  {
    key: "speech-audio-ai",
    group: "ai-ml",
    icon: Mic,
    layout: {
      lightClassName: "lg:col-span-4 bg-white/90",
      darkClassName: "lg:col-span-4 bg-[#0f1015]",
      lightAccentClassName: "from-emerald-500/10 via-transparent to-transparent",
      darkAccentClassName: "from-emerald-500/15 via-transparent to-transparent",
    },
    items: [{ label: "Whisper", icon: Mic, iconClassName: "text-emerald-400" }],
  },
  {
    key: "deep-learning",
    group: "ai-ml",
    icon: BrainCircuit,
    layout: {
      lightClassName: "lg:col-span-4 bg-white/90",
      darkClassName: "lg:col-span-4 bg-[#0f1015]",
      lightAccentClassName: "from-violet-500/10 via-transparent to-transparent",
      darkAccentClassName: "from-violet-500/15 via-transparent to-transparent",
    },
    items: [
      { label: "PyTorch", icon: SiPytorch, iconClassName: "text-[#EE4C2C]" },
      { label: "PyTorch Lightning", icon: Zap, iconClassName: "text-violet-400" },
    ],
  },
  {
    key: "data-science",
    group: "ai-ml",
    icon: Sigma,
    layout: {
      lightClassName: "lg:col-span-4 bg-white/90",
      darkClassName: "lg:col-span-4 bg-[#0f1015]",
      lightAccentClassName: "from-emerald-500/10 via-transparent to-transparent",
      darkAccentClassName: "from-emerald-500/15 via-transparent to-transparent",
    },
    items: [
      { label: "NumPy", icon: SiNumpy, iconClassName: "text-[#4DABCF]" },
      { label: "Pandas", icon: SiPandas, iconClassName: "text-[#150458]" },
    ],
  },
  {
    key: "backend",
    group: "application-engineering",
    icon: Server,
    layout: {
      lightClassName: "lg:col-span-4 bg-white/90",
      darkClassName: "lg:col-span-4 bg-[#0f1015]",
      lightAccentClassName: "from-amber-500/10 via-transparent to-transparent",
      darkAccentClassName: "from-amber-500/15 via-transparent to-transparent",
    },
    items: [
      { label: "FastAPI", icon: SiFastapi, iconClassName: "text-[#009688]" },
      { label: "Pydantic", icon: SiPydantic, iconClassName: "text-[#E92063]" },
      { label: "SQLAlchemy", icon: SiSqlalchemy, iconClassName: "text-[#D71F00]" },
      { label: "Alembic", icon: TestTube2, iconClassName: "text-amber-400" },
      { label: "Celery", icon: SiCelery, iconClassName: "text-[#37814A]" },
      { label: "Uvicorn", icon: Server, iconClassName: "text-sky-400" },
    ],
  },
  {
    key: "storage",
    group: "application-engineering",
    icon: Boxes,
    layout: {
      lightClassName: "lg:col-span-4 bg-white/90",
      darkClassName: "lg:col-span-4 bg-[#0f1015]",
      lightAccentClassName: "from-cyan-500/10 via-transparent to-transparent",
      darkAccentClassName: "from-cyan-500/15 via-transparent to-transparent",
    },
    items: [
      { label: "Postgres", icon: SiPostgresql, iconClassName: "text-[#4169E1]" },
      { label: "MongoDB", icon: SiMongodb, iconClassName: "text-[#47A248]" },
      { label: "SurrealDB", icon: SiSurrealdb, iconClassName: "text-[#FF00A0]" },
      { label: "Redis", icon: SiRedis, iconClassName: "text-[#DC382D]", iconSize: 16 },
      { label: "RabbitMQ", icon: SiRabbitmq, iconClassName: "text-[#FF6600]", iconSize: 16 },
      { label: "MinIO", icon: SiMinio, iconClassName: "text-[#C72E49]", iconSize: 22 },
    ],
  },
  {
    key: "retrieval",
    group: "ai-ml",
    icon: SearchCheck,
    layout: {
      lightClassName: "lg:col-span-4 bg-white/90",
      darkClassName: "lg:col-span-4 bg-[#0f1015]",
      lightAccentClassName: "from-emerald-500/10 via-transparent to-transparent",
      darkAccentClassName: "from-emerald-500/15 via-transparent to-transparent",
    },
    items: [
      { label: "RAG", icon: SearchCheck, iconClassName: "text-emerald-400" },
      { label: "Qdrant", icon: QdrantIcon, iconClassName: "text-[#DC244C]" },
      { label: "RAGAS", icon: ChartNoAxesCombined, iconClassName: "text-fuchsia-400" },
      { label: "HF TEI", icon: SiHuggingface, iconClassName: "text-[#FFD21E]" },
      { label: "OpenAI API", icon: SiOpenai, iconClassName: "text-[#10A37F]" },
    ],
  },
  {
    key: "languages-runtimes",
    group: "application-engineering",
    icon: Code2,
    layout: {
      lightClassName: "lg:col-span-4 bg-white/90",
      darkClassName: "lg:col-span-4 bg-[#0f1015]",
      lightAccentClassName: "from-slate-500/10 via-transparent to-transparent",
      darkAccentClassName: "from-slate-500/15 via-transparent to-transparent",
    },
    items: [
      { label: "TypeScript", icon: SiTypescript, iconClassName: "text-[#3178C6]" },
      { label: "Python", icon: SiPython, iconClassName: "text-[#3776AB]" },
      { label: "Go", icon: SiGo, iconClassName: "text-[#00ADD8]", iconSize: 24 },
      { label: "Rust", icon: SiRust, iconClassName: "text-[#B7410E]", iconSize: 24 },
      { label: "Bash", icon: Terminal, iconClassName: "text-green-400" },
      { label: "Tauri", icon: SiTauri, iconClassName: "text-[#24C8DB]" },
      { label: "Electron", icon: SiElectron, iconClassName: "text-[#47848F]" },
    ],
  },
  {
    key: "frontend",
    group: "application-engineering",
    icon: Code2,
    layout: {
      lightClassName: "lg:col-span-4 bg-white/90",
      darkClassName: "lg:col-span-4 bg-[#0f1015]",
      lightAccentClassName: "from-pink-500/10 via-transparent to-transparent",
      darkAccentClassName: "from-pink-500/15 via-transparent to-transparent",
    },
    items: [
      { label: "React", icon: SiReact, iconClassName: "text-[#61DAFB]" },
      { label: "Vinext", icon: SiCloudflare, iconSize: 22, iconClassName: "text-[#F38020]" },
      { label: "Next.js", icon: SiNextdotjs, iconClassName: "text-neutral-950 dark:text-white" },
      { label: "Vike", icon: GiThorHammer, iconClassName: "text-slate-400" },
      { label: "Vite", icon: SiVite, iconClassName: "text-[#646CFF]" },
      { label: "Tailwind CSS", icon: SiTailwindcss, iconClassName: "text-[#38BDF8]" },
      { label: "Bun", icon: SiBun, iconClassName: "text-neutral-900 dark:text-[#FBF0DF]" },
      { label: "React Native", icon: SiReact, iconClassName: "text-[#61DAFB]" },
    ],
  },
  {
    key: "developer-tools-platforms",
    group: "application-engineering",
    icon: Wrench,
    layout: {
      lightClassName: "lg:col-span-8 bg-white/90",
      darkClassName: "lg:col-span-8 bg-[#0f1015]",
      lightAccentClassName: "from-slate-500/10 via-transparent to-transparent",
      darkAccentClassName: "from-slate-500/15 via-transparent to-transparent",
    },
    items: [
      { label: "uv", icon: Terminal, iconClassName: "text-slate-400" },
      { label: "Git", icon: SiGit, iconClassName: "text-[#F05032]" },
      { label: "Docker", icon: SiDocker, iconClassName: "text-[#2496ED]", iconSize: 22 },
      { label: "Docker Compose", icon: SiDocker, iconClassName: "text-[#2496ED]", iconSize: 22 },
      { label: "AWS", icon: FaAws, iconClassName: "text-[#FF9900]", iconSize: 22 },
      { label: "Cloudflare Workers", icon: SiCloudflareworkers, iconClassName: "text-[#F38020]" },
      { label: "Figma", icon: SiFigma, iconClassName: "text-[#F24E1E]" },
      { label: "Cursor", icon: FileCode2, iconClassName: "text-slate-400" },
    ],
  },
  {
    key: "quality-delivery",
    group: "quality-workflow",
    icon: TestTube2,
    layout: {
      lightClassName: "lg:col-span-4 bg-white/90",
      darkClassName: "lg:col-span-4 bg-[#0f1015]",
      lightAccentClassName: "from-orange-500/10 via-transparent to-transparent",
      darkAccentClassName: "from-orange-500/15 via-transparent to-transparent",
    },
    items: [
      { label: "Playwright", icon: SquareMousePointer, iconClassName: "text-emerald-400" },
      { label: "Vitest", icon: SiVitest, iconClassName: "text-[#6E9F18]" },
      { label: "Github Actions", icon: SiGithubactions, iconClassName: "" },
      { label: "Jest", icon: SiJest, iconClassName: "text-[#C21325]" },
      { label: "Pytest", icon: SiPytest, iconClassName: "text-[#0A9EDC]" },
      { label: "Testing Library", icon: SiTestinglibrary, iconClassName: "text-[#E33332]" },
      { label: "Cypress", icon: SiCypress, iconClassName: "text-[#69D3A7]" },
      { label: "Ruff", icon: SiRuff, iconClassName: "text-[#D7FF64]" },
      { label: "Mypy", icon: FileCode2, iconClassName: "text-indigo-400" },
      { label: "Grafana", icon: SiGrafana, iconClassName: "text-[#F46800]" },
      { label: "Snyk", icon: SiSnyk, iconClassName: "text-[#4C4A73]" },
    ],
  },
  // {
  //   key: "current-os",
  //   group: "environment",
  //   icon: LaptopMinimal,
  //   layout: {
  //     lightClassName: "lg:col-span-6 bg-white/90",
  //     darkClassName: "lg:col-span-6 bg-[#0f1015]",
  //     lightAccentClassName: "from-indigo-500/10 via-transparent to-transparent",
  //     darkAccentClassName: "from-indigo-500/15 via-transparent to-transparent",
  //   },
  //   items: [
  //     { label: "EndeavourOS", icon: SiEndeavouros, iconClassName: "text-[#7F7FFF]" },
  //     { label: "Ubuntu", icon: SiUbuntu, iconClassName: "text-[#E95420]" },
  //     { label: "Windows", icon: WindowsIcon, iconClassName: "text-[#0078D4]" },
  //   ],
  // },
];

export type TechStackCategoryKey = (typeof TECH_STACK_SECTIONS)[number]["key"];
