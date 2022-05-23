# Ilmomasiina

This folder contains documentation files for Ilmomasiina.

Administrator documentation:
- [Migration](migration.md) from the Athene version to 2.0.0 and from there to later versions

To start contributing to the project, read at least:
- [Project structure](project-structure.md), to get familiar with where everything is and what technologies we use.
  Especially important if you worked on the Athene version, as this has changed **a lot**.
- [Data model](data-model.md), to get familiar with the logic of the application. This hasn't changed significantly
  since the Athene version.
- [`createStateContext` and `createReducerContext`](state-context.md), the custom `useReducer` wrapper used instead
  of Redux.

Other technical documentation:
- [Signup logic](signup-logic.md), documents the exact business logic behind signups, quotas and queueing
