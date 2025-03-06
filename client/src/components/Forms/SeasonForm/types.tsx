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
  is_active?: boolean;
  league_id: number;
}

interface UpdateSeasonData {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  league_id: number;
}

interface DeleteSeasonData {
  id: number;
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
}

export type {
  SeasonFormProps,
  SeasonFormData,
  CreateNewSeasonData,
  UpdateSeasonData,
  DeleteSeasonData,
  SeasonResponse,
};
