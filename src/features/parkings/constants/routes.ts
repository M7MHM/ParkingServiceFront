export const PARKING_ROUTES = {
  LIST: "/parking-lots",
  DETAIL: (id: string) => `/parking-lots/${id}`,
} as const;