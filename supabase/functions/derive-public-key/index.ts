// Derives the Ed25519 public key from the same signing key used in commit-action
// This is a one-time utility to publish the verification key

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Same key derivation as commit-action
    const signingSecret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const keyMaterial = await hashSHA256(`APEX-SIGNING-KEY-${signingSecret}`);

    const keyBytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      keyBytes[i] = parseInt(keyMaterial.substring(i * 2, i * 2 + 2), 16);
    }

    // Import as Ed25519 private key, then export public key
    const privateKey = await crypto.subtle.importKey(
      "raw", keyBytes, { name: "Ed25519" }, true, ["sign"]
    );

    // Export the private key as PKCS8 to derive the public key
    const pkcs8 = await crypto.subtle.exportKey("pkcs8", privateKey);
    const pkcs8Bytes = new Uint8Array(pkcs8);
    
    // Ed25519 PKCS8 format: the last 32 bytes of the 48-byte structure are the private key seed
    // The public key must be derived by importing as keypair
    // Alternative: generate a keypair from the seed material
    
    // Sign a known message and verify approach: extract public from JWK
    const jwk = await crypto.subtle.exportKey("jwk", privateKey);
    
    // JWK 'x' parameter is the public key (base64url encoded)
    const publicKeyB64 = jwk.x;
    if (!publicKeyB64) {
      throw new Error("Could not extract public key from JWK");
    }
    
    // Decode base64url to bytes
    const b64 = publicKeyB64.replace(/-/g, '+').replace(/_/g, '/');
    const binaryStr = atob(b64);
    const publicKeyBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      publicKeyBytes[i] = binaryStr.charCodeAt(i);
    }
    
    const publicKeyHex = Array.from(publicKeyBytes).map(b => b.toString(16).padStart(2, "0")).join("");

    return new Response(
      JSON.stringify({
        public_key_hex: publicKeyHex,
        algorithm: "Ed25519",
        key_size_bits: 256,
        derivation: "SHA-256(APEX-SIGNING-KEY-${SERVICE_ROLE_KEY}) → Ed25519 seed → public key",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err), note: "Ed25519 key derivation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
