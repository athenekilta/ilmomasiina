# Installation

For [development instructions](#development), see below.

## Production

In production, we strongly recommend using Docker.

TODO: Initial database setup instructions. (Outdated instructions commented out below.)

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

### Azure

Tietokilta uses Azure to run Ilmomasiina. Azure gives credits for free to non-profits which are more than enough for this.

1. Create an Azure App Service instance with your Docker image.
2. Set relevant variables from [.env.example](../.env.example) as App Settings.
3. Access the app at https://{your-app-name}.azurewebsites.net/.
4. On first run, follow the instructions in [_Creating the first admin user_](#creating-the-first-admin-user).
Run in Azure App Service.

### Docker Compose

You can use Docker Compose to run a database and production container locally. Currently, we don't actively test this
configuration.

1. Create a `.env` file at the root of this repository. You can copy [.env.example](../.env.example) to begin.
2. Modify `args` in `docker-compose.prod.yml` for frontend customization.
3. Run `docker-compose -f docker-compose.prod.yml up` manually or e.g. via `systemd`.
4. Access the app at <http://localhost:8000>.
5. On first run, follow the instructions in [_Creating the first admin user_](#creating-the-first-admin-user).

### Docker (manual)

If you already have a database, you can run a plain Docker container.

1. Create a `.env` file at the root of this repository. You can copy [.env.example](../.env.example) to begin.
2. Build your image:
    ```
    docker build \
      --build-arg BRANDING_HEADER_TITLE_TEXT='Tietokillan ilmomasiina' \
      --build-arg BRANDING_FOOTER_GDPR_TEXT='Tietosuoja' \
      --build-arg BRANDING_FOOTER_GDPR_LINK='https://example.com' \
      --build-arg BRANDING_FOOTER_HOME_TEXT='Kotisivu' \
      --build-arg BRANDING_FOOTER_HOME_LINK='https://example.com' \
      -t ilmomasiina
    ```
3. Run manually or with e.g. `systemd`:
    ```
    docker run -it --rm --init --env-file=.env -p 3000:3000 ilmomasiina
    ```
   You might have to add stuff here to e.g. allow database connections.
4. Access the app at <http://localhost:3000>.
5. On first run, follow the instructions in [_Creating the first admin user_](#creating-the-first-admin-user).

### Running without Docker

You can also set up a production deployment without Docker, but we don't recommend it.

1. Install a suitable Node version (e.g. using nvm).
2. Run `npm install -g pnpm@7` to install pnpm. Then run `pnpm install --frozen-lockfile` to setup cross-dependencies
   between packages and install other dependencies.
3. Create a `.env` file at the root of this repository. You can copy [.env.example](../.env.example) to begin.
4. Run `npm run clean` followed by `npm run build`.
5. Use e.g. `systemd` or `pm2` (`npm install -g pm2`) to run the server process:
    ```
    node packages/ilmomasiina-backend/dist/bin/server.js
    ```
6. Access the app at <http://localhost:3000>.
7. On first run, follow the instructions in [_Creating the first admin user_](#creating-the-first-admin-user).

### Email sending

Mailgun is relatively cheap and can be enabled via env variables. With minor changes, sending mail
could be also done via Sendgrid or other services (Ilmomasiina uses Nodemailer).

Using your own mail server gets you labelled as spam easily and should be avoided in production. However, you can
configure SMTP servers via env variables if you wish.

### Reverse proxy

If you want to serve ilmomasiina from a subdirectory of your website, you need to set up reverse proxying.

**Note:** This will also require changing the `PATH_PREFIX` env variable when building the frontend or container.

For example, in Apache `.htaccess`:

```apache
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

### Creating the first admin user

By default, only logged-in admin users can create new admin users using the `/admin` endpoint.
To create the first user on a new system, admin registration needs to be allowed.

Allow admin registration temporarily by adding the env variable `ADMIN_REGISTRATION_ALLOWED=true`.

Now, create a new user with POST request to `/api/users`. For example, using `curl`:
```
curl 'http://localhost:3000/api/users' \
    -H 'Content-Type: application/json' \
    --data '{ "email": "user@tietokilta.fi", "password": "password123" }'
```

**Important**: After creating the first user, disallow admin user creation by removing the env variable and restarting
Ilmomasiina.

## Development

In development, we recommend running *without* Docker. It's easier to use in most cases.

### Running without Docker

1. Install a suitable Node version (e.g. using nvm).
2. Install Postgres or MySQL. You can use Docker for this. SQLite may also work, but is not currently tested.
3. Create a `.env` file at the root of this repository. You can copy [.env.example](../.env.example) to begin.
4. Run `npm install -g pnpm@7` to install pnpm. Then run `pnpm install --frozen-lockfile` to setup cross-dependencies
   between packages and install other dependencies.
5. Run `npm start`. This will start the frontend and backend dev servers in parallel.
   - If you want cleaner output, you can run `npm start` separately in `packages/ilmomasiina-frontend` and
     `packages/ilmomasiina-backend`.
6. Access the app at <http://localhost:3000>.
7. On first run, follow the instructions in [_Creating the first admin user_](#creating-the-first-admin-user).

### Docker Compose

The entire development setup can also be run within Docker using Docker Compose. The
[docker-compose dev setup](../docker-compose.yml) is located at the root of this repository, and contains a
pre-configured Postgres server, so an external database server is not required.

1. Create a `.env` file at the root of this repository. You can copy [.env.example](../.env.example) to begin.
2. Go to the repository root and run `docker-compose up`. This builds the dev container and starts the frontend and
   backend servers in parallel.
3. Access the app at <http://localhost:3000>.
4. On first run, follow the instructions in [_Creating the first admin user_](#creating-the-first-admin-user).

Due to how the dev Docker is set up, you will still need to rebuild the development image if you change the
dependencies, package.json or ESLint configs. You'll also need Node.js and pnpm installed locally to do that.
