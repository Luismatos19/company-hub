import type { Company } from "@/types";

export function getCompanyMemberCount(company: Company): number {
  return company._count?.memberships ?? company.memberships?.length ?? 0;
}

export function getInitials(name: string | undefined | null): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
