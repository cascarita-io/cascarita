import { z } from "zod";

const answerTypeEnum = z.enum([
  "short_text",
  "long_text",
  "number",
  "date",
  "choice",
  "choices",
  "email",
  "liability",
  "signature",
  "phone_number",
  "boolean",
  "payment",
  "player",
  "photo",
]);

const secondaryTypeEnum = z.enum([
  "first_name",
  "last_name",
  "age",
  "address",
  "team_name",
]);

const fieldSchema = z.object({
  id: z.string(),
  type: z.string(),
  ref: z.string(),
});

const choiceSchema = z.object({
  label: z.string(),
});

const choicesSchema = z.object({
  labels: z.array(z.string()),
});

const playerSchema = z.object({
  season_name: z.string(),
  league_name: z.string(),
  season_id: z.number().optional(),
  league_id: z.number().optional(),
  division_name: z.string(),
  team_name: z.string(),
  division_id: z.number().optional(),
  team_id: z.union([z.number(), z.string()]).optional(),
});

const answerSchema = z.object({
  field: fieldSchema,
  type: answerTypeEnum,
  secondary_type: secondaryTypeEnum.optional(),
  number: z.number().optional(),
  //TODO: Need to change once model is updated to
  //address dynamic max amounts
  short_text: z
    .string()
    .max(30, "Can not exceed more than 30 characters")
    .optional(),
  long_text: z
    .string()
    .max(255, "Can not exceed more than 255 characters")
    .optional(),
  phone_number: z
    .string()
    .min(9, "Must be greater 9 than digits")
    .max(20, "Must be less than 20 digits")
    .optional(),
  liability: z.boolean().refine((val) => val === true, {
    message: "Liability must be accepted.",
  }),
  signature: z
    .string()
    .max(30, "Can not exceed more than 30 characters")
    .optional(),
  email: z
    .string()
    .max(100, "Can not exceed more than 100 characters")
    .email("Invalid Email Format")
    .optional(),
  //TODO: Need to handle when the date is future
  date: z.string().optional(),
  boolean: z.boolean().optional(),
  choice: choiceSchema.optional(),
  choices: choicesSchema.optional(),
  photo: z.string().optional(),
  player: playerSchema.optional(),
  payment: z.string().optional(),
  payment_type: z.string().optional(),
  paymentIntentId: z.string().optional(),
  amount: z.number().optional(),
  payment_intent_capture_by: z.string().optional(),
});

export const formSchema = z.object({
  answers: z.record(z.string(), answerSchema),
});

// Create type from schema
export type FormSchemaType = z.infer<typeof formSchema>;
