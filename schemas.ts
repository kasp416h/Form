import { z } from "zod";

export const emailSchema = z.string().email({ message: "Invalid email" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Passwords must be at least eight characters" })
  .max(100, { message: "Password must not exceed hundred characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      "Passwords must contain at least one uppercase letter, one lowercase letter, and one number",
  });

export const postalCodeSchema = z
  .string()
  .regex(/^\d{5}(-\d{4})?$/, "Invalid postal code");

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least three characters")
  .max(20, "Username must be at most twenty characters")
  .regex(/^[\dA-Za-z]+$/, "Username must be alphanumeric");

export const telSchema = z
  .string()
  .length(8, { message: "Phone number must be prceisely eight digits" })
  .regex(/^\d{8}$/, { message: "Phone number must only include digits" })
  .refine(
    (value) => {
      const firstChar = value[0];
      return [...value].some((char) => char !== firstChar);
    },
    {
      message: "Phone number cannot consist of only one repeated digit",
    }
  );

export const objectIdSchema = z.string().regex(/^[a-f0-9]{32}$/, "Invalid ID");

export const vatNoSchema = z
  .string()
  .min(1, "Required")
  .refine((val) => /^[A-Za-z]+/.test(val), {
    message: "Missing country code",
  })
  .refine((val) => /[0-9]+$/.test(val), {
    message: "Missing VAT number",
  });

export const blobSchema = (required = true) =>
  z
    .any()
    .refine(
      (val) =>
        (required && val instanceof File && val.size > 0) ||
        (!required && (!val || (val instanceof File && val.size > 0))),
      "Invalid image file"
    );
