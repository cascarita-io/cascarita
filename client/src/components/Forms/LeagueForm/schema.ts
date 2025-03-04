import { z } from "zod";

export const leagueSchema = z.object({
  name: z.string().min(1, "League name cannot be empty"),
  description: z.string().nullable(),
});
