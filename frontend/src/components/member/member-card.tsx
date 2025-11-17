import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import type { Membership } from "@/types";
import { getRoleColor, getRoleBadgeVariant } from "@/lib/utils/role";

interface MemberCardProps {
  membership: Membership;
  isCurrentUser?: boolean;
  onEdit: () => void;
}

export function MemberCard({ membership, isCurrentUser, onEdit }: MemberCardProps) {
  const email = membership.user?.email || "Email não disponível";
  const initial = email[0].toUpperCase();

  return (
    <Card className="hover:shadow-md transition-shadow w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`size-12 rounded-full ${getRoleColor(
                membership.role
              )} flex items-center justify-center text-white font-semibold text-sm`}
            >
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{email}</span>
                {isCurrentUser && (
                  <span className="text-xs text-muted-foreground">(You)</span>
                )}
              </div>
              <Badge
                variant={getRoleBadgeVariant(membership.role)}
                className="mt-1"
              >
                {membership.role}
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="size-4 mr-2" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

