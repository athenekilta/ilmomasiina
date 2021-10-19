module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": [
      "packages/ilmomasiina-api/tsconfig.json",
      "packages/ilmomasiina-frontend/tsconfig.json",
      "packages/ilmomasiina-server/tsconfig.json"
    ],
    "tsconfigRootDir": __dirname
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
    "max-len": ["error", 120, 2],
    "@typescript-eslint/semi": ["error", "always"],
    "@typescript-eslint/quotes": ["error", "single"],
    // To allow grouping of class members - especially for Models.
    "@typescript-eslint/lines-between-class-members": "off",
    // TypeScript causes lots of circular imports for types, which the plugin
    // does not currently handle properly.
    // see https://github.com/benmosher/eslint-plugin-import/issues/1453
    "import/no-cycle": "off",
    // Not usable with formik.
    "react/jsx-props-no-spreading": "off",
    // TypeScript validates prop types, no need for this.
    "react/require-default-props": "off",
    // Definitely a valid performance concern, but implementing this correctly is
    // a giant PITA - the default config ignores arrow functions but they don't solve
    // the problem at all, and useCallback is just plain ugly.
    "react/jsx-no-bind": "off",
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
