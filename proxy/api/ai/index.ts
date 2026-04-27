import type { VercelRequest, VercelResponse } from "@vercel/node";
import { setCorsHeaders } from "../../lib/cors";
import { errorResponse } from "../../lib/responses";

/**
 * /api/ai
 *
 * AI proxy route — provider-agnostic placeholder.
 *
 * This route is intentionally disabled until you configure an AI provider.
 * When ready, replace the placeholder block below with your chosen provider.
 *
 * ─── PROVIDER OPTIONS ────────────────────────────────────────────────────────
 *
 * OpenAI
 *   npm install openai
 *   import OpenAI from "openai";
 *   const openai = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });
 *
 * Anthropic (Claude)
 *   npm install @anthropic-ai/sdk
 *   import Anthropic from "@anthropic-ai/sdk";
 *   const anthropic = new Anthropic({ apiKey: requireEnv("ANTHROPIC_API_KEY") });
 *
 * Google Gemini
 *   npm install @google/generative-ai
 *   import { GoogleGenerativeAI } from "@google/generative-ai";
 *   const genai = new GoogleGenerativeAI(requireEnv("GEMINI_API_KEY"));
 *
 * Perplexity
 *   Use the OpenAI SDK pointed at Perplexity's base URL:
 *   import OpenAI from "openai";
 *   const perplexity = new OpenAI({
 *     apiKey: requireEnv("PERPLEXITY_API_KEY"),
 *     baseURL: "https://api.perplexity.ai",
 *   });
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Required env vars (uncomment when configuring):
 *   OPENAI_API_KEY        — for OpenAI / Perplexity
 *   ANTHROPIC_API_KEY     — for Claude
 *   GEMINI_API_KEY        — for Gemini
 *
 * Request body (once configured):
 *   { prompt: string, model?: string, options?: Record<string, unknown> }
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

  if (req.method !== "POST") {
    res.status(405).json(errorResponse("Method not allowed. Use POST."));
    return;
  }

  // ─── TODO: Replace this block with your AI provider implementation ───────
  res.status(501).json({
    success: false,
    message: "AI not configured",
    hint: "Open proxy/api/ai/index.ts and wire up your preferred AI provider. See the comments above for OpenAI, Anthropic, Gemini, and Perplexity options.",
  });
  // ─────────────────────────────────────────────────────────────────────────
}
