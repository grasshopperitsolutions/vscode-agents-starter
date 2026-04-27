import type { VercelResponse } from "@vercel/node";

/**
 * cors.ts
 *
 * Centralised CORS header helper.
 * Adjust ALLOWED_ORIGINS for production.
 */

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  // TODO: add your production domain(s) here
  // "https://your-app.vercel.app",
  // "https://yourdomain.com",
];

export function setCorsHeaders(
  res: VercelResponse,
  origin?: string
): void {
  const allowedOrigin =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, X-Request-Id"
  );
}
