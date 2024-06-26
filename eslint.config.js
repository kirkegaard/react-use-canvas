export default [
  {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 11,
      sourceType: "module",
    },
    extends: [
      "eslint:recommended",
      "prettier",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
    ],
    env: {
      es6: true,
      node: true,
      browser: true,
    },
    settings: {
      react: {
        version: "18",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-unused-vars": [
        1,
        {
          vars: "all",
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": [
        "error",
        {
          allow: ["error", "info", "warn"],
        },
      ],
    },
  },
];
