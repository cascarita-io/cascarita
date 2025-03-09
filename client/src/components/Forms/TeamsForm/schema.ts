import { z } from "zod";

export const teamSchema = z
  .object({
    name: z
      .string()
      .min(1, "Team name is required")
      .max(30, "Team name cannot exceed 30 characters"),

    link_to_season: z.boolean().default(false),

    season_id: z.number().optional(),

    division_id: z.number().optional(),

    file_url: z.instanceof(File).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.link_to_season) {
      if (!data.season_id || data.season_id === 0) {
        ctx.addIssue({
          path: ["season_id"],
          message: "Please select a Season",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.division_id || data.division_id === 0) {
        ctx.addIssue({
          path: ["division_id"],
          message: "Please select a Division",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
