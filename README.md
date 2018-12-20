# Ilmomasiina

Ilmomasiina is Athene's event registration system.

## Requirements
* Node.js `^8.9.4`
* npm `^5.6.0`
* MySQL `^8.0`

## MYSQL Setup (Mac)

1. Install `mysql` (8.x) with Homebrew (https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e)
2. Start the mysql service with `brew services start mysql`
3. Open the mysql terminal with `mysql -u root`
4. In the mysql terminal, create a new user e.g. `CREATE USER 'juuso'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`
5. Type `exit` to exit the mysql terminal, and sign in with your new user e.g. `mysql -u juuso -p password`
6. Create the `ilmomasiina` database with `CREATE DATABASE ilmomasiina;`


## Getting started

1. Create an `.env` file at the root of the project. For the contents of the .env file, check `ENV.MD`
2. `npm install`
3. `npm start`

**Optional**: You can create mockup data for development by running `npm run create-fake-data`. During development, database can be resetted with `npm run reset-db`.

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

## Documentation

See docs folder.

## Contributing

Coming
