import { PlayerType } from "../../../pages/Players/types";

interface UserFormProps {
  afterSave: () => void | null;
  requestType?: "POST" | "PATCH" | "DELETE";
  selectedUserId?: number;
  parentUserGroupId?: number;
}

interface DeleteUserData {
  id: number;
}

interface UpdateUserData {
  id: number;
  formData: {
    user_id: number;
  };
}
interface UpdatePlayerTeamsData {
  id: number;
  formData: {
    team_id: number;
    session_id: number;
  };
}

interface GetSessionData {
  formData: {
    division_id: number;
    season_id: number;
  };
}

interface UpdateUserTeamData {
  id: number;
  formData: {
    player: PlayerType;
  };
}

interface AddUserData {
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    role_id: string;
  };
}

export type {
  UserFormProps,
  DeleteUserData,
  UpdateUserData,
  UpdatePlayerTeamsData,
  AddUserData,
  UpdateUserTeamData,
  GetSessionData,
};
