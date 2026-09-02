import type { ComponentType } from "react";
import {
  SiBun,
  SiCelery,
  SiCloudflare,
  SiCloudflareworkers,
  SiCypress,
  SiDocker,
  SiDoctrine,
  SiElectron,
  SiFastapi,
  SiFigma,
  SiGit,
  SiGithubactions,
  SiGitlab,
  SiGo,
  SiGooglegemini,
  SiGrafana,
  SiHuggingface,
  SiJest,
  SiKubernetes,
  SiMinio,
  SiMistralai,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiNumpy,
  SiOpenai,
  SiOpencv,
  SiPandas,
  SiPhp,
  SiPostgresql,
  SiPydantic,
  SiPytest,
  SiPython,
  SiPytorch,
  SiRabbitmq,
  SiReact,
  SiNvidia,
  SiRedis,
  SiRuff,
  SiRust,
  SiSnyk,
  SiSqlalchemy,
  SiSurrealdb,
  SiSymfony,
  SiTailwindcss,
  SiTauri,
  SiTestinglibrary,
  SiTypescript,
  SiJavascript,
  SiVite,
  SiVitest,
  SiYolo,
} from "react-icons/si";
import {
  Bot,
  Boxes,
  BrainCircuit,
  ChartNoAxesCombined,
  CloudCog,
  Code2,
  Crosshair,
  FileCode2,
  Gauge,
  LaptopMinimal,
  MonitorCheck,
  ShieldCheck,
  Mic,
  SearchCheck,
  Server,
  Sigma,
  Terminal,
  TestTube2,
  Wrench,
  Zap,
} from "lucide-react";
import { FaAws, FaTheaterMasks } from "react-icons/fa";
import { GiThorHammer } from "react-icons/gi";
import { LuBrainCircuit } from "react-icons/lu";
import { SiK3S } from "react-icons/si";
import { OpenRouterIcon } from "@components/icons/openrouter-icon";
import { QdrantIcon } from "@components/icons/qdrant-icon";

export type TechStackIconComponent = ComponentType<{
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
}>;

export type TechStackItem = {
  label: string;
  icon: TechStackIconComponent;
  iconSize?: number;
  iconClassName?: string;
};

