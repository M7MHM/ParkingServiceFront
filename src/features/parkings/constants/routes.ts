export const PARKING_ROUTES = {
  LIST: "/parkings",
  DETAIL: (id: string) => `/parkings/${id}`,
} as const;
