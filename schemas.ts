import { z } from "zod";

export const emailSchema = z.string().email({ message: "Invalid email" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Passwords must be at least eight characters" })
  .max(100, { message: "Password must not exceed hundred characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\dA-Za-z]{8,}$/, {
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

export const typeSchemas = {
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  calender: z.date(),
  url: z.string().url("Invalid URL"),
  text: z.string(),
  number: z.coerce.number(),
  checkbox: z.boolean(),
  select: z.string(),
  selectWithLogo: z.string(),
  radio: z.string(),
  textarea: z.string(),
  date: z.date(),
  time: z.string(),
  datetime: z.date(),
  file: z.string(),
  image: z.string(),
  video: z.string(),
  audio: z.string(),
  tel: telSchema,
};
