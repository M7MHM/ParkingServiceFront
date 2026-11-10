export const PARKING_ROUTES = {
  LIST: "/parkings",
  DETAIL: (id: string) => `/parkings/${id}`,
} as const;

export const ADMIN_ROUTES = {
  LIST: "/admin/parkings",
  NEW: "/admin/parkings/new",
  EDIT: (id: string) => `/admin/parkings/${id}`,
} as const;
