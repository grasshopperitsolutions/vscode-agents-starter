import type { VercelRequest, VercelResponse } from "@vercel/node";
import { setCorsHeaders } from "../../lib/cors";
import { successResponse, errorResponse } from "../../lib/responses";
import { adminStorage } from "../../lib/firebaseAdmin";

/**
 * /api/storage
 *
 * Handles Firebase Cloud Storage operations via Admin SDK.
 *
 * Supported actions:
 *   - signedUrl    POST  { filePath, action: "read"|"write", expiresIn? }
 *                  → generates a signed URL for client upload/download
 *   - delete       DELETE ?filePath=...  → deletes a file
 *   - list         GET   ?prefix=...     → lists files under a prefix
 *
 * TODO: Add authentication guard — verify caller's ID token before
 * issuing signed URLs. See proxy/_middleware.ts for the pattern.
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
  const bucket = adminStorage().bucket();

  try {
    // --- GENERATE SIGNED URL ---
    if (action === "signedUrl" && req.method === "POST") {
      const {
        filePath,
        action: urlAction,
        expiresIn = 15,
      } = req.body as {
        filePath?: string;
        action?: "read" | "write";
        expiresIn?: number;
      };

      if (!filePath || !urlAction) {
        res
          .status(400)
          .json(errorResponse("filePath and action (read|write) are required"));
        return;
      }

      const expires = Date.now() + expiresIn * 60 * 1000;
      const [url] = await bucket.file(filePath).getSignedUrl({
        action: urlAction === "read" ? "read" : "write",
        expires,
        contentType:
          urlAction === "write" ? "application/octet-stream" : undefined,
      });

      res.status(200).json(
        successResponse("Signed URL generated", {
          url,
          expiresAt: new Date(expires).toISOString(),
        })
      );
      return;
    }

    // --- DELETE FILE ---
    if (action === "delete" && req.method === "DELETE") {
      const filePath = req.query.filePath as string;
      if (!filePath) {
        res.status(400).json(errorResponse("filePath query parameter is required"));
        return;
      }
      await bucket.file(filePath).delete();
      res.status(200).json(successResponse("File deleted", { filePath }));
      return;
    }

    // --- LIST FILES ---
    if (action === "list" && req.method === "GET") {
      const prefix = (req.query.prefix as string) ?? "";
      const [files] = await bucket.getFiles({ prefix });
      const fileList = files.map((f) => ({
        name: f.name,
        size: f.metadata?.size,
        updated: f.metadata?.updated,
      }));
      res.status(200).json(successResponse("Files listed", fileList));
      return;
    }

    res
      .status(400)
      .json(
        errorResponse(
          `Unknown action: "${action}". Supported: signedUrl, delete, list.`
        )
      );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Storage error";
    res.status(500).json(errorResponse("Storage operation failed", message));
  }
}
