import { z } from "zod";

import type { RegisterRequest } from "../types";
import { emailSchema, fullNameSchema, newPasswordSchema } from "./fields";

/** Mirrors `RegisterCommandValidator`. */
export const registerSchema = z.object({
  email: emailSchema,
  password: newPasswordSchema,
  fullName: fullNameSchema,
}) satisfies z.ZodType<RegisterRequest>;

export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterFormOutput = z.output<typeof registerSchema>;
