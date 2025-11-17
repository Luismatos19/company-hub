import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Users } from "lucide-react";
import type { Company } from "@/types";
import { getCompanyMemberCount } from "@/lib/utils/company";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const router = useRouter();
  const memberCount = getCompanyMemberCount(company);

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow w-full"
      onClick={() => router.push(`/dashboard/company/${company.id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{company.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Users className="size-4" />
              {memberCount} {memberCount === 1 ? "membro" : "membros"}
            </CardDescription>
          </div>
          <ChevronRight className="size-5 text-muted-foreground" />
        </div>
      </CardHeader>
    </Card>
  );
}

