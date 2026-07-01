import fs from "node:fs";
import path from "node:path";

// Load local .env if it exists and process.env matches
const envPath = path.resolve(".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const firstEquals = trimmed.indexOf("=");
    if (firstEquals === -1) continue;
    const key = trimmed.slice(0, firstEquals).trim();
    const value = trimmed.slice(firstEquals + 1).trim();
    // Strip quotes if any
    const cleanValue = value.replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) {
      process.env[key] = cleanValue;
    }
  }
}

const configPath = path.resolve("wrangler.json");
if (!fs.existsSync(configPath)) {
  console.error("wrangler.json not found!");
  process.exit(1);
}

try {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  // Define vars to inject
  const secretsToInject = ["LASTFM_API_KEY", "LASTFM_USERNAME", "LASTFM_SHARED_SECRET"];

  config.vars = config.vars || {};

  let injectedCount = 0;
  for (const secret of secretsToInject) {
    const val = process.env[secret];
    if (val) {
      config.vars[secret] = val;
      injectedCount++;
    }
  }

  if (injectedCount > 0) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
    console.log(`Successfully injected ${injectedCount} environment variables into wrangler.json`);
  } else {
    console.log("No environment variables resolved for injection.");
  }
} catch (error) {
  console.error("Failed to inject environment variables into wrangler.json:", error);
  process.exit(1);
}
