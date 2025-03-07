import { DivisionType } from "../../../pages/Division/types";
import { SeasonType } from "../../../pages/Seasons/types";

interface TeamFormProps {
  //Use to set open state from true to false after form submission
  afterSave: () => void;
  requestType?: "POST" | "PATCH" | "DELETE";
  teamId?: number;
  divisionsData?: DivisionType[];
  seasonsData?: SeasonType[];
}

interface TeamFormData {
  teamName: string;
  seasonId: number;
  divisionId: number;
  linkToSeason: boolean;
}

interface TeamRequest {
  id?: number;
  name?: string;
  group_id?: number;
  division_id?: number;
  team_logo?: string | null;
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
}

export type { TeamFormProps, TeamFormData, TeamRequest, TeamResponse };
