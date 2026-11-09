import { z } from "zod";

import { countCodePoints } from "@/lib/utils/string";

export const EMAIL_MAX_LENGTH = 255;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const FULL_NAME_MAX_LENGTH = 150;

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const emailSchema = z
  .string({ error: "Email is required." })
  .trim()
  .min(1, "Email is required.")
  .max(EMAIL_MAX_LENGTH, `Email cannot be longer than ${EMAIL_MAX_LENGTH} characters.`)
  .regex(EMAIL_PATTERN, "Enter a valid email address.");

export const passwordRequiredSchema = z
  .string({ error: "Password is required." })
  .min(1, "Password is required.")
  .refine(
    (value) => countCodePoints(value) <= PASSWORD_MAX_LENGTH,
    `Password cannot contain more than ${PASSWORD_MAX_LENGTH} characters.`,
  );

export const newPasswordSchema = z
  .string({ error: "Password is required." })
  .refine(
    (value) => countCodePoints(value) >= PASSWORD_MIN_LENGTH,
    `Password must contain at least ${PASSWORD_MIN_LENGTH} characters.`,
  )
  .refine(
    (value) => countCodePoints(value) <= PASSWORD_MAX_LENGTH,
    `Password cannot contain more than ${PASSWORD_MAX_LENGTH} characters.`,
  );

export const fullNameSchema = z
  .string({ error: "Full name is required." })
  .trim()
  .min(1, "Full name is required.")
  .max(FULL_NAME_MAX_LENGTH, `Full name cannot be longer than ${FULL_NAME_MAX_LENGTH} characters.`);
