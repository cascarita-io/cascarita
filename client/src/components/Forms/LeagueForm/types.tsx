interface LeagueFormProps {
  //Use to set open state from true to false after form submission
  afterSave: () => void | null;
  requestType?: "POST" | "PATCH" | "DELETE";
  leagueId?: number;
}

interface LeagueFormData {
  name: string;
  description?: string;
}

interface LeagueRequest {
  id?: number;
  name?: string;
  description?: string;
  group_id?: number;
}

interface LeagueResponse {
  id: number;
  name: string;
  description: string;
  group_id: number;
  error?: string;
}

export type { LeagueFormProps, LeagueFormData, LeagueRequest, LeagueResponse };
