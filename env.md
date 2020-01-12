# Create .env file at the root of the project with the following contents

# Sentry variables
USE_SENTRY=true # Set this if you want to configure sentry error tracking
SENTRY_DSN=<REPLACE_WITH_PUBLIC_DSN>

# Docker variables
DOCKER=true # Set this if running with docker
DB_DIALECT=<mysql|postgres> # Set the desired database
 type

DB_USER=ilmomasiina
DB_PASSWORD=secret
DB_DATABASE=ilmomasiina

# MySQL variables
MYSQL_ROOT_PASSWORD=secret # This is needed when running with docker and mysql
MYSQL_USER=ilmomasiina
MYSQL_PASSWORD=secret
MYSQL_DATABASE=ilmomasiina

# PostgreSQL variables
POSTGRES_USER=ilmomasiina
POSTGRES_PASSWORD=secret
POSTGRES_DB=ilmomasiina

ADMIN_REGISTRATION_ALLOWED=true
EDIT_TOKEN_SALT=randomly-generated-token
MAIL_FROM=<ilmo@athene.fi>
FEATHERS_AUTH_SECRET=randomly-generated-token
MAILGUN_API_KEY=ask-someone-for-this
MAILGUN_DOMAIN=ask-someone-for-this
BASE_URL=http://localhost:3000

# These can be configured if so desired
BRANDING_HEADER_TITLE_TEXT=Athenen ilmomasiina
BRANDING_FOOTER_GDPR_TEXT=Tietosuoja
BRANDING_FOOTER_GDPR_LINK=https://athene.fi/hallinto/materiaalit/
BRANDING_FOOTER_HOME_TEXT=Athene.fi
BRANDING_FOOTER_HOME_LINK=https://athene.fi
BRANDING_MAIL_FOOTER_TEXT=Rakkaudella, Tietskarijengi & Athene
BRANDING_MAIL_FOOTER_LINK=ilmo.athene.fi
