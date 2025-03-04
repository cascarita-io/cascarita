interface LeagueFormProps {
  //Use to set open state from true to false after form submission
  afterSave: () => void | null;
  requestType?: "POST" | "PATCH" | "DELETE";
  leagueId?: number;
}

interface LeagueFormData {
  name: string;
  description: string;
  group_id?: number;
}

interface UpdateLeagueFormData {
  id: number;
  name: string;
  description: string;
  group_id?: number;
}

interface DeleteLeagueFormData {
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
  UpdateLeagueFormData,
  DeleteLeagueFormData,
  LeagueResponse,
};
