import type { VercelRequest, VercelResponse } from "@vercel/node";
import { setCorsHeaders } from "./lib/cors";
import { errorResponse } from "./lib/responses";

/**
 * _middleware.ts
 *
 * Runs before all API routes (when deployed to Vercel Edge or used as a
 * shared wrapper). Handles:
 *  - CORS preflight requests
 *  - Security headers
 *  - Request tracing (X-Request-Id)
 *  - Route-level auth guard (optional — see TODO below)
 */
export default function middleware(
  req: VercelRequest,
  res: VercelResponse
): void {
  // 1. CORS preflight
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  // 2. Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // 3. Request tracing
  const requestId =
    (req.headers["x-request-id"] as string) ||
    `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  res.setHeader("X-Request-Id", requestId);

  // TODO: Add global auth guard here if needed.
  // Example: verify a Firebase ID token from the Authorization header
  // before passing to the route handler.
  // const token = req.headers.authorization?.split("Bearer ")[1];
  // if (!token) { res.status(401).json(errorResponse("Unauthorized")); return; }
  // const decoded = await adminAuth().verifyIdToken(token);
  // (req as any).user = decoded;
}
