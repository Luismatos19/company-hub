import { z } from "zod";
import { MembershipRole } from "@/types";

export const updateMembershipSchema = z.object({
  role: z.enum(["OWNER", "ADMIN", "MEMBER"], {
    required_error: "Função é obrigatória",
  }),
});

export type UpdateMembershipFormData = z.infer<typeof updateMembershipSchema>;
