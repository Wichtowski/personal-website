import { NextRequest } from "next/server";

let mockStore: Map<string, { value: string; expiresAt?: number }> | null = null;

// Fallback definition for local Next.js build compilation
interface KVNamespace {
  get(key: string, type?: "text" | "json" | "arrayBuffer" | "stream"): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface RequestWithEnv {
  context?: {
    env?: {
      PERSONAL_WEBSITE_KV?: KVNamespace;
    };
  };
  env?: {
    PERSONAL_WEBSITE_KV?: KVNamespace;
  };
}

interface RawComment {
  id: string;
  email: string;
  username?: string;
  body: string;
  createdAt: string;
}

function getKV(request?: RequestWithEnv | NextRequest | unknown) {
  const reqWithEnv = request as RequestWithEnv | undefined;
  const cloudflareEnv = reqWithEnv?.context?.env || reqWithEnv?.env;
  if (cloudflareEnv?.PERSONAL_WEBSITE_KV) {
    return cloudflareEnv.PERSONAL_WEBSITE_KV;
  }

  const procEnv = (typeof process !== "undefined" ? process.env : {}) as Record<string, unknown>;
  const kvInProc = procEnv.PERSONAL_WEBSITE_KV;
  if (kvInProc) {
    return kvInProc as KVNamespace;
  }

  const globalObj = (typeof globalThis !== "undefined" ? globalThis : {}) as Record<
    string,
    unknown
  >;
  const kvInGlob = globalObj.PERSONAL_WEBSITE_KV;
  if (kvInGlob) {
    return kvInGlob as KVNamespace;
  }

  if (!mockStore) {
    mockStore = new Map<string, { value: string; expiresAt?: number }>();
  }
  return {
    async get(key: string) {
      const entry = mockStore!.get(key);
      if (!entry) return null;
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        mockStore!.delete(key);
        return null;
      }
      return entry.value;
    },
    async put(key: string, value: string, options?: { expirationTtl?: number }) {
      const expiresAt = options?.expirationTtl
        ? Date.now() + options.expirationTtl * 1000
        : undefined;
      mockStore!.set(key, { value, expiresAt });
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
    const commentsStr = await kv.get(`comments:${targetId}`);
    const rawComments = commentsStr ? JSON.parse(commentsStr) : [];

    // Sanitize comments to hide emails of users who provided a username
    const sanitizedComments = (rawComments as RawComment[]).map((c: RawComment) => {
      const hasUsername = c.username && c.username.trim().length > 0;
      return {
        id: c.id,
        displayName: hasUsername && c.username ? c.username.trim() : c.email.trim(),
        body: c.body,
        createdAt: c.createdAt,
      };
    });

    return Response.json({ comments: sanitizedComments });
  } catch (error) {
    console.error("Error in GET /api/comments:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetId, email, username, comment } = body;

    if (!targetId) {
      return Response.json({ error: "Missing targetId" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (!comment || typeof comment !== "string" || comment.trim().length === 0) {
      return Response.json({ error: "Comment body cannot be empty" }, { status: 400 });
    }

    const ipHeader =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for") ||
      "local";
    const ip = ipHeader.split(",")[0].trim();

    const kv = getKV(request);

    // Rate limiting: check if this email or IP has commented in the last 20 minutes
    const trimmedEmail = email.toLowerCase().trim();
    const emailKey = `ratelimit:comment:email:${trimmedEmail}`;
    const ipKey = `ratelimit:comment:ip:${ip}`;

    const [emailLimit, ipLimit] = await Promise.all([kv.get(emailKey), kv.get(ipKey)]);

    if (emailLimit || ipLimit) {
      return Response.json(
        { error: "You can only submit one comment every 20 minutes" },
        { status: 429 },
      );
    }

    const key = `comments:${targetId}`;
    const commentsStr = await kv.get(key);
    const rawComments = commentsStr ? JSON.parse(commentsStr) : [];

    const newComment = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2),
      email: email.trim(),
      username: username ? username.trim() : "",
      body: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    rawComments.push(newComment);
    await kv.put(key, JSON.stringify(rawComments));

    // Persist rate limit for 20 minutes (1200 seconds)
    const LIMIT_TTL = 20 * 60;
    await Promise.all([
      kv.put(emailKey, "1", { expirationTtl: LIMIT_TTL }),
      kv.put(ipKey, "1", { expirationTtl: LIMIT_TTL }),
    ]);

    return Response.json({
      success: true,
      comment: {
        id: newComment.id,
        displayName: newComment.username || newComment.email,
        body: newComment.body,
        createdAt: newComment.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/comments:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
