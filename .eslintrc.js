module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  ignorePatterns: ["src/test"],
  plugins: ["react", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "react-app",
    "react-app/jest",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "arrow-body-style": ["warn", "never"],
    "no-console": "warn",
    "no-alert": "warn",
    "no-else-return": "warn",
    "no-implicit-coercion": "warn",
    "no-return-assign": "warn",
    "no-void": "warn",
    "no-useless-return": "warn",
    camelcase: "warn",
    "func-style": ["warn", "declaration", { allowArrowFunctions: true }],
    "@typescript-eslint/no-unused-vars": "off",
    "react/react-in-jsx-scope": "off",
  },
};
