# Build stage:
FROM node:14-alpine as builder

# Build-time env variables
ARG SENTRY_DSN
ARG PREFIX_URL
ARG BRANDING_HEADER_TITLE_TEXT
ARG BRANDING_FOOTER_GDPR_TEXT
ARG BRANDING_FOOTER_GDPR_LINK
ARG BRANDING_FOOTER_HOME_TEXT
ARG BRANDING_FOOTER_HOME_LINK

# Default to production
ENV NODE_ENV=production

# Copy source files
COPY . /opt/ilmomasiina
WORKDIR /opt/ilmomasiina

# Install dependencies (we're running as root, so the postinstall script doesn't run automatically)
RUN npm install -g pnpm@7 && pnpm install --frozen-lockfile

# Build all packages
RUN npm run build

# Main stage:
FROM node:14-alpine

# Default to production
ENV NODE_ENV=production

# Create user for running
RUN adduser -D -h /opt/ilmomasiina ilmomasiina
USER ilmomasiina

WORKDIR /opt/ilmomasiina

# Copy backend dependencies from build stage
COPY --from=builder /opt/ilmomasiina/packages/ilmomasiina-backend/node_modules /opt/ilmomasiina/node_modules

# Copy compiled ilmomasiina-models as "src" into backend dependencies (TODO: implement a better build for this)
COPY --from=builder /opt/ilmomasiina/packages/ilmomasiina-models/dist /opt/ilmomasiina/node_modules/@tietokilta/ilmomasiina-models/src

# Copy built backend from build stage
COPY --from=builder /opt/ilmomasiina/packages/ilmomasiina-backend/dist /opt/ilmomasiina/dist

# Copy built frontend from build stage
COPY --from=builder /opt/ilmomasiina/packages/ilmomasiina-frontend/build /opt/ilmomasiina/frontend

# Start server
CMD ["node", "dist/bin/server.js"]
