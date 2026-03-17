// Derives the Ed25519 public key from the same signing key used in commit-action

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function hashSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Same key derivation as commit-action (lines 144-152)
    const signingSecret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const keyMaterial = await hashSHA256(`APEX-SIGNING-KEY-${signingSecret}`);

    const seed = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      seed[i] = parseInt(keyMaterial.substring(i * 2, i * 2 + 2), 16);
    }

    // Build Ed25519 PKCS8 wrapper around the 32-byte seed
    // Ed25519 PKCS8 DER structure:
    // 30 2e (SEQUENCE, 46 bytes)
    //   02 01 00 (INTEGER, version 0)
    //   30 05 (SEQUENCE, 5 bytes - AlgorithmIdentifier)
    //     06 03 2b6570 (OID 1.3.101.112 = Ed25519)
    //   04 22 (OCTET STRING, 34 bytes)
    //     04 20 (OCTET STRING, 32 bytes - the seed)
    //       <32 bytes of seed>
    const pkcs8Header = new Uint8Array([
      0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06,
      0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20
    ]);
    const pkcs8 = new Uint8Array(48);
    pkcs8.set(pkcs8Header);
    pkcs8.set(seed, 16);

    const privateKey = await crypto.subtle.importKey(
      "pkcs8", pkcs8, { name: "Ed25519" }, false, ["sign"]
    );

    // Sign a known message, then import as verify key to extract public
    const testMessage = new TextEncoder().encode("APEX-PUBLIC-KEY-DERIVATION");
    const signature = await crypto.subtle.sign("Ed25519", privateKey, testMessage);

    // Now try importing with extractable to get JWK
    const privateKeyExportable = await crypto.subtle.importKey(
      "pkcs8", pkcs8, { name: "Ed25519" }, true, ["sign"]
    );
    const jwk = await crypto.subtle.exportKey("jwk", privateKeyExportable);

    // JWK 'x' is the public key in base64url
    const pubB64 = jwk.x!;
    const b64 = pubB64.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
    const binaryStr = atob(b64 + pad);
    const publicKeyBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      publicKeyBytes[i] = binaryStr.charCodeAt(i);
    }
    
    const publicKeyHex = bytesToHex(publicKeyBytes);

    // Verify the signature with the derived public key to confirm correctness
    const pubJwk = { kty: "OKP", crv: "Ed25519", x: pubB64 };
    const verifyKey = await crypto.subtle.importKey(
      "jwk", pubJwk, { name: "Ed25519" }, false, ["verify"]
    );
    const isValid = await crypto.subtle.verify("Ed25519", verifyKey, signature, testMessage);

    return new Response(
      JSON.stringify({
        public_key_hex: publicKeyHex,
        verified: isValid,
        algorithm: "Ed25519 (RFC 8032)",
        curve: "Curve25519",
        key_size_bits: 256,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
