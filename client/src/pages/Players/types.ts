export interface ShortTeamType {
  id: number;
  name: string;
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
}