export const TECH_STACK_ITEMS = {
  TypeScript: { label: "TypeScript", icon: SiTypescript, iconClassName: "text-[#3178C6]" },
  JavaScript: { label: "JavaScript", icon: SiJavascript, iconClassName: "text-[#F0DB4F]" },
  "Node.js": { label: "Node.js", icon: SiNodedotjs, iconClassName: "text-[#5FA04E]" },

  Python: { label: "Python", icon: SiPython, iconClassName: "text-[#3776AB]" },
  Go: { label: "Go", icon: SiGo, iconClassName: "text-[#00ADD8]", iconSize: 24 },
  Rust: { label: "Rust", icon: SiRust, iconClassName: "text-[#B7410E]", iconSize: 24 },
  PHP: { label: "PHP", icon: SiPhp, iconClassName: "text-[#777BB4]", iconSize: 24 },
  Bash: { label: "Bash", icon: Terminal, iconClassName: "text-green-400" },
  React: { label: "React", icon: SiReact, iconClassName: "text-[#61DAFB]" },
  "React Native": { label: "React Native", icon: SiReact, iconClassName: "text-[#61DAFB]" },
  Vinext: { label: "Vinext", icon: SiCloudflare, iconSize: 22, iconClassName: "text-[#F38020]" },
  "Next.js": {
    label: "Next.js",
    icon: SiNextdotjs,
    iconClassName: "text-neutral-950 dark:text-white",
  },
  Vike: { label: "Vike", icon: GiThorHammer, iconClassName: "text-slate-400" },
  Vite: { label: "Vite", icon: SiVite, iconClassName: "text-[#646CFF]" },
  "Tailwind CSS": { label: "Tailwind CSS", icon: SiTailwindcss, iconClassName: "text-[#38BDF8]" },
  Bun: {
    label: "Bun",
    icon: SiBun,
    iconClassName: "text-neutral-900 dark:text-[#FBF0DF]",
  },
  Tauri: { label: "Tauri", icon: SiTauri, iconClassName: "text-[#24C8DB]" },
  Electron: { label: "Electron", icon: SiElectron, iconClassName: "text-[#47848F]" },
  FastAPI: { label: "FastAPI", icon: SiFastapi, iconClassName: "text-[#009688]" },
  Pydantic: { label: "Pydantic", icon: SiPydantic, iconClassName: "text-[#E92063]" },
  SQLAlchemy: { label: "SQLAlchemy", icon: SiSqlalchemy, iconClassName: "text-[#D71F00]" },
  Doctrine: { label: "Doctrine", icon: SiDoctrine, iconClassName: "text-[#FC6A31]" },
  Symfony: {
    label: "Symfony",
    icon: SiSymfony,
    iconClassName: "text-neutral-900 dark:text-white",
  },
  Alembic: { label: "Alembic", icon: TestTube2, iconClassName: "text-amber-400" },
  Celery: { label: "Celery", icon: SiCelery, iconClassName: "text-[#37814A]" },
  Uvicorn: { label: "Uvicorn", icon: Server, iconClassName: "text-sky-400" },
  Postgres: { label: "Postgres", icon: SiPostgresql, iconClassName: "text-[#4169E1]" },
  MongoDB: { label: "MongoDB", icon: SiMongodb, iconClassName: "text-[#47A248]" },
  SurrealDB: { label: "SurrealDB", icon: SiSurrealdb, iconClassName: "text-[#FF00A0]" },
  Redis: { label: "Redis", icon: SiRedis, iconClassName: "text-[#DC382D]", iconSize: 16 },
  RabbitMQ: { label: "RabbitMQ", icon: SiRabbitmq, iconClassName: "text-[#FF6600]", iconSize: 16 },
  MinIO: { label: "MinIO", icon: SiMinio, iconClassName: "text-[#C72E49]", iconSize: 22 },
  YOLO: { label: "YOLO", icon: SiYolo, iconClassName: "text-[#042AFF]" },
  OpenCV: { label: "OpenCV", icon: SiOpencv, iconClassName: "text-[#5C3EE8]" },
  "Faster R-CNN": { label: "Faster R-CNN", icon: Boxes, iconClassName: "text-sky-400" },
  RCNN: { label: "RCNN", icon: SearchCheck, iconClassName: "text-cyan-400" },
  "RT-DETRv2": { label: "RT-DETRv2", icon: Crosshair, iconClassName: "text-blue-400" },
  Albumentations: {
    label: "Albumentations",
    icon: TestTube2,
    iconClassName: "text-fuchsia-400",
  },
  "Nvidia Parakeet": { label: "Nvidia Parakeet", icon: SiNvidia, iconClassName: "text-[#76B900]" },
  ChatGPT: { label: "ChatGPT", icon: SiOpenai, iconClassName: "text-[#10A37F]" },
  "Mistral AI": { label: "Mistral AI", icon: SiMistralai, iconClassName: "text-[#FF7000]" },
  Qwen: { label: "Qwen", icon: Bot, iconClassName: "text-violet-400" },
  Gemini: { label: "Gemini", icon: SiGooglegemini, iconClassName: "text-[#4285F4]" },
  OpenRouter: {
    label: "OpenRouter",
    icon: OpenRouterIcon,
    iconClassName: "text-slate-400",
    iconSize: 26,
  },
  "AWS Bedrock": { label: "AWS Bedrock", icon: LuBrainCircuit, iconClassName: "text-[#FF9900]" },
  Whisper: { label: "Whisper", icon: Mic, iconClassName: "text-emerald-400" },
  PyTorch: { label: "PyTorch", icon: SiPytorch, iconClassName: "text-[#EE4C2C]" },
  "PyTorch Lightning": {
    label: "PyTorch Lightning",
    icon: Zap,
    iconClassName: "text-violet-400",
  },
  NumPy: { label: "NumPy", icon: SiNumpy, iconClassName: "text-[#4DABCF]" },
  Pandas: { label: "Pandas", icon: SiPandas, iconClassName: "text-[#150458]" },
  RAG: { label: "RAG", icon: SearchCheck, iconClassName: "text-emerald-400" },
  Qdrant: { label: "Qdrant", icon: QdrantIcon, iconClassName: "text-[#DC244C]" },
  RAGAS: { label: "RAGAS", icon: ChartNoAxesCombined, iconClassName: "text-fuchsia-400" },
  "HF TEI": { label: "HF TEI", icon: SiHuggingface, iconClassName: "text-[#FFD21E]" },
  "OpenAI API": { label: "OpenAI API", icon: SiOpenai, iconClassName: "text-[#10A37F]" },
  uv: { label: "uv", icon: Terminal, iconClassName: "text-slate-400" },
  Git: { label: "Git", icon: SiGit, iconClassName: "text-[#F05032]" },
  GitLab: { label: "GitLab", icon: SiGitlab, iconClassName: "text-[#FC6D26]" },
  K8S: { label: "K8S", icon: SiKubernetes, iconClassName: "text-[#326CE5]" },
  K3S: { label: "K3S", icon: SiK3S, iconClassName: "text-[#ffc61c]" },
  Docker: { label: "Docker", icon: SiDocker, iconClassName: "text-[#2496ED]", iconSize: 22 },
  "Docker Compose": {
    label: "Docker Compose",
    icon: SiDocker,
    iconClassName: "text-[#2496ED]",
    iconSize: 22,
  },
  AWS: { label: "AWS", icon: FaAws, iconClassName: "text-[#FF9900]", iconSize: 22 },
  "Cloudflare Workers": {
    label: "Cloudflare Workers",
    icon: SiCloudflareworkers,
    iconClassName: "text-[#F38020]",
  },
  Figma: { label: "Figma", icon: SiFigma, iconClassName: "text-[#F24E1E]" },
  Cursor: { label: "Cursor", icon: FileCode2, iconClassName: "text-slate-400" },
  Playwright: {
    label: "Playwright",
    icon: FaTheaterMasks,
    iconClassName: "text-[#1D8D22]",
  },
  Vitest: { label: "Vitest", icon: SiVitest, iconClassName: "text-[#6E9F18]" },
  "Github Actions": { label: "Github Actions", icon: SiGithubactions },
  Jest: { label: "Jest", icon: SiJest, iconClassName: "text-[#C21325]" },
  Pytest: { label: "Pytest", icon: SiPytest, iconClassName: "text-[#0A9EDC]" },
  "Testing Library": {
    label: "Testing Library",
    icon: SiTestinglibrary,
    iconClassName: "text-[#E33332]",
  },
  Cypress: { label: "Cypress", icon: SiCypress, iconClassName: "text-[#69D3A7]" },
  Ruff: { label: "Ruff", icon: SiRuff, iconClassName: "text-[#D7FF64]" },
  Mypy: { label: "Mypy", icon: FileCode2, iconClassName: "text-indigo-400" },
  Grafana: { label: "Grafana", icon: SiGrafana, iconClassName: "text-[#F46800]" },
  Snyk: { label: "Snyk", icon: SiSnyk, iconClassName: "text-[#4C4A73]" },
} satisfies Record<string, TechStackItem>;

