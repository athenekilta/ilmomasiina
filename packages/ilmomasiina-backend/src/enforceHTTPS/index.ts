import { FastifyReply, FastifyRequest } from 'fastify';

/** Provides onRequest hook for Fastify to enforces HTTPS connections
 *
 * Determines the connection type according to (local) server protocol, `X-Forwarded-Proto` header or existence of
 * `X-ARR-SSL` header. Redirects `GET` and `HEAD` requests to HTTPS using 301 responses. For other methods, responds
 * with 403.
 *
 * When running behind a proxy, requires Fastify to be configured with `trustProxy: true` to redirect requests properly.
 *
 * @param config trustProxy: use X-Forwarded-Proto header; isAzure: use X-ARR-SSL header
 */
export default function enforceHTTPS(config: { trustProxy: boolean, isAzure: boolean }) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (request.protocol === 'https') { return; }

    let forwardedProto = '';

    // First, try to determine protocol from 'X-Forwarded-Proto' header
    if (config.trustProxy) {
      const xForwardedProtoHeader = request.headers['x-forwarded-proto'];
      if (Array.isArray(xForwardedProtoHeader)) {
        if (xForwardedProtoHeader.length > 1) {
          request.log.error('Multiple X-Forwarded-Proto headers provided. Only one is allowed!');
        } else if (xForwardedProtoHeader.length === 1) {
          forwardedProto = xForwardedProtoHeader[0].substring(0, 5);
        }
      } else if (xForwardedProtoHeader) { // header is a string
        forwardedProto = xForwardedProtoHeader.substring(0, 5);
      }
    }

    // In Azure, determine the protocol by checking the existence of 'x-arr-ssl' header
    if (config.isAzure && request.headers['x-arr-ssl']) {
      forwardedProto = 'https';
    }

    if (forwardedProto !== 'https') {
      if (['GET', 'HEAD'].includes(request.method.toUpperCase())) {
        // Redirect GET & HEAD requests
        reply.redirect(301, `https://${request.hostname}${request.url}`);
      } else {
        // Reply 403 for others
        reply.forbidden('HTTPS connection required');
      }
    }
  };
}
