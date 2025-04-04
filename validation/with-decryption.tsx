import "server-only";

import { validateCsrfToken, shapeError, Handler } from "./utils";
import { ZodSchema, z } from "zod";
import { decryptData } from "../crypt/server";

export function withDecryptionAndValidation<
  T extends ZodSchema,
  SchemaResult = z.infer<ZodSchema> & {
    encryptedFields: string;
  }
>(schema: T, handler: Handler<SchemaResult>) {
  return async (
    formData: SchemaResult & { csrfToken: string; encryptedFields: string }
  ) => {
    const { csrfToken, ...rawData } = formData;

    try {
      validateCsrfToken(csrfToken);
    } catch {
      return {
        status: 403,
        error: "Invalid data",
      } as ActionResponse;
    }

    let mergedData: Record<string, unknown> = { ...rawData };

    if (typeof mergedData.encryptedFields === "string") {
      try {
        const decryptedFields = decryptData(
          mergedData.encryptedFields
        ) as SchemaResult;
        mergedData = { ...mergedData, ...decryptedFields };
      } catch {
        return {
          status: 400,
          error: "Invalid data",
        } as ActionResponse;
      }
    }

    const validation = schema.safeParse(mergedData);

    if (!validation.success) {
      return {
        status: 400,
        error: "Invalid data",
        validationErrors: validation.error.errors,
      } as ActionResponse;
    }

    const finalData = {
      ...mergedData,
      ...validation.data,
    };

    try {
      return await handler(finalData as SchemaResult);
    } catch (error) {
      const shapedError = shapeError(error);

      return {
        status: shapedError.status,
        error: shapedError.error,
      } as ActionResponse;
    }
  };
}
