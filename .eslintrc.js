module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": [
      "packages/ilmomasiina-models/tsconfig.json",
      "packages/ilmomasiina-components/tsconfig.json",
      "packages/ilmomasiina-frontend/tsconfig.json",
      "packages/ilmomasiina-backend/tsconfig.json"
    ],
    "tsconfigRootDir": __dirname,
    // https://github.com/typescript-eslint/typescript-eslint/issues/2094
    "EXPERIMENTAL_useSourceOfProjectReferenceRedirect": true
  },
  "settings": {
    "react": {
      "pragma": "React",
      "version": "16.12"
    },
  },
  "extends": [
    "airbnb",
    "airbnb/hooks",
    "airbnb-typescript"
  ],
  "plugins": [
    "@typescript-eslint",
    "promise",
    "simple-import-sort",
    "jest"
  ],
  "env": {
    "browser": true
  },
  "rules": {
    "max-len": ["error", 140, 2],
    "@typescript-eslint/semi": ["error", "always"],
    "@typescript-eslint/quotes": ["error", "single"],
    // To allow grouping of class members - especially for Models.
    "@typescript-eslint/lines-between-class-members": "off",
    // Doesn't increase code quality with redux.
    "@typescript-eslint/default-param-last": "off",
    // Allow i++ in for loops.
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    // We are targeting ES5 or higher.
    "radix": ["error", "as-needed"],
    // ...I know what I'm doing.
    "no-control-regex": "off",
    // Not usable with formik.
    "react/jsx-props-no-spreading": "off",
    // TypeScript validates prop types, no need for this.
    "react/require-default-props": "off",
    // Definitely a valid performance concern, but implementing this correctly is
    // a giant PITA - the default config ignores arrow functions but they don't solve
    // the problem at all, and useCallback is just plain ugly.
    "react/jsx-no-bind": "off",
    // Add any custom hooks here
    "react-hooks/exhaustive-deps": ["error", {
      additionalHooks: "useAbortableEffect|useAbortablePromise",
    }],
    // Prefer arrow functions to functions expressions, as that's what was done
    // when this rule was introduced.
    "react/function-component-definition": ["error", {
      namedComponents: ["function-declaration", "arrow-function"],
      unnamedComponents: "arrow-function",
    }],
    // Sort imports: React first, then npm packages, then local files, then CSS.
    "simple-import-sort/imports": [
      "error",
      {
        "groups": [
          ["^react$"],
          ["^@?\\w"],
          // Anything that does not start with a dot.
          ["^[^.]"],
          // Anything that starts with a dot, or is from one of our packages.
          ["^@tietokilta/", "^"],
          // Css
          ["css$"]
        ]
      }
    ]
  }
};
