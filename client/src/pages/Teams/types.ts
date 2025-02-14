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
  divisions: ShortDivisionType[];
}

export type { TeamType, ShortDivisionType };
