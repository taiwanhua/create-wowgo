module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "@repo/eslint-config/vercel-react.js",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: {
    project: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  // rules: { },
};
