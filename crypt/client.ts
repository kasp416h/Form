import forge from "node-forge";

async function fetchPublicKey() {
  const response = await fetch("/public_key.pem");
  const publicKeyPem = await response.text();
  return publicKeyPem;
}

export async function encryptData(
  data: Record<string, unknown>
): Promise<string> {
  const publicKeyPem = await fetchPublicKey();
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

  const encrypted = publicKey.encrypt(
    forge.util.encodeUtf8(JSON.stringify(data)),
    "RSA-OAEP",
    {
      md: forge.md.sha256.create(),
    }
  );

  return forge.util.encode64(encrypted);
}

export async function processAndEncryptFields<
  T extends Record<string, unknown>
>(
  data: T,
  encryptedFields: Array<keyof T>
): Promise<
  Omit<T, (typeof encryptedFields)[number]> & { encryptedFields?: string }
> {
  const fieldsToEncrypt: Partial<T> = encryptedFields.reduce(
    (accumulator, field) => {
      if (field in data && data[field] !== undefined && data[field] !== null) {
        accumulator[field] = data[field];
      }
      return accumulator;
    },
    {} as Partial<T>
  );

  const processedData: Partial<T> & { encryptedFields?: string } = { ...data };

  if (Object.keys(fieldsToEncrypt).length > 0) {
    processedData.encryptedFields = await encryptData(fieldsToEncrypt);

    for (const field of encryptedFields) {
      delete processedData[field];
    }
  }

  return processedData as Omit<T, keyof typeof fieldsToEncrypt> & {
    encryptedFields?: string;
  };
}
