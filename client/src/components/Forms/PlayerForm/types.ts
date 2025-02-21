import { DivisionType } from "../../../pages/Division/types";
import { LeagueType } from "../../../pages/Leagues/types";
import { PlayerType } from "../../../pages/Players/types";
import { SeasonType } from "../../../pages/Seasons/types";
import { TeamType } from "../../../pages/Teams/types";

interface PlayerFormProps {
  player: PlayerType;
  leagues: LeagueType[];
  teams: TeamType[];
  divisions: DivisionType[];
  seasons: SeasonType[];
  afterSave: () => void;
  requestType?: "POST" | "PATCH" | "DELETE";
}

export type { PlayerFormProps };
