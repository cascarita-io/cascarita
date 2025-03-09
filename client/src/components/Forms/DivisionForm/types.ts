import { SeasonType } from "../../../pages/Seasons/types";

interface DivisionFormProps {
  //Use to set open state from true to false after form submission
  afterSave: () => void;
  requestType?: "POST" | "PATCH" | "DELETE";
  divisionId?: number;
  seasonId?: number;
  seasonData?: SeasonType[];
}

interface DivisionFormData {
  name: string;
  season_id: number;
}

interface DivisionRequest {
  id?: number;
  name?: string;
  group_id?: number;
  season_id?: number;
  error?: string;
}

interface DivisionResponse {
  id: number;
  groupId: string;
  name: string;
  updated_at: string;
  created_at: string;
  error: string;
}

export type {
  DivisionFormProps,
  DivisionFormData,
  DivisionRequest,
  DivisionResponse,
};
