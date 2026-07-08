import fs from "node:fs";
import path from "node:path";

/**
 * Generates a git-ignored wrangler config from the committed `wrangler.json`
 * template, injecting secrets and the KV namespace id from the local
 * environment. The generated file is what the Cloudflare Vite plugin actually
 * loads (via `configPath`), so no secret ever lands in the committed config.
 *
 *   --mode=local  (default) -> wrangler.local.json, simulated local KV
 *   --mode=deploy           -> wrangler.deploy.json, real remote KV
 */

type Mode = "local" | "deploy";

const TEMPLATE_PATH = path.resolve("wrangler.json");
const OUTPUT_PATH: Record<Mode, string> = {
  local: path.resolve("wrangler.local.json"),
  deploy: path.resolve("wrangler.deploy.json"),
};

// Secret values that must never be committed to the template.
const SECRET_VARS = [
  "GITHUB_TOKEN",
  "LASTFM_API_KEY",
  "LASTFM_SHARED_SECRET",
  "LASTFM_USERNAME",
] as const;

interface KvNamespace {
  binding: string;
  id?: string;
  remote?: boolean;
}

interface WranglerConfig {
  vars?: Record<string, string>;
  kv_namespaces?: KvNamespace[];
  routes?: unknown;
  [key: string]: unknown;
}

function parseMode(): Mode {
  const flag = process.argv.find((arg) => arg.startsWith("--mode="));
  const value = flag ? flag.split("=")[1] : process.argv.includes("--deploy") ? "deploy" : "local";
  if (value !== "local" && value !== "deploy") {
    throw new Error(`Invalid --mode "${value}". Use --mode=local or --mode=deploy.`);
  }
  return value;
}

function loadEnvFile(file: string, override: boolean): void {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) return;

  for (const rawLine of fs.readFileSync(filePath, "utf-8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    if (override || process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function injectVars(config: WranglerConfig, mode: Mode): void {
  config.vars = { ...(config.vars ?? {}) };

  for (const key of SECRET_VARS) {
    const value = process.env[key];
    if (value) {
      config.vars[key] = value;
    } else {
      // Keep the empty placeholder for local dev; warn loudly for deploys.
      const level = mode === "deploy" ? console.warn : console.log;
      level(`  [prepare] ${key} is not set - the related feature will be disabled.`);
    }
  }
}

function configureKvNamespaces(config: WranglerConfig, mode: Mode): void {
  const kvNamespaceId = process.env.PERSONAL_WEBSITE_KV_ID;

  for (const namespace of config.kv_namespaces ?? []) {
    if (kvNamespaceId) {
      namespace.id = kvNamespaceId;
      // In local mode a real id lets us optionally read the live namespace.
      if (mode === "local") namespace.remote = true;
    } else if (mode === "deploy") {
      throw new Error("PERSONAL_WEBSITE_KV_ID is required for deploy.");
    } else {
      // Local simulated KV (Miniflare). Any non-empty id string is accepted.
      namespace.id = "local";
      delete namespace.remote;
    }
  }
}

function main(): void {
  const mode = parseMode();

  loadEnvFile(".env", false);
  if (mode === "local") loadEnvFile(".env.local", true);

  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error("wrangler.json template not found.");
  }

  const config = JSON.parse(fs.readFileSync(TEMPLATE_PATH, "utf-8")) as WranglerConfig;

  injectVars(config, mode);
  configureKvNamespaces(config, mode);

  if (mode === "local") {
    // Custom-domain routes are production-only and break local dev.
    delete config.routes;
  }

  const outputPath = OUTPUT_PATH[mode];
  fs.writeFileSync(outputPath, `${JSON.stringify(config, null, 2)}\n`);
  console.log(`  [prepare] Wrote ${path.basename(outputPath)} (${mode}).`);
}

main();
