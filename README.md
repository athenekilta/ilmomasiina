# Current status

```diff
- Hello you random bypasser! 

- Ilmomasiina is currently at alpha testing phase. You use it. Something breaks? You fix it.

- In case you're interested in development. We heavily recommend you to contact @peksi

```

Current development is being held on `otax/production` branch.


# Ilmomasiina

Ilmomasiina is Athene's event registration system.

## Requirements

- Node.js `^8.9.4`
- npm `^5.6.0`
- MySQL `^8.0`
- (optional) Docker and Docker-compose

## Setup the development environment 

Create an `.env` file at the root of the project. For the contents of the .env file, check [ENV.MD](./ENV.MD)

## Option 1: Docker-compose
Fastest way to get started, which involves the less requirements and setup. If you do not have docker and docker-compose, follow this [link to get started](https://docs.docker.com/compose/install/)

From the root folder, run `docker-compose up` and you should be able to reach the app at `localhost:3000`.
When you change the source code and would like to update the changes to the container, run `docker-compose build` followed by `docker-compose-up`.

To generate random fake data to the database, run `docker exec -it ilmomasiina_backend_1 npm run create-fake-data`.

It is not required to build the docker image once changes are made: `./bin`, `./src`, `./servcer`, `./public` and `./config` are automatically synced to the container. If you do modify files in these paths, reload the web page and changes should be seen.

When changes are made to other directories, run `docker-compose build` followed by `docker-compose up`. Though these paths do not contain components that are directly used by the web app at runtime.

## Option 2: install locally all dependencies
The following sections help you setup locally dependencies to run the app.

### MYSQL Setup
#### Mac
1. Install `mysql` (8.x) with Homebrew (https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e)
2. Start the mysql service with `brew services start mysql`
3. Open the mysql terminal with `mysql -u root`
4. In the mysql terminal, create a new user e.g. `CREATE USER 'juuso'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`
5. Fix permissions (this is probably too permissive, but it works): `GRANT ALL PRIVILEGES ON *.* TO 'sampo'@'localhost' WITH GRANT OPTION;`
6. Type `exit` to exit the mysql terminal, and sign in with your new user e.g. `mysql -u juuso -p password`
7. Create the `ilmomasiina` database with `CREATE DATABASE ilmomasiina;`

#### Ubuntu
1. Install mysql with `sudo apt install mysql-server`
2. Service should start automatically
3. Same as with Mac, but use `sudo mysql -u root`
4. Follow Mac instructions
5. Fix permissions (this is probably too permissive, but it works): `GRANT ALL PRIVILEGES ON *.* TO 'sampo'@'localhost' WITH GRANT OPTION;`
6. Exit with `exit` and sign in with your new user e. g. `mysql -u juuso -p` (don't use `mysql -u juuso -p password`)
7. Follow Mac instructions step 6 

#### Debian GNU/Linux (9 and above)
Debian includes [MariaDB instead of MySQL](https://wiki.debian.org/MySql) in Debian Stretch and above.
Below instructions are written using `mariadb  Ver 15.1 Distrib 10.5.12-MariaDB`.

1. Install MariaDB with `sudo apt install mariadb-server mariadb-client`
2. Service should start automatically
3. Open the MariaDB terminal with `sudo mysql -u root`
4. In the MariaDB terminal, create a new user e.g. `CREATE USER 'sampo'@'localhost' IDENTIFIED BY 'paste_your_random_password_here';`
5. Create the `ilmomasiina` database with `CREATE DATABASE 'ilmomasiina';`
6. Grant permission for your new user: `GRANT ALL PRIVILEGES ON ilmomasiina.* TO 'sampo'@'localhost';`
7. Exit with `exit`

If needed (during development), you can sign in with your user using command like `mysql -u sampo -p`

### Getting started

1. `npm install`
2. `npm start`

**Optional**: You can create mockup data for development by running `npm run create-fake-data`. During development, database can be resetted with `npm run reset-db`.

### Troubleshooting (Ubuntu)
If `npm start` gives error `Error: You must provide a 'secret' in your authentication configuration`, it probably means that the `.env` file is not loaded correctly. A quick fix for this is to run `export $(cat .env)` in project root directory.

## Mailgun setup

Mailgun provides 10 000 free messages per month which is suitable for small projects. With minor changes sending mail could be also done via Sendgrid. Using your own mail server gets you labelled as spam pretty fast.

Add mailgun credentials to .env configuration.

### Create first admin user

Add this line to .env configuration.

```
ADMIN_REGISTRATION_ALLOWED=true
```

Create new user with POST request.

```
curl 'http://localhost:3000/api/users' -H 'Content-Type: application/json' --data-binary '{ "email": "ville@athene.fi", "password": "password" }'
```

**Important**: Disallow admin user creation by removing the line.

By default, only logged in admin users can create new admin users (via `/admin`).

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
BASE_URL=https://athene.fi
PREFIX_URL=/ilmo
PORT=2011
```

With some hosting providers (such as Otax) you might need to request the access to the port.
Running production version within pm2 is recommended

## Updating production
On ilmomasiina directory:

```
git pull
npm run compile
pm2 restart prod-server
```

There's a script that runs the above on the home directory of `athene` at otax, so you can just

```zsh
ssh otax
./update_ilmomasiina_production.sh
```

when updating Athene's instance.

## Documentation

See docs folder.

## Contributing

All help is appreciated. Please contact a fellow committer first.
