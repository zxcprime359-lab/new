import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = process.env.SECRET_KEY!;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY environment variable is required");
}
if (SECRET_KEY.length !== 64 || !/^[0-9a-f]+$/i.test(SECRET_KEY)) {
  throw new Error("SECRET_KEY must be a 64-character hexadecimal string");
}

// Encrypt function
export function encryptId(id: string): string {
  // const iv = crypto.randomBytes(16);
  const iv = getDeterministicIV(id); // ← Changed from crypto.randomBytes(16)
  const keyBuffer = Buffer.from(SECRET_KEY, "hex");

  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
  let encrypted = cipher.update(id, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// Decrypt function
export function decryptId(encryptedId: string): string {
  const [ivHex, encryptedText] = encryptedId.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const keyBuffer = Buffer.from(SECRET_KEY, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
// Generate deterministic IV from the ID itself
function getDeterministicIV(id: string): Buffer {
  const hash = crypto
    .createHash("sha256")
    .update(id + SECRET_KEY) // Mix ID with secret
    .digest();
  return hash.subarray(0, 16); // Take first 16 bytes as IV
}
