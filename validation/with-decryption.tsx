/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";

import { validateCsrfToken, shapeError } from "./utils";
import { ZodSchema, z } from "zod";
import { decryptData } from "../crypt/server";

type Handler<T> = (validatedData: T) => Promise<ActionResponse>;

export function withDecryptionAndValidation<T extends ZodSchema>(
  schema: T,
  handler: Handler<z.infer<T>> & { encryptedFields: string }
) {
  return async (formData: Record<string, any>) => {
    const { csrfToken, ...data } = formData;

    try {
      validateCsrfToken(csrfToken);
    } catch {
      return {
        status: 403,
        error: "Invalid data",
      } as ActionResponse;
    }

    let decryptedData: Record<string, any> = { ...data };

    if (data["encryptedFields"]) {
      try {
        const decryptedFields = decryptData(data["encryptedFields"]);
        decryptedData = { ...decryptedData, ...decryptedFields };
        delete decryptedData["encryptedFields"];
      } catch {
        return {
          status: 400,
          error: "Invalid data",
        } as ActionResponse;
      }
    }

    const validation = schema.safeParse(decryptedData);

    if (!validation.success) {
      return {
        status: 400,
        error: "Invalid data",
        validationErrors: validation.error.errors,
      } as ActionResponse;
    }

    try {
      return await handler(data as z.infer<T>);
    } catch (error) {
      const shapedError = shapeError(error);

      return {
        status: shapedError.status,
        error: shapedError.error,
      } as ActionResponse;
    }
  };
}
