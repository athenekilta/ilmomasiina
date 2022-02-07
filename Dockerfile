# Build stage:
FROM node:14-alpine as builder

# Copy source files
COPY . /opt/ilmomasiina
WORKDIR /opt/ilmomasiina

# Install dependencies (we're running as root, so the postinstall script doesn't run automatically)
RUN npm ci && npm run bootstrap

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
