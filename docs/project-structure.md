# Project structure

The project uses [pnpm](https://pnpm.io/) to manage the code in separate packages. This allows for cleaner code
and package files.

To prepare for development, pnpm must bootstrap the cross-dependencies between projects. To do this, install pnpm and
then simply run `pnpm install` or `npm run bootstrap`.

The project is configured to run development servers for the frontend and backend with `npm start`. In development,
the frontend's `scripts/dev.ts` serves the frontend and proxies API calls to the backend server.

In production, the backend server can optionally serve the compiled frontend bundle, but ideally a separate reverse
proxy such as Nginx is used for this purpose.

## Packages

The project is divided into three packages:

- `ilmomasiina-models` contains the single source of truth for the data model and API:
    - The JS column types for DB models. These are implemented by the concrete Sequelize models.
    - The API models, derived mostly by picking columns from the DB models.
    - Utility interfaces that convert Dates in the API models to strings, for frontend typings.
- `ilmomasiina-backend` contains the backend code and depends on `ilmomasiina-models`.
- `ilmomasiina-frontend` contains the frontend code, along with scripts and dependencies inherited from `npm eject`.
  It also depends on `ilmomasiina-models` but not `ilmomasiina-backend`.
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
- `react-scripts` for building (unfortunately, ejected with slight customizations)
- [SCSS](https://sass-lang.com/)
- [Redux](https://redux.js.org/) and [React Redux](https://react-redux.js.org/)
    - Some state is handled locally, if there's no need to share it between components
- [React Router](https://reactrouter.com/)
- [Formik](https://formik.org/)
- [MomentJS](https://momentjs.com/) - will transition to something else in the future

## Usage

To modify the app, fork the repository and modify the code to your needs. If you don't modify `ilmomasiina-models`,
your modified backend or frontend should be compatible with unmodified versions.
Don't forget to submit a PR if your code might be useful to others!

To build a new API client, import `ilmomasiina-models`.

To build a new web UI, either just import `ilmomasiina-models`, or import components from `ilmomasiina-frontend`.
