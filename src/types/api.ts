/**
 * RFC 7807 body produced by `ApiExceptionMiddleware` and by ASP.NET's
 * automatic `[ApiController]` model-binding failures.
 */
export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  traceId?: string;
}

/**
 * Returned with HTTP 400 for FluentValidation failures.
 * Keys are the backend property names (PascalCase, e.g. `Email`), not the camelCase JSON names.
 */
export interface ValidationProblemDetails extends ProblemDetails {
  errors: Record<string, string[]>;
}
