/**
 * env.ts
 *
 * Validates required environment variables at startup.
 * Import this in any route that depends on env configuration.
 *
 * Usage:
 *   import { requireEnv } from "../lib/env";
 *   const apiKey = requireEnv("MY_API_KEY");
 */

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Check your .env.local or Vercel project settings.`
    );
  }
  return value;
}

export function optionalEnv(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}
