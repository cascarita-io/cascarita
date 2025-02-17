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
  group_id: number;
  season_id: number;
}

interface CreateNewDivisionData {
  formData: DivisionFormData;
}

interface UpdateDivisionData {
  id: number;
  formData: DivisionFormData;
}

interface DeleteDivisionData {
  id: number;
}

interface DivisionResponse {
  id: number;
  groupId: string;
  name: string;
  updated_at: string;
  created_at: string;
}

export type {
  DivisionFormProps,
  CreateNewDivisionData,
  UpdateDivisionData,
  DeleteDivisionData,
  DivisionResponse,
};
