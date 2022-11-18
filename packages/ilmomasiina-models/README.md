# `ilmomasiina-models`

This package provides type definitions for the [Ilmomasiina](https://github.com/Tietokilta/ilmomasiina) API.

Frontend developers should import the supported types directly from `@tietokilta/ilmomasiina-models`. The files in
`dist` are not part of the public interface and are only to be used by the backend.
(The frontend code in this repository deviates from this rule due to our monorepo setup &ndash; please update your
imports if you fork our frontend without the backend.)

**Note:** This package follows the versioning of Ilmomasiina. We will avoid breaking changes in the API, but minor
versions may occasionally be incompatible with each other. If writing custom frontends, we recommend fixing the
minor version (`"@tietokilta/ilmomasiina-models": "~2.x.x"` in `package.json`).
