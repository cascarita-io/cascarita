import { z } from "zod";

export const divisionSchema = z.object({
  name: z
    .string()
    .min(2, "Season name is must be at least 2 characters")
    .max(50, "Season name cannot exceed 50 characters"),

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
      },
    ),
});
