# Hacking Ilmomasiina

This document presents a few ways you might want to use Ilmomasiina outside our pre-packaged image.

## Embedding

To embed events on your site, import components from `ilmomasiina-components`, or go fully custom with API models
from `ilmomasiina-models` (see [API](#api)).

In order to allow style customization, styles are not imported by the TS files. You'll need to `@use` either
`_all.scss` or individual component styles manually. You can
[override variables](https://sass-lang.com/documentation/at-rules/use#reassigning-variables) from `_definitions.scss`
before that.

In addition, you'll want to import suitable parts of Bootstrap's SCSS. (TODO: make a nice way of doing this)

## App customization

**If you only wish to change colors and texts,** you might want to avoid forking our repo. Instead, write a
GitHub Action that clones this repo (as a submodule or directly), replaces `_definitions.scss` through a modified
`Dockerfile`, and builds your own Docker image. This makes your update process trivial when this repo is updated.

If you fork the repository and don't modify `ilmomasiina-models`,
your modified backend or frontend should be compatible with the current unmodified versions.
Don't forget to submit a PR if your code might be useful to others!

## API

To build a new API client, import `ilmomasiina-models` and use your fetch library of choice. `dist/services` has
type definitions for the API, while `dist/models` is intended for backend use.
