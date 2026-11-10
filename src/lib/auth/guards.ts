import { ApiError } from "@/lib/api/client";

import { getCurrentUser } from "./session";
import type { CurrentUser } from "./session";

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new ApiError({ status: 401, title: "Unauthorized.", detail: "Please sign in." });
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "Admin") {
    throw new ApiError({ status: 403, title: "Forbidden.", detail: "Administrator access is required." });
  }
  return user;
}
