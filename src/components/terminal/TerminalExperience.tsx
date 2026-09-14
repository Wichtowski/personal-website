"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Maximize2, Minus, Square, X } from "lucide-react";
import { useLanguage } from "@context/LanguageContext";
import { setNavTransitionKind } from "@lib/navigation";
import {
  getTerminalCompletions,
  runTerminalCommand,
  type TerminalCommandResult,
  type TerminalDirectory,
  type TerminalOutputLine,
} from "@lib/terminal";
import type { ArticleMetadata, ProjectMetadata } from "@lib/mdx";
import { cn } from "@lib/cn";

interface TerminalExperienceProps {
  articles: ArticleMetadata[];
  projects: ProjectMetadata[];
}

interface TerminalEntry {
  id: number;
  command: string;
  directory: TerminalDirectory;
  lines: TerminalOutputLine[];
  loading: boolean;
}

const BOOT_LINES = [
  "[ ok ] mounting portfolio filesystem",
  "[ ok ] indexing projects and articles",
  "[ ok ] waking up terminal cat",
  "[ ok ] interactive shell ready",
];

const LOADER_FRAMES = ["[·    ]", "[··   ]", "[···  ]", "[ ··· ]", "[  ···]", "[   ··]"];
const IMMEDIATE_COMMANDS = new Set(["cd", "ls", "pwd"]);

function longestCommonPrefix(values: string[]) {
  if (values.length === 0) return "";
  return values.reduce((prefix, value) => {
    let index = 0;
    while (index < prefix.length && prefix[index] === value[index]) index += 1;
    return prefix.slice(0, index);
  });
}

function AsciiLoader() {
  const [frame, setFrame] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = window.setInterval(
      () => setFrame((currentFrame) => (currentFrame + 1) % LOADER_FRAMES.length),
      90,
    );
    return () => window.clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <span className="text-amber-300">{LOADER_FRAMES[shouldReduceMotion ? 2 : frame]} querying</span>
  );
}

function OutputLine({
  line,
  onNavigate,
}: {
  line: TerminalOutputLine;
  onNavigate: (href: string) => void;
}) {
  const className = cn(
    "block whitespace-pre-wrap break-words",
    line.kind === "ascii" && "overflow-x-auto whitespace-pre text-primary leading-tight",
    line.kind === "error" && "text-rose-400",
    line.kind === "muted" && "text-zinc-500",
    line.kind === "success" && "text-emerald-300",
    line.kind === "text" && "text-zinc-300",
  );

  if (line.kind === "link" && line.href) {
    const isExternal = /^(?:https?:|mailto:)/.test(line.href);
    return (
      <button
        type="button"
        onClick={() => onNavigate(line.href!)}
        className="group flex max-w-full items-center gap-2 text-left text-cyan-300 underline decoration-cyan-300/25 underline-offset-4 transition-colors hover:text-cyan-100"
      >
        <span className="break-words">{line.text}</span>
        {isExternal ? <ExternalLink size={12} className="shrink-0 opacity-60" /> : null}
      </button>
    );
  }

  return <span className={className}>{line.text}</span>;
}

