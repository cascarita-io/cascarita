import { z } from "zod";

export const playerSchema = z
  .object({
    link_to_team: z.boolean().optional(),
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
  })
  .superRefine((data, ctx) => {
    if (data.link_to_team) {
      if (!data.league_id || data.league_id === 0) {
        ctx.addIssue({
          path: ["league_id"],
          message: "Please select a League",
          code: z.ZodIssueCode.custom,
        });
      }

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

      if (!data.team_id || data.team_id === 0) {
        ctx.addIssue({
          path: ["team_id"],
          message: "Please select a Team",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
