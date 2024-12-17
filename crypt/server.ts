import "server-only";

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function loadPrivateKey() {
  const privateKeyPath = path.join(process.cwd(), "private_key.pem");
  return fs.readFileSync(privateKeyPath, "utf8");
}

export function decryptData(encryptedData: string) {
  const privateKey = loadPrivateKey();
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
