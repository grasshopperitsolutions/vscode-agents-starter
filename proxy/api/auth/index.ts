import type { VercelRequest, VercelResponse } from "@vercel/node";
import { setCorsHeaders } from "../../lib/cors";
import { successResponse, errorResponse } from "../../lib/responses";
import { adminAuth } from "../../lib/firebaseAdmin";

/**
 * /api/auth
 *
 * Handles Firebase Admin authentication operations.
 *
 * Supported actions (pass as ?action=... or in the request body):
 *   - verify       POST  { idToken }  → verifies a Firebase ID token
 *   - getUser      GET   ?uid=...     → fetches a user record by UID
 *   - revokeToken  POST  { uid }      → revokes all refresh tokens for a user
 *
 * TODO: Add more actions as your auth flows require.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  setCorsHeaders(res, req.headers.origin as string);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const action =
    (req.query.action as string) || (req.body?.action as string);

  try {
    // --- VERIFY ID TOKEN ---
    if (action === "verify" && req.method === "POST") {
      const { idToken } = req.body as { idToken?: string };
      if (!idToken) {
        res.status(400).json(errorResponse("idToken is required"));
        return;
      }
      const decoded = await adminAuth().verifyIdToken(idToken);
      res
        .status(200)
        .json(
          successResponse("Token verified", {
            uid: decoded.uid,
            email: decoded.email,
          })
        );
      return;
    }

    // --- GET USER BY UID ---
    if (action === "getUser" && req.method === "GET") {
      const uid = req.query.uid as string;
      if (!uid) {
        res.status(400).json(errorResponse("uid query parameter is required"));
        return;
      }
      const user = await adminAuth().getUser(uid);
      res.status(200).json(
        successResponse("User fetched", {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          disabled: user.disabled,
        })
      );
      return;
    }

    // --- REVOKE REFRESH TOKENS ---
    if (action === "revokeToken" && req.method === "POST") {
      const { uid } = req.body as { uid?: string };
      if (!uid) {
        res.status(400).json(errorResponse("uid is required"));
        return;
      }
      await adminAuth().revokeRefreshTokens(uid);
      res.status(200).json(successResponse("Tokens revoked for user", { uid }));
      return;
    }

    // Unrecognised action
    res
      .status(400)
      .json(
        errorResponse(
          `Unknown action: "${action}". Supported: verify, getUser, revokeToken.`
        )
      );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Auth error";
    res.status(500).json(errorResponse("Auth operation failed", message));
  }
}
