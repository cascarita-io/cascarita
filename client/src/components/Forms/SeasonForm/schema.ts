import { z } from "zod";

export const seasonSchema = z
  .object({
    name: z
      .string()
      .min(1, "Season name is required")
      .max(100, "Season name cannot exceed 100 characters"),

    league_id: z
      .number({
        required_error: "Please select a League",
      })
      .refine(
        (id) => {
          return id !== 0;
        },
        {
          message: "Please select a League",
        }
      ),

    start_date: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Invalid date format (MM-DD-YYYY expected)"
      ),
    end_date: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Invalid date format (MM-DD-YYYY expected)"
      ),
  })
  .refine(
    (data) => {
      const startDate = new Date(`${data.start_date}T00:00:00Z`);
      const endDate = new Date(`${data.end_date}T00:00:00Z`);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return false; // Fail validation if the dates are invalid
      }

      return startDate <= endDate;
    },
    {
      message: "Start date cannot be after end date",
      path: ["start_date"],
    }
  );
