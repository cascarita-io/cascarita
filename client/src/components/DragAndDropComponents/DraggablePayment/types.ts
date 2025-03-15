import { z } from "zod";

export const StripeAccountSchema = z.object({
  id: z.number(),
  stripe_account_id: z.string(),
  stripe_status_id: z.number(),
  account_email: z.string().nullable(),
  first_name: z.string(),
  last_name: z.string(),
  platform_account_description: z.string().nullable(),
  platform_account_name: z.string().nullable(),
  stripe_account_name: z.string().nullable(),
  stripe_status: z.string(),
  support_email: z.string().nullable(),
  user_email: z.string(),
  user_id: z.number(),
  stripe_account_link: z.string().optional(),
});

export type StripeAccount = z.infer<typeof StripeAccountSchema>;
