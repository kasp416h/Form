import crypto from "node:crypto";
import "server-only";

export function decryptData(encryptedData: string) {
  const privateKey = process.env.PRIVATE_KEY_PEM;

  if (!privateKey) {
    throw new Error("Private key is not defined");
  }

  const buffer = Buffer.from(encryptedData, "base64");

  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer
  );

  return JSON.parse(decrypted.toString("utf8"));
}
