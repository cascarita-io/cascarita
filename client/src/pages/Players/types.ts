export interface ShortTeamType {
  id: number;
  name: string;
  session_id: number;
}

export interface PlayerType {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string | null;
  date_of_birth: Date | null;
  phone_number: string | null;
  internally_created: boolean | null;
  picture: string | null;
  teams?: ShortTeamType[];
  season_id?: number;
  division_id?: number;
  league_id?: number;
}
