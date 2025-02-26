interface LeagueFormProps {
  //Use to set open state from true to false after form submission
  afterSave: () => void | null;
  requestType?: "POST" | "PATCH" | "DELETE";
  leagueId?: number;
  name?: string;
  description?: string;
}

interface LeagueFormData {
  name: string;
  description: string;
  group_id?: number;
}

interface CreateNewLeagueData {
  formData: LeagueFormData;
}

interface UpdateLeagueData {
  id: number;
  formData: LeagueFormData;
}

interface DeleteLeagueData {
  id: number;
}

interface LeagueResponse {
  id: number;
  name: string;
  description: string;
  group_id: number;
}

export type {
  LeagueFormProps,
  LeagueFormData,
  CreateNewLeagueData,
  UpdateLeagueData,
  DeleteLeagueData,
  LeagueResponse,
};
