import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  expiresAt: z
    .string()
    .min(1, "Data de expiração é obrigatória")
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const now = new Date();
        return selectedDate > now;
      },
      {
        message: "Data de expiração deve ser no futuro",
      }
    ),
});

export const acceptInviteSchema = z.object({
  token: z
    .string()
    .min(1, "Token é obrigatório"),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
export type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>;

