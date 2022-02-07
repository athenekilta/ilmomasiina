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
   - docker-compose or Compose V2 (included in the latest releases of docker-cli)
- For development, or if running without Docker:
   - Node.js: 14+
   - npm: 6+

To run the project (dev or production), only Docker and Docker Compose are required.
For actual development, you'll want to have Node.js and npm installed locally in order to manage dependencies.

<!--
### Create fake data
Use `docker exec ilmomasiina_backend_1 npm run create-fake-data` to create some data to dockerized Ilmomasiina.
The server does not like an empty database, so this is a really good idea to do when first starting the server.
-->

<!--
## MySQL Setup
Only follow this if you don't use the Docker container.

### Mac
1. Install `mysql` (8.x) with Homebrew (https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e)
2. Start the mysql service with `brew services start mysql`
3. Open the mysql terminal with `mysql -u root`
4. In the mysql terminal, create a new user e.g.
   `CREATE USER 'juuso'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`
5. Fix permissions (this is probably too permissive, but it works):
   `GRANT ALL PRIVILEGES ON *.* TO 'sampo'@'localhost' WITH GRANT OPTION;`
6. Type `exit` to exit the mysql terminal, and sign in with your new user e.g. `mysql -u juuso -p password`
7. Create the `ilmomasiina` database with `CREATE DATABASE ilmomasiina;`

### Ubuntu
1. Install mysql with `sudo apt install mysql-server`
2. Service should start automatically
3. Same as with Mac, but use `sudo mysql -u root`
4. Follow Mac instructions
5. Fix permissions (this is probably too permissive, but it works): `GRANT ALL PRIVILEGES ON *.* TO 'sampo'@'localhost' WITH GRANT OPTION;`
6. Exit with `exit` and sign in with your new user e. g. `mysql -u juuso -p` (don't use `mysql -u juuso -p password`)
7. Follow Mac instructions step 6
-->

## Production setup

TODO. (This file has lots of outdated information as comments.)

## For developers

See the [documentation](docs/README.md) for more information.

### Development setup using Docker Compose

The entire development setup can be run within Docker using Docker Compose. The
[docker-compose dev setup](./docker-compose.yml) is located at the root of this repository, and contains a
pre-configured Postgres server, so an external database server is not required.

1. Create a `.env` file at the root of this repository. You can copy [.env.example](./.env.example) to begin.
2. Go to the repository root and run `docker-compose up`. This builds the dev container and starts the frontend and
   backend servers in parallel.
3. Access the app at <http://localhost:3000>.

Due to how the dev Docker is set up, you will need to rebuild the development image if you change the dependencies,
package.json or ESLint configs.

### Non-containerized development setup

You can also run the development server outside Docker.

1. Install Postgres or MySQL. You can use Docker for this. SQLite may also work. but is not currently tested.
2. Create a `.env` file at the root of this repository. You can copy [.env.example](./.env.example) to begin.
3. Run `npm install` to install Lerna and other global dependencies. The postinstall script should automatically run
   `lerna bootstrap` to setup cross-dependencies between packages and install package dependencies.
4. Run `npm start`. This will start the frontend and backend dev servers in parallel.
   - If you want cleaner output, you can run `npm start` separately in `packages/ilmomasiina-frontend` and
     `packages/ilmomasiina-backend`.
   - Currently, there is no way to run the Webpack development server directly within the backend process.
5. Access the app at <http://localhost:3000>.

<!-- TODO
### Creating first admin user
> By default, only logged-in admin users can create new admin users using the `/admin` endpoint.
> To create the first one, admin registration needs to be allowed.

Allow admin registration temporarily by adding this line to the `.env` file:
```
ADMIN_REGISTRATION_ALLOWED=true
```

If the Ilmomasiina was already running, restart it to apply the new env configuration.

Now, create a new user with POST request to `/admin`.
Below is an example using curl:
```
curl 'http://localhost:3000/api/users' \
     -H 'Content-Type: application/json' \
     --data-binary '{ "email": "ville@athene.fi", "password": "password" }'
```

**Important**: Disallow admin user creation by removing the previously added line from the `.env` file and restarting
the docker containers.

## Mailgun setup

Mailgun provides 10 000 free messages per month which is suitable for small projects. With minor changes sending mail could be also done via Sendgrid. Using your own mail server gets you labelled as spam pretty fast.

Add mailgun credentials to .env configuration.

## Production

**Important**: Ilmomasiina is currently on alpha stage. Use it with your own risk.

Example of `.htaccess` config:

```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^ilmo$ ilmo/ [NC,R=301,L]
    RewriteRule ^ilmo/$ http://0.0.0.0:2011/ [P,L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ilmo/(.*)$ http://0.0.0.0:2011/$1 [P,L]
</IfModule>
```

Example of relevant lines in .env file

```
EMAIL_BASE_URL=https://athene.fi
PATH_PREFIX=/ilmo
PORT=2011
```

With some hosting providers (such as Otax) you might need to request the access to the port.
Running production version within pm2 is recommended

### Updating production

```
git pull otax/master
npm run compile
pm2 restart prod-server
```
-->