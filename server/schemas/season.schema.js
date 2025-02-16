const { z } = require("zod");

const SeasonSchema = z.object({
  id: z.number(),
  name: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  // TODO: in the database make this boolean, honestly might not be needed with start_date, end_date
  is_active: z.boolean().nullable(),
  league_id: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
});

const SeasonsSchema = z.array(SeasonSchema);

const CreateSeasonSchema = z.object({
  name: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  is_active: z.boolean().nullable(),
  league_id: z.number(),
});

const UpdateSeasonSchema = z.object({
  name: z.string().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  is_active: z.boolean().nullable().optional(),
  league_id: z.number().optional(),
});

module.exports = {
  SeasonSchema,
  SeasonsSchema,
  CreateSeasonSchema,
  UpdateSeasonSchema,
};
