/**
 * HMAC-SHA256 tokens for unsubscribe + similar one-click flows.
 * Token format: base64url(payload).base64url(signature)
 * Payload format: "email:purpose:issuedAt"
 */

function base64UrlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = "";
  for (let i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const base64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(base64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

async function hmac(key: string, data: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
  return new Uint8Array(sig);
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export interface TokenPayload {
  email: string;
  purpose: string;
  issuedAt: number;
}

export async function signToken(secret: string, payload: TokenPayload): Promise<string> {
  const body = `${payload.email}:${payload.purpose}:${payload.issuedAt}`;
  const sig = await hmac(secret, body);
  return `${base64UrlEncode(new TextEncoder().encode(body))}.${base64UrlEncode(sig)}`;
}

export async function verifyToken(
  secret: string,
  token: string,
  expectedPurpose: string,
  maxAgeSeconds?: number
): Promise<TokenPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [b64body, b64sig] = parts;
  let bodyBytes: Uint8Array;
  let providedSig: Uint8Array;
  try {
    bodyBytes = base64UrlDecode(b64body);
    providedSig = base64UrlDecode(b64sig);
  } catch {
    return null;
  }
  const body = new TextDecoder().decode(bodyBytes);
  const expectedSig = await hmac(secret, body);
  if (!constantTimeEqual(providedSig, expectedSig)) return null;

  const segments = body.split(":");
  if (segments.length < 3) return null;
  const issuedAt = Number(segments[segments.length - 1]);
  const purpose = segments[segments.length - 2];
  const email = segments.slice(0, segments.length - 2).join(":");
  if (!Number.isFinite(issuedAt)) return null;
  if (purpose !== expectedPurpose) return null;
  if (maxAgeSeconds && Date.now() / 1000 - issuedAt > maxAgeSeconds) return null;
  return { email, purpose, issuedAt };
}
