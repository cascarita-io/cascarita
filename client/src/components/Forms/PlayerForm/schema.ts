import { z } from "zod";

export const playerSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "First name is required")
      .max(30, "First name cannot exceed 30 characters"),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(30, "Last name cannot exceed 30 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phone_number: z
      .string()
      .min(9, "Must be greater 9 than digits")
      .max(15, "Must be less than 15 digits"),
    date_of_birth: z
      .string()
      .min(1, "Date of birth is required")
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Invalid date format (MM-DD-YYYY expected)"
      ),
    address: z.string().min(1, "Address is required"),
    link_to_team: z.enum(["yes", "no"]),
    league_id: z.number().optional(),
    season_id: z.number().optional(),
    division_id: z.number().optional(),
    team_id: z.number().optional(),
    picture: z.instanceof(File).optional(),
    liability: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.link_to_team === "yes") {
        return (
          data.league_id &&
          data.league_id > 0 &&
          data.season_id &&
          data.season_id > 0 &&
          data.division_id &&
          data.division_id > 0 &&
          data.team_id &&
          data.team_id > 0
        );
      }
      return true;
    },
    {
      message: "All fields must be selected if linking to a team.",
      path: ["league_id"],
    }
  );
