import { DivisionType } from "../../../pages/Division/types";
import { LeagueType } from "../../../pages/Leagues/types";
import { PlayerType } from "../../../pages/Players/types";
import { SeasonType } from "../../../pages/Seasons/types";
import { TeamType } from "../../../pages/Teams/types";

interface PlayerFormProps {
  player?: PlayerType;
  leagues?: LeagueType[];
  teams?: TeamType[];
  divisions?: DivisionType[];
  seasons?: SeasonType[];
  afterSave: () => void;
  requestType?: "POST" | "PATCH" | "DELETE";
}

interface PlayerFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: Date | string;
  address: string;
  picture?: File;
  liability_photo: boolean;
  liability_minor: boolean;
  link_to_team: "yes" | "no";
  league_id?: number;
  season_id?: number;
  division_id?: number;
  team_id?: number;
}

interface PlayerFormPageProps {
  requestError?: string;
  setRequestError?: React.Dispatch<React.SetStateAction<string>>;
  leagues?: LeagueType[];
  seasons?: SeasonType[];
  divisions?: DivisionType[];
  teams?: TeamType[];
  playerPhoto?: string;
}

interface PlayerRequest {
  id?: number;
  team_id?: number;
  session_id?: number;
}

export type {
  PlayerFormProps,
  PlayerRequest,
  PlayerFormData,
  PlayerFormPageProps,
};
