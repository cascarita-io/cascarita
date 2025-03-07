import { z } from "zod";

export const divisionSchema = z.object({
  name: z
    .string()
    .min(1, "Season name is required")
    .max(100, "Season name cannot exceed 100 characters"),

  season_id: z
    .number({
      required_error: "Please select a season",
    })
    .refine(
      (id) => {
        return id !== 0;
      },
      {
        message: "Please select a season",
      }
    ),
});
