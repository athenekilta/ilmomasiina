# Ilmomasiina

Ilmomasiina is Athene's event registration system.

## Requirements
* Node.js `^8.9.4`
* npm `^5.6.0`
* MySQL

## Getting started

1. Create database in MySQL.
1. Create file `config/ilmomasiina.config.js` based on `config/ilmomasiina.config.example.js`.
1. `npm install`
1. `npm start`

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
