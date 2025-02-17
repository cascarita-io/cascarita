export interface SeasonType {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  league_id: number;
  league_name: string;
}
