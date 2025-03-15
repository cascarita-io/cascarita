export interface GroupType {
  id: number;
  name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateNewGroupData {
  formData: GroupType;
  token: string;
}
