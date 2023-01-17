# Ilmomasiina

This folder contains documentation files for Ilmomasiina.

If you're interested in using Ilmomasiina for your purposes, these might be for you:
- [Installation](installation.md) of a new instance
- [Migration](migration.md) from the Athene version to 2.0.0 and from there to later versions
- [Hacking Ilmomasiina](hacking.md) to suit your purposes

To start contributing to the project, read at least:
- [Development setup](installation.md#development)
- [Project structure](project-structure.md), to get familiar with where everything is and what technologies we use.
  Especially important if you worked on the Athene version, as this has changed **a lot**.
- [Data model](data-model.md), to get familiar with the logic of the application. This hasn't changed significantly
  since the Athene version.

Other technical documentation:
- [`createStateContext`](state-context.md), the `useContext` wrapper used in `ilmomasiina-components`.
  Relevant if you want to develop that package.
- [Signup logic](signup-logic.md), documents the exact business logic behind signups, quotas and queueing
