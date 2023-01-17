# `ilmomasiina-components`

This package provides ready-to-use building blocks for [Ilmomasiina](https://github.com/Tietokilta/ilmomasiina)
frontends.

Frontend developers should import the supported items directly from `@tietokilta/ilmomasiina-components`. Most files
in `dist` are not part of the public interface. (The files in `dist/utils` are also public, but likely less stable.)

**Note:** This package follows the versioning of Ilmomasiina. We will avoid breaking changes in the API, but minor
versions may occasionally be incompatible with each other. If writing custom frontends, we recommend fixing the
minor version (`"@tietokilta/ilmomasiina-components": "~2.x.x"` in `package.json`).

## Importing React routes

This package exports three route components: `Events`, `SingleEvent`, and `EditSignup`. These are self-contained routes
for Ilmomasiina using `react-bootstrap` 1.x (Bootstrap 4.x) components, and may be rendered inside your own router.

If you are using non-standard paths or a path prefix, these components should be wrapped in a `PathsContext` to provide
them with the correct paths for links. You may also wrap them in an `AuthContext` if you know that the user is
authenticated to Ilmomasiina.

In order to allow style customization, styles are not imported by our TS files. You'll need to `@use` either
`@tietokilta/ilmomasiina-components/src/_all.scss` or individual component styles manually. You can
[override variables](https://sass-lang.com/documentation/at-rules/use#reassigning-variables) from `_definitions.scss`
before that. (This setup is currently hacky and may be replaced in the future.)

In addition, you'll want to import suitable (or all) parts of Bootstrap 4's SCSS. This works best if you have a
Bootstrap 4 based app, or if you import Bootstrap nested inside your own wrapper CSS class.

## Creating custom React routes

If you want to use a different framework or more heavily customize the layout, you can instead copy or reimplement the
code under `src/routes`, and import only the API adapters. For each of the views, the package exports the
`use{ViewName}Context` hook and `{ViewName}Provider` component (and also the `use{ViewName}State` hook). For more
context on these, see [docs/state-context.md](https://github.com/Tietokilta/ilmomasiina/blob/dev/docs/state-context.md).
