# `ilmomasiina-components`

This package provides ready-to-use building blocks for [Ilmomasiina](https://github.com/Tietokilta/ilmomasiina)
frontends.

Frontend developers should import the supported items directly from `@tietokilta/ilmomasiina-components`. The files
in `dist` are not part of the public interface, except for `dist/utils`.
(The frontend code in this repository deviates from this rule due to our monorepo setup &ndash; please update your
imports if you fork our frontend without the backend.)

In order to allow style customization, styles are not imported by our TS files. You'll need to `@use` either
`@tietokilta/ilmomasiina-components/src/_all.scss` or individual component styles manually. You can
[override variables](https://sass-lang.com/documentation/at-rules/use#reassigning-variables) from `_definitions.scss`
before that. (This setup is currently hacky and may be replaced in the future.)

In addition, you'll want to import suitable (or all) parts of Bootstrap 4's SCSS. This works best if you have a
Bootstrap 4 based app, or if you import Bootstrap nested inside your own wrapper CSS class.

**Note:** This package follows the versioning of Ilmomasiina. We will avoid breaking changes in the API, but minor
versions may occasionally be incompatible with each other. If writing custom frontends, we recommend fixing the
minor version (`"@tietokilta/ilmomasiina-components": "~2.x.x"` in `package.json`).
