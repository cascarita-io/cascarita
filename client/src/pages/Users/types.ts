type UserRole = "admin" | "player" | "staff";
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  date_of_birth: Date;
  phone_number: string;
  internally_created: boolean;
  picture: string;
  user_roles: UserRole[]; // Enforces only allowed values
}
