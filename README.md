# Ilmomasiina

Ilmomasiina is the event registration system originally created by Athene, forked by Tietokilta and currently under
heavy development for our new site. Once finished, it will be available for all organizations to use, along with
migration tools from the Athene-made version.

The latest development version is in the `dev` branch. **Please note that the code is currently in alpha phase.**
It likely has major bugs, and easy migrations will not be provided between versions until we reach beta.

## Contributing

Progress and planning is tracked in GitHub issues.
Please see and update the [project board](https://github.com/Tietokilta/ilmomasiina/projects/1) for ongoing work.

All help is appreciated. Please contact @PurkkaKoodari or another member of Tietokilta's Digitoimikunta if you wish to
actively help with development &ndash; there are still major changes to be done that may conflict with yours.
Start by reading the [docs](docs/README.md) to get familiar with the project.

## Documentation

See the [docs](docs/README.md) folder.

## Requirements

- If using Docker:
   - Docker: 17.04.0+
   - docker-compose or Compose V2 *(optional)*
- For development, or if running without Docker:
   - Node.js 14+
   - npm 6+
   - pnpm 7+

To run the project (dev or production), only Docker and Docker Compose are required.
For actual development, you'll want to have Node.js and pnpm installed locally in order to manage dependencies.

## Installation

See [installation.md](docs/installation.md).

## For developers

See the [documentation](docs/README.md) for more information.
