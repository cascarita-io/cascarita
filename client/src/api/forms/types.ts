export enum Currency {
  USD = "USD",
}
export type FieldType =
  | "multiple_choice"
  | "short_text"
  | "long_text"
  | "dropdown"
  | "email"
  | "phone_number"
  | "payment"
  | "player"
  | "photo"
  | "liability"
  | "date"
  | "signature";

export interface Validation {
  max_length?: number;
  required: boolean;
}

export interface Label {
  id: string;
  ref: string;
  label: string;
}

export interface ShortTeam {
  team_id: number;
  team_name: string;
}
export interface PlayerBlockChoices {
  teams: ShortTeam[];
}

export interface Properties {
  choices?: Label[];
  allow_multiple_selection?: boolean;
  default_country_code?: string;
  description?: string;
  price?: {
    type: string;
    value: string;
    feeValue: string;
    currency: Currency;
    isCustomerPayingFee: boolean;
  };
  stripe_account?: {
    id: string;
    stripe_account_id: string;
  };
  player_block_choices?: PlayerBlockChoices;
}

export interface Field {
  id: string;
  title: string;
  ref: string;
  validations?: Validation;
  properties?: Properties;
  type: FieldType;
  secondary_type?: string;
  season_name?: string;
  season_id?: number;
  league_name?: string;
  league_id?: number;
  division_name?: string;
  division_id?: number;
  file_url?: string;
}

export interface Form {
  fields: Field[];
}

type SortBy = "created_at" | "last_updated_at";

type OrderBy = "asc" | "desc";

export interface GetFormsParams {
  page?: number;
  page_size?: number;
  search?: string | null;
  workspace_id?: string | null;
  sort_by?: SortBy | null;
  order_by?: OrderBy | null;
}

export type AnswerType =
  | "short_text"
  | "long_text"
  | "number"
  | "date"
  | "choice"
  | "choices"
  | "email"
  | "liability"
  | "signature"
  | "date"
  | "phone_number"
  | "boolean"
  | "payment"
  | "player"
  | "photo";

export type SecondaryType =
  | "first_name"
  | "last_name"
  | "age"
  | "address"
  | "team_name";

export interface Answer {
  field: {
    id: string;
    type: string;
    ref: string;
  };
  type: AnswerType;
  secondary_type?: SecondaryType;
  number?: number;
  short_text?: string;
  long_text?: string;
  phone_number?: string;
  liability?: boolean;
  signature?: string;
  email?: string;
  date?: string;
  boolean?: boolean;
  choice?: { label: string };
  choices?: { labels: string[] };
  photo?: string;
  player?: {
    season_name: string;
    league_name: string;
    season_id: number | null;
    league_id: number | null;
    division_name: string;
    team_name: string;
    division_id: number | null;
    team_id: number | null;
  };
  payment?: string;
  payment_type?: string;
  paymentIntentId?: string;
  amount?: number;
  payment_intent_capture_by?: string;
}
