import { DivisionType } from "../../../pages/Division/types";
import { SeasonType } from "../../../pages/Seasons/types";

interface TeamFormProps {
  //Use to set open state from true to false after form submission
  afterSave: () => void;
  requestType?: "POST" | "PATCH" | "DELETE";
  teamId?: number;
  teamName?: string;
  seasonId?: number;
  divisionId?: number;
  teamLogo?: string;
  divisionsData?: DivisionType[];
  seasonsData?: SeasonType[];
}

interface TeamFormData {
  name: string;
  season_id?: number;
  division_id?: number;
  link_to_season: boolean;
  file_url?: File;
}

interface TeamRequest {
  id?: number;
  name?: string;
  group_id?: number;
  division_id?: number;
  team_logo?: string;
  season_id?: number;
  link_to_season?: boolean;
}

interface TeamResponse {
  id: number;
  groupId: number;
  name: string;
  team_logo: string | null;
  updated_at: string;
  created_at: string;
  error?: string;
}

export type { TeamFormProps, TeamFormData, TeamRequest, TeamResponse };
