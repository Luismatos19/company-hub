import type { MembershipRole, RoleBadgeVariant } from "@/types";
import { ROLE_COLORS, ROLE_BADGE_VARIANTS } from "@/lib/constants";

export function getRoleColor(role: MembershipRole): string {
  return ROLE_COLORS[role] || ROLE_COLORS.DEFAULT;
}

export function getRoleBadgeVariant(role: MembershipRole): RoleBadgeVariant {
  return (ROLE_BADGE_VARIANTS[role] ||
    ROLE_BADGE_VARIANTS.MEMBER) as RoleBadgeVariant;
}
