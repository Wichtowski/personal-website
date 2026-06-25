const lintStagedConfig = {
  "*.{js,jsx,ts,tsx,mjs,cjs}": ["prettier --write", "eslint --fix"],
  "*.{json,md,mdx,yml,yaml,css,scss,html}": ["prettier --write"],
};

export default lintStagedConfig;
