import "server-only";

import { cookies } from "next/headers";
import { ZodSchema } from "zod";

export type Handler<T> = (validatedData: T) => Promise<ActionResponse>;

export type ShapedError = {
  status: number;
  error: string;
};

interface APIErrorResponse {
  response?: {
    status?: number;
    data?: Record<string, string[] | string>;
  };
}

export function shapeError(error: unknown): ShapedError {
  const defaultError = {
    status: 500,
    error: "Something went wrong",
  };

  if (!error || typeof error !== "object") return defaultError;

  const apiError = error as APIErrorResponse;

  console.log(apiError.response);

  if (!apiError.response?.data) {
    return defaultError;
  }

  const { status = 400, data } = apiError.response;

  if (typeof data !== "object") {
    return defaultError;
  }

  for (const [, message] of Object.entries(data)) {
    if (Array.isArray(message) && typeof message[0] === "string") {
      return { status, error: message[0] };
    } else if (typeof message === "string") {
      return { status, error: message };
    }
  }

  return defaultError;
}

export async function validateCsrfToken(csrfTokenFromForm: string) {
  if (process.env.TESTING === "true") {
    return;
  }

  const awaitedCookies = await cookies();
  const csrfTokenCookie = awaitedCookies.get("authjs.csrf-token");

  if (!csrfTokenCookie) {
    throw new Error("Missing CSRF token cookie");
  }

  const [csrfTokenValue] = csrfTokenCookie.value.split("|");

  if (csrfTokenFromForm !== csrfTokenValue) {
    throw new Error("Invalid CSRF token");
  }
}

export function validateForm<T extends ZodSchema>(
  schema: T,
  formData: Record<string, unknown>
) {
  try {
    validateCsrfToken(formData.csrfToken as string);
  } catch {
    return {
      success: false as const,
      status: 403,
      error: "Invalid data",
    };
  }

  const validation = schema.safeParse(formData);

  if (!validation.success) {
    return {
      success: false as const,
      status: 400,
      error: "Invalid data",
      validationErrors: validation.error.errors,
    };
  }

  return {
    success: true as const,
    data: validation.data,
  };
}
