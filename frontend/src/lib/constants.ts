export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const DEFAULT_PAGE_SIZE = 10;
export const AUTH_CHECK_DELAY = 100; // ms

export const ROLE_COLORS = {
  OWNER: "bg-red-500",
  ADMIN: "bg-yellow-500",
  MEMBER: "bg-blue-500",
  DEFAULT: "bg-gray-500",
} as const;

export const ROLE_BADGE_VARIANTS = {
  OWNER: "destructive",
  ADMIN: "secondary",
  MEMBER: "default",
} as const;

