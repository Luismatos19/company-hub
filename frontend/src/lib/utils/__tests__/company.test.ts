import { getCompanyMemberCount, getInitials } from "../company";
import type { Company } from "@/types";

describe("getCompanyMemberCount", () => {
  it("should return count from _count when available", () => {
    const company: Company = {
      id: "1",
      name: "Test",
      logo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _count: { memberships: 5, invites: 0, activeUsers: 0 },
    };
    expect(getCompanyMemberCount(company)).toBe(5);
  });

  it("should return length from memberships array when _count is not available", () => {
    const company: Company = {
      id: "1",
      name: "Test",
      logo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      memberships: [
        { id: "1", userId: "1", companyId: "1", role: "MEMBER", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "2", userId: "2", companyId: "1", role: "ADMIN", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ],
    };
    expect(getCompanyMemberCount(company)).toBe(2);
  });

  it("should return 0 when neither _count nor memberships are available", () => {
    const company: Company = {
      id: "1",
      name: "Test",
      logo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(getCompanyMemberCount(company)).toBe(0);
  });
});

describe("getInitials", () => {
  it("should return initials from full name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("should return first two letters for single word", () => {
    expect(getInitials("John")).toBe("J");
  });

  it("should handle multiple words and take first letter of each", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });

  it("should return uppercase initials", () => {
    expect(getInitials("john doe")).toBe("JD");
  });

  it("should return ?? for null", () => {
    expect(getInitials(null)).toBe("??");
  });

  it("should return ?? for undefined", () => {
    expect(getInitials(undefined)).toBe("??");
  });

  it("should return ?? for empty string", () => {
    expect(getInitials("")).toBe("??");
  });
});

