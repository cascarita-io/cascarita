interface ShortDivisionType {
  id: number;
  name: string;
}
interface TeamType {
  id: number;
  name: string;
  team_logo: string;
  created_at: Date;
  updated_at: Date;
  group_id: number;
  division_name: string;
  division_id: number;
  season_name: string;
  season_id: number;
}

export type { TeamType, ShortDivisionType };
