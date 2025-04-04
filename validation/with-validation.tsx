import "server-only";

import { validateForm, shapeError, Handler } from "./utils";
import { ZodSchema, z } from "zod";

export function withValidation<
  T extends ZodSchema,
  SchemaResult = z.infer<ZodSchema>
>(schema: T, handler: Handler<SchemaResult>) {
  return async (formData: SchemaResult & { csrfToken: string }) => {
    const validationResult = validateForm(schema, formData);

    if (!validationResult.success) {
      return {
        error: validationResult.error,
        status: validationResult.status,
        validationErrors: validationResult.validationErrors,
      } as ActionResponse;
    }

    try {
      return await handler(validationResult.data as SchemaResult);
    } catch (error) {
      const shapedError = shapeError(error);

      return {
        status: shapedError.status,
        error: shapedError.error,
      } as ActionResponse;
    }
  };
}
