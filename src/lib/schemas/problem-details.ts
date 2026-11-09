import { z } from "zod";

import type { ProblemDetails, ValidationProblemDetails } from "@/types/api";

export const problemDetailsSchema = z.looseObject({
  type: z.string().nullish(),
  title: z.string().nullish(),
  status: z.number().int().nullish(),
  detail: z.string().nullish(),
  instance: z.string().nullish(),
  traceId: z.string().optional(),
}) satisfies z.ZodType<ProblemDetails>;

export const validationProblemDetailsSchema = z.looseObject({
  type: z.string().nullish(),
  title: z.string().nullish(),
  status: z.number().int().nullish(),
  detail: z.string().nullish(),
  instance: z.string().nullish(),
  traceId: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())),
}) satisfies z.ZodType<ValidationProblemDetails>;
