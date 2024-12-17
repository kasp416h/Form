/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";

import { cookies } from "next/headers";
import { ZodSchema } from "zod";

export type ShapedError = {
  status: number;
  error: string;
};

export async function validateCsrfToken(csrfTokenFromForm: string) {
  const awaitedCookies = await cookies();
  const csrfTokenCookie = awaitedCookies.get(
    process.env.NODE_ENV === "production"
      ? "__Host-authjs.csrf-token"
      : "authjs.csrf-token"
  );

  if (!csrfTokenCookie) {
    throw new Error("Missing CSRF token cookie");
  }

  const [csrfTokenValue] = csrfTokenCookie.value.split("|");

  if (csrfTokenFromForm !== csrfTokenValue) {
    throw new Error("Invalid CSRF token");
  }
}

export function shapeError(error: any): ShapedError {
  const defaultError = {
    status: 500,
    error: "Something went wrong",
  };

  if (!error || typeof error !== "object") return defaultError;

  if (error.response?.data) {
    const data: Record<string, string[] | string> = error.response.data;

    if (typeof data === "object") {
      for (const [, message] of Object.entries(data)) {
        if (Array.isArray(message) && typeof message[0] === "string") {
          return {
            status: error.response.status || 400,
            error: message[0],
          };
        } else if (message) {
          return {
            status: error.response.status || 400,
            error: message as string,
          };
        }
      }
    }
  }

  return defaultError;
}

export function validateForm<T extends ZodSchema>(
  schema: T,
  formData: Record<string, any>
) {
  try {
    validateCsrfToken(formData.csrfToken);
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
