import { z } from "zod";

export const playerSchema = z.object({
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
  season_id: z
    .number({
      required_error: "Please select a Season",
    })
    .refine(
      (id) => {
        return id !== 0;
      },
      {
        message: "Please select a Season",
      }
    ),
  division_id: z
    .number({
      required_error: "Please select a Division",
    })
    .refine(
      (id) => {
        return id !== 0;
      },
      {
        message: "Please select a Division",
      }
    ),
  team_id: z
    .number({
      required_error: "Please select a Team",
    })
    .refine(
      (id) => {
        return id !== 0;
      },
      {
        message: "Please select a Team",
      }
    ),
});