export function TerminalExperience({ articles, projects }: TerminalExperienceProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [bootLineCount, setBootLineCount] = useState(shouldReduceMotion ? BOOT_LINES.length : 0);
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState<TerminalDirectory>("~");
  const [showIntro, setShowIntro] = useState(true);
  const [completionHints, setCompletionHints] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const nextEntryId = useRef(1);
  const timersRef = useRef<number[]>([]);
  const lastTabInputRef = useRef<string | null>(null);
  const localizedArticles = articles.filter((article) => article.language === language);
  const localizedProjects = projects.filter((project) => project.language === language);
  const visibleBootLineCount = shouldReduceMotion ? BOOT_LINES.length : bootLineCount;
  const booted = visibleBootLineCount >= BOOT_LINES.length;

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = window.setInterval(() => {
      setBootLineCount((currentCount) => {
        if (currentCount >= BOOT_LINES.length) {
          window.clearInterval(interval);
          return currentCount;
        }
        return currentCount + 1;
      });
    }, 170);

    return () => window.clearInterval(interval);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (booted && !isBusy) inputRef.current?.focus();
  }, [booted, isBusy]);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: "smooth" });
  }, [bootLineCount, entries]);

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const navigate = (href: string) => {
    if (/^(?:https?:|mailto:)/.test(href)) {
      window.open(href, href.startsWith("mailto:") ? "_self" : "_blank", "noopener,noreferrer");
      return;
    }

    setNavTransitionKind("fade");
    router.push(href);
  };

  const runAction = (result: TerminalCommandResult) => {
    if (!result.action) return;

    if (result.action.type === "clear") {
      setEntries([]);
      setShowIntro(false);
      return;
    }

    if (result.action.type === "theme") {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
      return;
    }

    if (result.action.type === "change-directory" && result.action.target) {
      setCurrentDirectory(result.action.target as TerminalDirectory);
      return;
    }

    if (result.action.target) {
      const timer = window.setTimeout(() => navigate(result.action!.target!), 320);
      timersRef.current.push(timer);
    }
  };

  const execute = (rawCommand: string) => {
    const command = rawCommand.trim();
    if (!command || isBusy || !booted) return;

    const nextHistory = [...history, command];
    const result = runTerminalCommand(command, {
      articles: localizedArticles,
      projects: localizedProjects,
      language,
      history: nextHistory,
      currentDirectory,
    });

    setHistory(nextHistory);
    setHistoryIndex(-1);
    setInput("");
    setCompletionHints([]);
    lastTabInputRef.current = null;

    if (result.action?.type === "clear") {
      runAction(result);
      return;
    }

    const id = nextEntryId.current++;
    const commandName = command.split(/\s+/, 1)[0].toLowerCase();

    if (IMMEDIATE_COMMANDS.has(commandName)) {
      setEntries((currentEntries) => [
        ...currentEntries,
        { id, command, directory: currentDirectory, lines: result.lines, loading: false },
      ]);
      runAction(result);
      return;
    }

    setEntries((currentEntries) => [
      ...currentEntries,
      { id, command, directory: currentDirectory, lines: [], loading: true },
    ]);
    setIsBusy(true);

    const delay = shouldReduceMotion ? 0 : Math.min(720, 280 + result.lines.length * 45);
    const timer = window.setTimeout(() => {
      setEntries((currentEntries) =>
        currentEntries.map((entry) =>
          entry.id === id ? { ...entry, lines: result.lines, loading: false } : entry,
        ),
      );
      setIsBusy(false);
      runAction(result);
    }, delay);
    timersRef.current.push(timer);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    execute(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const completions = getTerminalCompletions(input, {
        articles: localizedArticles,
        projects: localizedProjects,
        language,
        history,
        currentDirectory,
      });

      if (completions.length === 0) {
        setCompletionHints([]);
        lastTabInputRef.current = null;
        return;
      }

      const trimmedInput = input.trimStart();
      const hasArgument = trimmedInput.includes(" ");
      const command = trimmedInput.split(/\s+/, 1)[0];
      const currentToken = hasArgument
        ? trimmedInput.slice(trimmedInput.lastIndexOf(" ") + 1)
        : command;
      const commonPrefix = longestCommonPrefix(completions);

      if (completions.length === 1 || commonPrefix.length > currentToken.length) {
        const completedValue = hasArgument
          ? `${command} ${completions.length === 1 ? completions[0] : commonPrefix}`
          : `${completions.length === 1 ? completions[0] : commonPrefix}${completions.length === 1 ? " " : ""}`;
        setInput(completedValue);
        setCompletionHints([]);
        lastTabInputRef.current = null;
        return;
      }

      if (lastTabInputRef.current === input) {
        setCompletionHints(completions);
      } else {
        setCompletionHints([]);
        lastTabInputRef.current = input;
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, history.length - 1);
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(history[history.length - 1 - nextIndex]);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setInput(nextIndex >= 0 ? history[history.length - 1 - nextIndex] : "");
    } else if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setEntries([]);
      setShowIntro(false);
    }
  };

  return (
    <section
      className="flex min-h-full w-full items-stretch justify-center px-3 pb-5 pt-6 sm:px-6 md:px-10 md:pb-10 md:pt-28"
      onClick={() => inputRef.current?.focus()}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-[calc(100vh-7.5rem)] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-emerald-300/15 bg-[#050807]/95 text-[13px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:text-sm md:min-h-[calc(100vh-9rem)]"
        style={{ fontFamily: "var(--font-terminal), var(--font-geist-mono), monospace" }}
      >
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.035] px-4 text-zinc-500">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-rose-400/80" />
            <span className="size-2.5 rounded-full bg-amber-300/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="text-[11px] tracking-[0.16em]">oskar@portfolio: {currentDirectory}</span>
          <div className="flex items-center gap-3" aria-hidden="true">
            <Minus size={12} />
            <Square size={10} />
            <X size={12} />
          </div>
        </div>

        <div
          ref={outputRef}
          className="terminal-scrollbar flex-1 overflow-y-auto p-4 leading-relaxed sm:p-6 md:p-8"
          role="log"
          aria-live="polite"
        >
          {showIntro ? (
            <>
              <div className="mb-5 text-primary" aria-hidden="true">
                <pre className="hidden text-[10px] leading-[1.05] sm:block md:text-xs">{String.raw`
  ____  ____  __ __   ____  ____  ____
 / __ \/ __ \/ //_/  / __ \/ __ \/ __ \
/ /_/ / /_/ / ,<    / /_/ / /_/ / / / /
\____/\____/_/|_|   \____/\____/_/ /_/`}</pre>
                <p className="mt-3 text-xs tracking-[0.24em] text-emerald-300">
                  INTERACTIVE PORTFOLIO SHELL
                </p>
              </div>

              <div className="mb-5 space-y-1">
                <AnimatePresence initial={false}>
                  {BOOT_LINES.slice(0, visibleBootLineCount).map((line) => (
                    <motion.p
                      key={line}
                      initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-zinc-500"
                    >
                      <span className="text-emerald-400">{line.slice(0, 6)}</span>
                      {line.slice(6)}
                    </motion.p>
                  ))}
                </AnimatePresence>
                {booted ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-2 text-zinc-400"
                  >
                    Type <span className="text-cyan-300">help</span> to explore. Start with{" "}
                    <button
                      type="button"
                      onClick={() => execute("ls")}
                      className="text-cyan-300 underline underline-offset-4"
                    >
                      ls
                    </button>{" "}
                    or try{" "}
                    <button
                      type="button"
                      onClick={() => execute("cat")}
                      className="text-cyan-300 underline underline-offset-4"
                    >
                      cat
                    </button>
                    .
                  </motion.p>
                ) : (
                  <p className="pt-2">
                    <AsciiLoader />
                  </p>
                )}
              </div>
            </>
          ) : null}

          <div className="space-y-5">
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <p className="break-words text-zinc-200">
                  <span className="text-emerald-400">oskar@portfolio</span>
                  <span className="text-zinc-600">:</span>
                  <span className="text-cyan-300">{entry.directory}</span>
                  <span className="text-zinc-500">$</span> {entry.command}
                </p>
                <div className="space-y-1 pl-0.5">
                  {entry.loading ? (
                    <AsciiLoader />
                  ) : (
                    entry.lines.map((line, index) => (
                      <motion.div
                        key={`${entry.id}-${index}`}
                        initial={shouldReduceMotion ? false : { opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: shouldReduceMotion ? 0 : index * 0.035 }}
                      >
                        <OutputLine line={line} onNavigate={navigate} />
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="shrink-0 border-t border-white/10 bg-black/35 px-4 py-4 sm:px-6"
        >
          {completionHints.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-cyan-300/75">
              {completionHints.map((hint) => (
                <span key={hint}>{hint}</span>
              ))}
            </div>
          ) : null}
          <label className="flex min-w-0 items-center gap-2">
            <span className="hidden shrink-0 text-emerald-400 sm:inline">oskar@portfolio</span>
            <span className="hidden text-zinc-600 sm:inline">:</span>
            <span className="shrink-0 text-cyan-300">{currentDirectory}</span>
            <span className="shrink-0 text-zinc-500">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setCompletionHints([]);
                lastTabInputRef.current = null;
              }}
              onKeyDown={handleKeyDown}
              disabled={!booted || isBusy}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-label="Terminal command"
              className="min-w-0 flex-1 bg-transparent text-zinc-100 caret-emerald-300 outline-none placeholder:text-zinc-700 disabled:cursor-wait"
              placeholder={booted ? "enter a command..." : "booting..."}
            />
            <Maximize2 size={13} className="shrink-0 text-zinc-700" aria-hidden="true" />
          </label>
        </form>
      </motion.div>
    </section>
  );
}
