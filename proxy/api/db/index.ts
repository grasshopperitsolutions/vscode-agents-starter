import type { VercelRequest, VercelResponse } from "@vercel/node";
import { setCorsHeaders } from "../../lib/cors";
import { successResponse, errorResponse } from "../../lib/responses";
import { adminDb } from "../../lib/firebaseAdmin";

/**
 * /api/db
 *
 * Handles Firestore database operations via Firebase Admin.
 *
 * Supported actions:
 *   - get      GET   ?collection=...&id=...          → fetch a single document
 *   - list     GET   ?collection=...&limit=...       → list documents in a collection
 *   - create   POST  { collection, data }            → add a new document
 *   - update   PUT   { collection, id, data }        → merge-update a document
 *   - remove   DELETE ?collection=...&id=...        → delete a document
 *
 * TODO: Add authentication guard — verify the caller's ID token before
 * allowing writes. See proxy/_middleware.ts for the pattern.
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
  const db = adminDb();

  try {
    // --- GET SINGLE DOCUMENT ---
    if (action === "get" && req.method === "GET") {
      const { collection, id } = req.query as Record<string, string>;
      if (!collection || !id) {
        res.status(400).json(errorResponse("collection and id are required"));
        return;
      }
      const snap = await db.collection(collection).doc(id).get();
      if (!snap.exists) {
        res.status(404).json(errorResponse("Document not found"));
        return;
      }
      res
        .status(200)
        .json(successResponse("Document fetched", { id: snap.id, ...snap.data() }));
      return;
    }

    // --- LIST DOCUMENTS ---
    if (action === "list" && req.method === "GET") {
      const { collection, limit } = req.query as Record<string, string>;
      if (!collection) {
        res.status(400).json(errorResponse("collection is required"));
        return;
      }
      const limitNum = Math.min(parseInt(limit ?? "20", 10), 100);
      const snap = await db.collection(collection).limit(limitNum).get();
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      res.status(200).json(successResponse("Documents fetched", docs));
      return;
    }

    // --- CREATE DOCUMENT ---
    if (action === "create" && req.method === "POST") {
      const { collection, data } = req.body as {
        collection?: string;
        data?: Record<string, unknown>;
      };
      if (!collection || !data) {
        res.status(400).json(errorResponse("collection and data are required"));
        return;
      }
      const ref = await db.collection(collection).add({
        ...data,
        createdAt: new Date().toISOString(),
      });
      res.status(201).json(successResponse("Document created", { id: ref.id }));
      return;
    }

    // --- UPDATE DOCUMENT ---
    if (action === "update" && req.method === "PUT") {
      const { collection, id, data } = req.body as {
        collection?: string;
        id?: string;
        data?: Record<string, unknown>;
      };
      if (!collection || !id || !data) {
        res.status(400).json(errorResponse("collection, id, and data are required"));
        return;
      }
      await db.collection(collection).doc(id).set(
        { ...data, updatedAt: new Date().toISOString() },
        { merge: true }
      );
      res.status(200).json(successResponse("Document updated", { id }));
      return;
    }

    // --- DELETE DOCUMENT ---
    if (action === "remove" && req.method === "DELETE") {
      const { collection, id } = req.query as Record<string, string>;
      if (!collection || !id) {
        res.status(400).json(errorResponse("collection and id are required"));
        return;
      }
      await db.collection(collection).doc(id).delete();
      res.status(200).json(successResponse("Document deleted", { id }));
      return;
    }

    res
      .status(400)
      .json(
        errorResponse(
          `Unknown action: "${action}". Supported: get, list, create, update, remove.`
        )
      );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    res.status(500).json(errorResponse("Database operation failed", message));
  }
}
