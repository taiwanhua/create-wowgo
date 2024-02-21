const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "@vercel/style-guide/eslint/node",
    "@vercel/style-guide/eslint/typescript",
    // "@vercel/style-guide/eslint/browser",
    // "@vercel/style-guide/eslint/react",
    // "@vercel/style-guide/eslint/next",
    // "eslint-config-turbo",
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: ["only-warn"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
      // node: {
      //   extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
      // },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "dist/",
    "node_modules/",
  ],
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
  // add rules configurations here
  rules: {
    "import/no-default-export": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          kebabCase: true,
          camelCase: true,
          snakeCase: true,
          pascalCase: true,
        },
      },
    ],
    // "import/no-unresolved": "off",
    "import/no-absolute-path": "off",
  },
};
