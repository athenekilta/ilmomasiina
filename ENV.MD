# Create .env file at the root of the project with the following contents

```bash
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
MYSQL_ROOT_PASSWORD=your-mysql-password
MYSQL_DATABASE=ilmomasiina
ADMIN_REGISTRATION_ALLOWED=true

EDIT_TOKEN_SALT=randomly-generated-token
MAIL_FROM=<ilmo@athene.fi>
FEATHERS_AUTH_SECRET=randomly-generated-token
MAILGUN_API_KEY=ask-someone-for-this
MAILGUN_DOMAIN=ask-someone-for-this
BASE_URL=http://localhost:3000
```

# These can be configured if so desired

```bash
BRANDING_HEADER_TITLE_TEXT=Athenen ilmomasiina
BRANDING_FOOTER_GDPR_TEXT=Tietosuoja
BRANDING_FOOTER_GDPR_LINK=https://athene.fi/hallinto/materiaalit/
BRANDING_FOOTER_HOME_TEXT=Athene.fi
BRANDING_FOOTER_HOME_LINK=https://athene.fi
BRANDING_MAIL_FOOTER_TEXT=Rakkaudella, Tietskarijengi & Athene
BRANDING_MAIL_FOOTER_LINK=ilmo.athene.fi
```
