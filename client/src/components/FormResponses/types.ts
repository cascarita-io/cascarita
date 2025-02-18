import { Answer, Field } from "../../api/forms/types";

export interface FormResponsesProps {
  formId: string;
}

// Response type representing the structure of a Typeform response
export interface TypeformResponse {
  landing_id: string;
  token: string;
  response_id: string;
  response_type: string;
  landed_at: string;
  submitted_at: string;
  metadata: {
    user_agent: string;
    platform: string;
    referer: string;
    network_id: string;
    browser: string;
  };
  hidden: Record<string, unknown>;
  calculated: {
    score: number;
  };
  answers: Answer[];
}

export interface FormResponse {
  _id: string;
  createdAt: string;
  form_id: string;
  response: TypeformResponse;
}

// Responses data type representing the structure of the response data object from Typeform
export interface TypeformResponsesData {
  items: TypeformResponse[];
  total_items: number;
  page_count: number;
}

// Form data type representing the structure of the form data object from Typeform
export interface TypeformFormData {
  fields: Field[];
}

// Props for the FormResponses component
export interface FormResponsesProps {
  formId: string;
}

export type AnswerRecordMap = Map<string, Map<string, Answer>>;
