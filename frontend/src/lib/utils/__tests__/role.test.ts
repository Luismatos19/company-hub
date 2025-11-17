import { getRoleColor, getRoleBadgeVariant } from "../role";
import type { MembershipRole } from "@/types";
import { ROLE_COLORS, ROLE_BADGE_VARIANTS } from "@/lib/constants";

describe("getRoleColor", () => {
  it("should return correct color for OWNER", () => {
    expect(getRoleColor("OWNER")).toBe(ROLE_COLORS.OWNER);
  });

  it("should return correct color for ADMIN", () => {
    expect(getRoleColor("ADMIN")).toBe(ROLE_COLORS.ADMIN);
  });

  it("should return correct color for MEMBER", () => {
    expect(getRoleColor("MEMBER")).toBe(ROLE_COLORS.MEMBER);
  });

  it("should return default color for invalid role", () => {
    expect(getRoleColor("INVALID" as MembershipRole)).toBe(ROLE_COLORS.DEFAULT);
  });
});

describe("getRoleBadgeVariant", () => {
  it("should return correct variant for OWNER", () => {
    expect(getRoleBadgeVariant("OWNER")).toBe(ROLE_BADGE_VARIANTS.OWNER);
  });

  it("should return correct variant for ADMIN", () => {
    expect(getRoleBadgeVariant("ADMIN")).toBe(ROLE_BADGE_VARIANTS.ADMIN);
  });

  it("should return correct variant for MEMBER", () => {
    expect(getRoleBadgeVariant("MEMBER")).toBe(ROLE_BADGE_VARIANTS.MEMBER);
  });

  it("should return MEMBER variant for invalid role", () => {
    expect(getRoleBadgeVariant("INVALID" as MembershipRole)).toBe(ROLE_BADGE_VARIANTS.MEMBER);
  });
});

