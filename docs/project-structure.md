# Project structure

## Package management

The project uses [pnpm](https://pnpm.io/) to manage the code in separate packages. This allows for cleaner code
and package files.

To prepare for development, pnpm must bootstrap the cross-dependencies between projects. To do this, install pnpm and
then simply run `pnpm install` or `npm run bootstrap`.

## Package dependencies

The package dependencies are slighly complicated to manage properly, so that all tooling understands them:

- Each `package.json` refers to the packages it depends on. pnpm uses these for its symlinking.
- All files are imported from `@tietokilta/ilmomasiina-foo` or `@tietokilta/ilmomasiina-foo/dist`, just as in
  non-Ilmomasiina packages depending on them.
- Each importable `package.json` specifies `exports`, including a root export and potentially other files in `./dist`.
  These point to the compiled `.js` and `.d.ts` files under `./dist`.
  `./src` is also exported and points to `.ts` files for TypeScript compilation.
- The `references` field in each `tsconfig.json` points to another `tsconfig`, so that the TypeScript compiler
  can find the source files for these imports (since `dist` will not exist yet when building).
- `ts-node` (and by extension `ts-node-dev`), which we use for the backend, doesn't understand `references`.
  Therefore, the cross-package imports are also defined in `paths` in `tsconfig.json`, which `ts-node` _does_ understand.
- ESBuild, which we use for the frontend, doesn't understand either of these natively. `paths` is used again here,
  along with a small ESBuild plugin to handle the resolving using it.

Using `references` is the only way to dynamically compile missing imported dependencies automatically. This also requires
us to use `tsc --build` for both type checking and building.

To avoid mysterious errors from TypeScript compiler instances running simultaneously on the same folder, the root
project's `package.json` specifies `--workspace-concurrency=1` to prevent pnpm from running those tasks in parallel.

## Packages

The project is divided into four packages:

- `ilmomasiina-models` contains the single source of truth for the data model and API:
    - The JS column types for DB models. These are implemented by the concrete Sequelize models.
    - The API models, derived mostly by picking columns from the DB models.
    - Utility interfaces that convert Dates in the API models to strings, for frontend typings.
- `ilmomasiina-backend` contains the backend code and depends on `ilmomasiina-models`.
- `ilmomasiina-components` contains reusable components for the user-facing parts of the frontend.
- `ilmomasiina-frontend` contains the frontend code, along with scripts and dependencies for ESBuild.
  It also depends on `ilmomasiina-models` and `ilmomasiina-components` but not `ilmomasiina-backend`.
- In addition, the root folder has a `package.json`, which is used for ESLint and other development dependencies
  that are shared between the packages. That package contains no code.

## Technologies and design choices

Many of the libraries listed below were inherited from the Athene version of the code and might be subject to change,
if it benefits the project.

- [TypeScript](https://www.typescriptlang.org/) everywhere
- [pnpm](https://pnpm.io/) to manage the multiple packages
- [Lodash](https://lodash.com/) used where necessary, but preferring native methods

### Backend

- [Sequelize](https://sequelize.org/master/) as ORM
- [Feathers](https://docs.feathersjs.com/)-based API
    - Explicitly *not* using `feathers-sequelize`, as it permits everything by default and its hooks are impossible
      to type properly
- [Express](https://expressjs.com/) as REST backend
- [Nodemailer](https://nodemailer.com/about/) to send emails

### Frontend

The frontend is built with [ESBuild](https://esbuild.github.io/) instead of Webpack. This has its advantages and
disadvantages:

- Much faster startup and build times
- [Proper support for pnpm workspaces](https://github.com/facebook/create-react-app/issues/1333), meaning we can put
  components in different packages and still have watching etc. work properly

Libraries:

- [React](https://reactjs.org/) with mostly functional components
- [Bootstrap v4](https://getbootstrap.com/docs/4.6/getting-started/introduction/) and
  [React-Bootstrap v1](https://react-bootstrap-v4.netlify.app/) for UI components
- [SCSS](https://sass-lang.com/)
- [Redux](https://redux.js.org/) and [React Redux](https://react-redux.js.org/)
    - Some state is handled locally, if there's no need to share it between components
- [React Router](https://reactrouter.com/)
- [Formik](https://formik.org/)
- [MomentJS](https://momentjs.com/) - will transition to something else in the future

## Frontend serving

The project is configured to run development servers for the frontend and backend with `npm start`. In development,
the frontend's `scripts/dev.ts` serves the frontend and proxies API calls to the backend server.

In production, the backend server can optionally serve the compiled frontend bundle, but ideally a separate reverse
proxy such as Nginx or e.g. an Azure Static Website is used for this purpose.
