// force-pg-ssl.cjs
// Preloaded via NODE_OPTIONS to force SSL on all pg connections.
// Required because Neon PostgreSQL mandates sslmode=require and
// n8n's built-in env vars do not reliably enable SSL.
//
// This patches the pg module's Client prototype so that every
// new connection includes ssl: { rejectUnauthorized: false }.

const Module = require('module');
const originalResolveFilename = Module._resolveFilename;

let pgPatched = false;

Module._resolveFilename = function (request, parent, isMain, options) {
  const result = originalResolveFilename.call(this, request, parent, isMain, options);
  return result;
};

// Use process.nextTick to patch after all modules are loaded
const origEmit = process.emit;
process.emit = function (event, ...args) {
  if (!pgPatched) {
    try {
      // Find pg in n8n's node_modules tree
      const pgPaths = [
        '/usr/local/lib/node_modules/n8n/node_modules/pg',
        '/usr/local/lib/node_modules/n8n/node_modules/.pnpm/pg@8.13.3/node_modules/pg',
      ];

      for (const pgPath of pgPaths) {
        try {
          const pg = require(pgPath);
          if (pg && pg.Client) {
            const OrigPool = pg.Pool;
            const OrigClient = pg.Client;

            // Patch Pool constructor
            if (OrigPool) {
              const origPoolProto = OrigPool.prototype;
              const PatchedPool = function (config) {
                config = config || {};
                if (!config.ssl) {
                  config.ssl = { rejectUnauthorized: false };
                }
                return new OrigPool(config);
              };
              PatchedPool.prototype = origPoolProto;
              pg.Pool = PatchedPool;
            }

            // Patch Client constructor
            const origClientConnect = OrigClient.prototype.connect;
            OrigClient.prototype.connect = function (callback) {
              if (
                this.connectionParameters &&
                !this.connectionParameters.ssl
              ) {
                this.connectionParameters.ssl = {
                  rejectUnauthorized: false,
                };
              }
              return origClientConnect.apply(this, arguments);
            };

            pgPatched = true;
            console.log('[force-pg-ssl] Successfully patched pg module for SSL');
            break;
          }
        } catch (e) {
          // Try next path
        }
      }
    } catch (e) {
      // Silently continue
    }
  }
  return origEmit.apply(this, [event, ...args]);
};
