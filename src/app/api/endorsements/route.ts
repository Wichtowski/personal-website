import { NextRequest } from "next/server";

// Fallback in-memory store for local dev without KV
let mockStore: Map<string, string> | null = null;

// Fallback definition for local Next.js build compilation
interface KVNamespace {
  get(key: string, type?: "text" | "json" | "arrayBuffer" | "stream"): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

interface RequestWithEnv {
  context?: {
    env?: {
      PERSONAL_WEBSITE_KV_ID?: KVNamespace;
    };
  };
  env?: {
    PERSONAL_WEBSITE_KV_ID?: KVNamespace;
  };
}

function getKV(request?: RequestWithEnv | NextRequest | unknown) {
  const reqWithEnv = request as RequestWithEnv | undefined;
  const cloudflareEnv = reqWithEnv?.context?.env || reqWithEnv?.env;
  if (cloudflareEnv?.PERSONAL_WEBSITE_KV_ID) {
    return cloudflareEnv.PERSONAL_WEBSITE_KV_ID;
  }

  const procEnv = (typeof process !== "undefined" ? process.env : {}) as Record<string, unknown>;
  const kvInProc = procEnv.PERSONAL_WEBSITE_KV_ID;
  if (kvInProc) {
    return kvInProc as KVNamespace;
  }

  const globalObj = (typeof globalThis !== "undefined" ? globalThis : {}) as Record<
    string,
    unknown
  >;
  const kvInGlob = globalObj.PERSONAL_WEBSITE_KV_ID;
  if (kvInGlob) {
    return kvInGlob as KVNamespace;
  }

  if (!mockStore) {
    mockStore = new Map<string, string>();
  }
  return {
    async get(key: string) {
      return mockStore!.get(key) || null;
    },
    async put(key: string, value: string) {
      mockStore!.set(key, value);
    },
    async delete(key: string) {
      mockStore!.delete(key);
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const targetId = url.searchParams.get("targetId");
    if (!targetId) {
      return Response.json({ error: "Missing targetId" }, { status: 400 });
    }

    const kv = getKV(request);
    const countStr = await kv.get(`endorsements:${targetId}`);
    const count = countStr ? parseInt(countStr, 10) : 0;

    return Response.json({ count });
  } catch (error) {
    console.error("Error in GET /api/endorsements:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetId, action, email } = body;

    if (!targetId) {
      return Response.json({ error: "Missing targetId" }, { status: 400 });
    }
    if (action !== "endorse" && action !== "unendorse") {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    const trimmedEmail = (email || "").toLowerCase().trim();
    const isValidEmail = trimmedEmail.includes("@") && trimmedEmail.length > 3;

    if (action === "endorse" && !isValidEmail) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    const kv = getKV(request);
    const key = `endorsements:${targetId}`;
    const countStr = await kv.get(key);
    const count = countStr ? parseInt(countStr, 10) : 0;

    let newCount = count;
    const endorseKey = `endorse:${targetId}:${trimmedEmail}`;

    if (action === "endorse") {
      // Check if this email has already endorsed this content
      const alreadyEndorsed = await kv.get(endorseKey);
      if (alreadyEndorsed === "1") {
        return Response.json({ error: "already_endorsed", count }, { status: 400 });
      }

      newCount = count + 1;
      await kv.put(endorseKey, "1");
    } else if (action === "unendorse") {
      if (isValidEmail) {
        // Only decrement and clean key if previously endorsed
        const alreadyEndorsed = await kv.get(endorseKey);
        if (alreadyEndorsed === "1") {
          newCount = Math.max(0, count - 1);
          await kv.delete(endorseKey);
        }
      } else {
        newCount = Math.max(0, count - 1);
      }
    }

    await kv.put(key, String(newCount));
    return Response.json({ count: newCount });
  } catch (error) {
    console.error("Error in POST /api/endorsements:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
