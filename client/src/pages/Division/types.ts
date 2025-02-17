interface DivisionType {
  id: number;
  name: string;
  group_id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  league_id: number;
  league_name: string;
  season_id: number;
  season_name: string;
}

export type { DivisionType };
