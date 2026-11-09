export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  traceId?: string;
}
export interface ValidationProblemDetails extends ProblemDetails {
  errors: Record<string, string[]>;
}
