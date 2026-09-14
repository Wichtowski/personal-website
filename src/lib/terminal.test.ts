import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { ArticleMetadata, ProjectMetadata } from "./mdx";
import { getTerminalCompletions, runTerminalCommand } from "./terminal";

const articles: ArticleMetadata[] = [
  {
    title: "Testing AI services",
    description: "Reliable evaluation at scale",
    date: "2026-01-01",
    readTime: "5 min",
    tags: ["AI", "testing"],
    slug: "testing-ai",
    language: "en",
  },
];

const projects: ProjectMetadata[] = [
  {
    title: "Cattle detector",
    description: "Computer vision pipeline",
    date: "2026-01-01",
    category: "ai",
    tags: ["YOLO", "Python"],
    slug: "cattle-detector",
    language: "en",
  },
];

const context = {
  articles,
  projects,
  language: "en" as const,
  history: [],
  currentDirectory: "~" as const,
};

describe("terminal commands", () => {
  test("searches projects and articles without evaluating input", () => {
    const result = runTerminalCommand("find ai", context);

    assert.equal(result.lines.length, 4);
    assert.equal(result.lines[0].href, "/portfolio/cattle-detector");
    assert.equal(result.lines[2].href, "/blog/testing-ai");
  });

  test("opens a known project slug", () => {
    const result = runTerminalCommand("open cattle-detector", context);

    assert.deepEqual(result.action, {
      type: "navigate",
      target: "/portfolio/cattle-detector",
    });
  });

  test("returns a useful error for unknown commands", () => {
    const result = runTerminalCommand("sudo make coffee", context);

    assert.equal(result.lines[0].kind, "error");
    assert.match(result.lines[0].text, /command not found/);
  });

  test("supports clearing the session", () => {
    const result = runTerminalCommand("clear", context);

    assert.deepEqual(result.action, { type: "clear" });
  });

  test("lists and enters virtual content directories", () => {
    const listing = runTerminalCommand("ls", context);
    const changeDirectory = runTerminalCommand("cd articles", context);
    const articleListing = runTerminalCommand("ls", {
      ...context,
      currentDirectory: "~/articles",
    });

    assert.deepEqual(
      listing.lines.map((line) => line.text),
      ["articles/", "projects/", "contributions/"],
    );
    assert.deepEqual(changeDirectory.action, {
      type: "change-directory",
      target: "~/articles",
    });
    assert.equal(articleListing.lines[0].text, "testing-ai.md");
  });

  test("completes commands and directory entries", () => {
    assert.deepEqual(getTerminalCompletions("neo", context), ["neofetch"]);
    assert.deepEqual(getTerminalCompletions("cd art", context), ["articles/"]);
    assert.deepEqual(
      getTerminalCompletions("cat test", { ...context, currentDirectory: "~/articles" }),
      ["testing-ai.md"],
    );
  });

  test("renders EndeavourOS with system information on its right", () => {
    const result = runTerminalCommand("neofetch", context);
    const output = result.lines[0].text;
    const hostLine = output.split("\n").find((line) => line.includes("Host: Oskar Wichtowski"));

    assert.match(output, /\.\/o\./);
    assert.ok(hostLine);
    assert.ok(hostLine.indexOf("Host: Oskar Wichtowski") >= 48);
    assert.doesNotMatch(output, /\|o_o \|/);
  });
});
