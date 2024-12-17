/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";

import { validateForm, shapeError } from "./utils";
import { ZodSchema, z } from "zod";

type Handler<T> = (validatedData: T) => Promise<ActionResponse>;

export function withValidation<T extends ZodSchema>(
  schema: T,
  handler: Handler<z.infer<T>>
) {
  return async (formData: Record<string, any>) => {
    const validationResult = validateForm(schema, formData);

    if (!validationResult.success) {
      return {
        error: validationResult.error,
        status: validationResult.status,
        validationErrors: validationResult.validationErrors,
      } as ActionResponse;
    }

    try {
      return await handler(validationResult.data);
    } catch (error) {
      const shapedError = shapeError(error);

      return {
        status: shapedError.status,
        error: shapedError.error,
      } as ActionResponse;
    }
  };
}
