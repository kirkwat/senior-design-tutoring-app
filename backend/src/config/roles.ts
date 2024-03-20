export const ROLES = ["user", "tutor", "admin"] as const;

export type Role = (typeof ROLES)[number];
