# Build stage:
FROM node:12.20.1-alpine as builder

COPY . /opt/ilmomasiina
WORKDIR /opt/ilmomasiina

RUN npm ci
RUN npx lerna bootstrap

# Build all packages
RUN npm run build

# Replace ilmomasiina-models src with compiled js files
RUN rm -r /opt/ilmomasiina/packages/ilmomasiina-models/src
RUN mv /opt/ilmomasiina/packages/ilmomasiina-models/dist /opt/ilmomasiina/packages/ilmomasiina-models/src

# Bundle frontend build to backend
RUN mv /opt/ilmomasiina/packages/ilmomasiina-frontend/build /opt/ilmomasiina/packages/ilmomasiina-backend/dist/frontend

# Bundle node_modules to dist
RUN cp -rL /opt/ilmomasiina/packages/ilmomasiina-backend/node_modules \
    /opt/ilmomasiina/packages/ilmomasiina-backend/dist/node_modules

# Main stage:
FROM node:12.20.1-alpine

# Default to production
ENV NODE_ENV=production

WORKDIR /opt/ilmomasiina
RUN adduser -D masiina
USER masiina

# Copy built backend from build stage
COPY --from=builder --chown=masiina:masiina /opt/ilmomasiina/packages/ilmomasiina-backend/dist /opt/ilmomasiina

# Start server
CMD node bin/server.js
