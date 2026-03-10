// ═══════════════════════════════════════════════════════════════════════
// PSI Protocol — RFC 8785 JSON Canonicalization Scheme (JCS)
// Ensures deterministic hashing regardless of key ordering
// ═══════════════════════════════════════════════════════════════════════

import canonicalize from "canonicalize";

/**
 * Canonicalize a JavaScript object per RFC 8785 (JCS).
 * Returns a deterministic JSON string suitable for hashing.
 */
export function jcsCanonicalize(data: unknown): string {
  const result = canonicalize(data);
  if (result === undefined) {
    throw new Error("JCS canonicalization failed: input cannot be serialized");
  }
  return result;
}

/**
 * Canonicalize and hash with SHA-256.
 * This is the standard PSI commit hash function.
 */
export async function jcsHash(data: unknown): Promise<string> {
  const canonical = jcsCanonicalize(data);
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(canonical));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
