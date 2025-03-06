import { z } from "zod";

export const seasonSchema = z
  .object({
    name: z
      .string()
      .min(1, "Season name is required")
      .max(100, "Season name cannot exceed 100 characters"),

    league_id: z.number({
      required_error: "Please select a league",
    }),

    start_date: z
      .string()
      .min(1, "Start date is required")
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Start date must be a valid date string",
      }),

    end_date: z
      .string()
      .min(1, "End date is required")
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "End date must be a valid date string",
      }),
  })
  .refine(
    (data) => {
      // Convert strings to dates for comparison
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      return startDate <= endDate;
    },
    {
      message: "Start date cannot be after end date",
      path: ["start_date"], // This targets the error at the start date field
    }
  );
