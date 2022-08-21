# Build stage:
FROM node:14-alpine as builder

# Build-time env variables
ARG SENTRY_DSN
ARG PREFIX_URL
ARG API_URL
ARG BRANDING_LOGO_URL
ARG BRANDING_HEADER_TITLE_TEXT
ARG BRANDING_FOOTER_GDPR_TEXT
ARG BRANDING_FOOTER_GDPR_LINK
ARG BRANDING_FOOTER_HOME_TEXT
ARG BRANDING_FOOTER_HOME_LINK

# Copy source files
COPY .eslint* package.json pnpm-*.yaml /opt/ilmomasiina/
COPY packages /opt/ilmomasiina/packages
WORKDIR /opt/ilmomasiina

# Install dependencies (we're running as root, so the postinstall script doesn't run automatically)
RUN npm install -g pnpm@7 && pnpm install --frozen-lockfile

# Default to production (after pnpm install, so we get our types etc.)
ENV NODE_ENV=production

# Build all packages
RUN npm run build

# Main stage:
FROM node:14-alpine

# Default to production
ENV NODE_ENV=production

# Copy files needed for pnpm
COPY package.json pnpm-*.yaml /opt/ilmomasiina/
COPY packages /opt/ilmomasiina/packages
WORKDIR /opt/ilmomasiina

# Install dependencies for backend only
RUN npm install -g pnpm@7 && pnpm install --frozen-lockfile --prod --filter @tietokilta/ilmomasiina-backend

# Copy compiled ilmomasiina-models into src (TODO: figure out a better solution)
COPY --from=builder /opt/ilmomasiina/packages/ilmomasiina-models/dist /opt/ilmomasiina/packages/ilmomasiina-models/src

# Copy built backend from build stage
COPY --from=builder /opt/ilmomasiina/packages/ilmomasiina-backend/dist /opt/ilmomasiina/packages/ilmomasiina-backend/dist

# Copy built frontend from build stage
COPY --from=builder /opt/ilmomasiina/packages/ilmomasiina-frontend/build /opt/ilmomasiina/frontend

# Create user for running
RUN adduser -D -h /opt/ilmomasiina ilmomasiina
USER ilmomasiina

# Start server
CMD ["node", "packages/ilmomasiina-backend/dist/bin/server.js"]
