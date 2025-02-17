import { PlayerType } from "../../../pages/Players/types";
import { TeamType } from "../../../pages/Teams/types";

interface PlayerFormProps {
  player: PlayerType;
  afterSave: () => void;
  requestType?: "POST" | "PATCH" | "DELETE";
  teams: TeamType[];
}

export type { PlayerFormProps };
