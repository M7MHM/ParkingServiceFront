import { z } from "zod";

import type { LoginRequest } from "../types";
import { emailSchema, passwordRequiredSchema } from "./fields";

/** Mirrors `LoginCommandValidator`. */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordRequiredSchema,
}) satisfies z.ZodType<LoginRequest>;

export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginFormOutput = z.output<typeof loginSchema>;
