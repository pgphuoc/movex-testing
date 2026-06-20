/**
 * Centralized environment configuration for MoveX E2E Tests.
 *
 * Reads from process.env (which can be set via .env file, CI secrets,
 * or inline CLI variables).  Falls back to safe defaults where possible.
 *
 * Usage:
 *   const { ENV } = require('../helpers/env');
 *   console.log(ENV.baseUrl, ENV.admin.email);
 */
require('dotenv').config();

const ENV = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',

  /** Default admin account – used by most tests */
  admin: {
    email: process.env.TEST_EMAIL || '',
    password: process.env.TEST_PASSWORD || '',
  },

  /** Tenant owner account – used by modules requiring owner-level access */
  owner: {
    email: process.env.TEST_OWNER_EMAIL || '',
    password: process.env.TEST_OWNER_PASSWORD || '',
  },

  /** Viewer (read-only) account – used for permission tests */
  viewer: {
    email: process.env.TEST_VIEWER_EMAIL || '',
    password: process.env.TEST_VIEWER_PASSWORD || '',
  },
};

// ── Validation ──────────────────────────────────────────────────────
// Warn early if critical env vars are missing
function validateEnv() {
  const missing = [];
  if (!ENV.admin.email) missing.push('TEST_EMAIL');
  if (!ENV.admin.password) missing.push('TEST_PASSWORD');

  if (missing.length > 0) {
    console.warn(
      `\n⚠️  Missing environment variables: ${missing.join(', ')}` +
      `\n   Copy .env.example → .env and fill in real values.` +
      `\n   Or pass them inline: TEST_EMAIL=... TEST_PASSWORD=... npx playwright test\n`
    );
  }
}

validateEnv();

module.exports = { ENV };
