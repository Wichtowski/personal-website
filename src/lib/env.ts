type EnvValue = string | undefined;

function readEnv(key: string): EnvValue {
  const value = process.env[key];
  return value && value.length > 0 ? value : undefined;
}

export const env = {
  GITHUB_TOKEN: readEnv("GITHUB_TOKEN"),
  LASTFM_API_KEY: readEnv("LASTFM_API_KEY"),
  LASTFM_SHARED_SECRET: readEnv("LASTFM_SHARED_SECRET"),
  LASTFM_USERNAME: readEnv("LASTFM_USERNAME"),
};
