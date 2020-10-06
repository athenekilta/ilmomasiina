# Contribution Guidelines
Here are some guidelines for contributing to Ilmomasiina. As the name suggests, these are not strict rules.

## Creating issues
Issues are great for tracking suggestions, bug reports and other stuff.
1. Head to [issues](https://github.com/athenekilta/ilmomasiina/issues) and click `New issue`.
1. Write a clear title, that gives an idea what your issue is all about. Example: `Suggestion: Add contribution guidelines` or `Event description sometimes overflows`.
1. Write a descriptive comment about the bug/feature/idea you have.
1. Add a screenshot of the issue/idea, if applicable.
1. If you have an idea how this could be solved, you can add it to the description.

## Adding commits
1. If you have write access to this repository, you can create a new branch directly to this repo. Otherwise, you should fork the repository.
1. Change files, commit (see below), push
1. When the change is ready for review, create a pull request
1. Add a reviewer or two - the CTO of Athene is always a good choice (see [https://athene.fi/hallinto/toimihenkilot/](https://athene.fi/hallinto/toimihenkilot/))
1. Add descriptive comment: what is changed and why. A screenshot of change is not a bad idea.
1. Create your pull request :tada:

## Commits and commit messages
### When to commit
Aim to commit only one change at a time, and to include the one change completely in one commit.
### How to write great commit messages
The first line is the subject line. Use imperative tense and try to summarize the change in 50 characters (at most). Subject starts with a capital letter and does not end with a period. Sometimes the subject is not enough, then you should add one blank line after the subject line and write freely about the change, preferably what has been changed and why. Also, include any issues that are related to this commit.
#### Example
```
Add Ubuntu related instructions

Previously setup instructions were MacOS specific, this commit adds Ubuntu related instuctions (mysql setup is different).

Fixes #1337
```

## Code style
TODO