export type TechStackItemKey = keyof typeof TECH_STACK_ITEMS;
export type TechStackDomainKey = "frontend" | "backend" | "ai-data" | "platform-quality";

export type TechStackDomain = {
  key: TechStackDomainKey;
  icon: TechStackIconComponent;
  sections: readonly {
    key: string;
    icon: TechStackIconComponent;
    items: readonly TechStackItemKey[];
    wide?: boolean;
  }[];
};

export const TECH_STACK_DOMAINS: readonly TechStackDomain[] = [
  {
    key: "frontend",
    icon: Code2,
    sections: [
      {
        key: "frontend-languages-frameworks",
        icon: Code2,
        wide: true,
        items: ["TypeScript", "JavaScript", "React", "Next.js", "Vinext", "Vike", "React Native"],
      },
      { key: "build-styling", icon: Wrench, items: ["Bun", "Vite", "Tailwind CSS", "Figma"] },
      { key: "desktop", icon: LaptopMinimal, items: ["Tauri", "Electron"] },
    ],
  },
  {
    key: "backend",
    icon: Server,
    sections: [
      {
        key: "backend-languages-apis-frameworks",
        icon: Code2,
        wide: true,
        items: [
          "Python",
          "Go",
          "Rust",
          "PHP",
          "TypeScript",
          "Node.js",
          "FastAPI",
          "Pydantic",
          "SQLAlchemy",
          "Doctrine",
          "Alembic",
          "Uvicorn",
          "Symfony",
        ],
      },
      {
        key: "data-storage",
        icon: Boxes,
        items: ["Postgres", "MongoDB", "SurrealDB", "Redis", "MinIO"],
      },
      { key: "jobs-messaging", icon: Zap, items: ["Celery", "RabbitMQ"] },
    ],
  },
  {
    key: "ai-data",
    icon: BrainCircuit,
    sections: [
      {
        key: "models-apis",
        icon: Bot,
        items: [
          "ChatGPT",
          "Mistral AI",
          "Qwen",
          "Gemini",
          "OpenRouter",
          "AWS Bedrock",
          "OpenAI API",
        ],
      },
      {
        key: "computer-vision",
        icon: Crosshair,
        items: ["YOLO", "OpenCV", "Faster R-CNN", "RCNN", "RT-DETRv2", "Albumentations"],
      },
      {
        key: "ml-data",
        icon: Sigma,
        items: ["Python", "PyTorch", "PyTorch Lightning", "NumPy", "Pandas"],
      },
      {
        key: "retrieval",
        icon: SearchCheck,
        items: ["RAG", "Qdrant", "RAGAS", "HF TEI", "OpenAI API"],
      },
      { key: "speech", icon: Mic, items: ["Whisper", "Nvidia Parakeet"] },
    ],
  },
  {
    key: "platform-quality",
    icon: ShieldCheck,
    sections: [
      {
        key: "infrastructure-runtime",
        icon: CloudCog,
        wide: true,
        items: [
          "AWS",
          "Cloudflare Workers",
          "AWS Bedrock",
          "Docker",
          "Docker Compose",
          "K8S",
          "K3S",
        ],
      },
      {
        key: "developer-tooling",
        icon: Wrench,
        items: ["Bun", "uv", "Git", "GitLab", "Bash", "Cursor"],
      },
      { key: "browser-e2e", icon: MonitorCheck, items: ["Playwright", "Cypress"] },
      {
        key: "unit-code-quality",
        icon: TestTube2,
        items: ["Vitest", "Jest", "Testing Library", "Pytest", "Ruff", "Mypy"],
      },
      {
        key: "delivery-observability",
        icon: Gauge,
        items: ["Github Actions", "Grafana", "Snyk"],
      },
    ],
  },
];
