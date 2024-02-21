const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    require.resolve("@vercel/style-guide/eslint/node"),
    require.resolve("@vercel/style-guide/eslint/typescript"),
    require.resolve("@vercel/style-guide/eslint/browser"),
    require.resolve("@vercel/style-guide/eslint/react"),
    require.resolve("@vercel/style-guide/eslint/next"),
    "eslint-config-turbo",
  ],
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
    //
    // "import/no-absolute-path": "off",
    // "import/no-default-export": "off",
    // "@typescript-eslint/no-unsafe-member-access": "off",
    // "@typescript-eslint/no-unsafe-call": "off",
    // "@typescript-eslint/no-unsafe-assignment": "off",
    // "unicorn/filename-case": [
    //   "error",
    //   {
    //     cases: {
    //       kebabCase: true,
    //       camelCase: true,
    //       pascalCase: true,
    //       snakeCase: true,
    //     },
    //     ignore: ["useSx.ts", "useIsUATStore.ts"],
    //   },
    // ],
    // "react/function-component-definition": "off",
  },
};
