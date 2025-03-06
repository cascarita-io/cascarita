import { LeagueType } from "../../../pages/Leagues/types";

interface SeasonFormProps {
  //Use to set open state from true to false after form submission
  afterSave: () => void;
  requestType?: "POST" | "PATCH" | "DELETE";
  seasonId?: number;
  leagueData?: LeagueType[];
}

interface SeasonFormData {
  name: string;
  start_date: string;
  end_date: string;
  league_id: number;
}

interface SeasonRequest {
  id?: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active?: boolean;
  league_id?: number;
}

interface SeasonResponse {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  league_id: number;
  created_at: Date;
  updated_at: Date;
  error?: string;
}

export type { SeasonFormProps, SeasonFormData, SeasonResponse, SeasonRequest };
