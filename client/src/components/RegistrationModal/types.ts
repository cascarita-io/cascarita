export interface State {
  page: number;
  firstName: string;
  lastName: string;
  language_id: number | string;
  isExistingOrg: boolean;
  org: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  selectedOrg: string;
  group_code: string;
}

export type Action =
  | { type: "SET_FIELD"; field: keyof State; value: State[keyof State] }
  | { type: "NEXT_PAGE" }
  | { type: "PREVIOUS_PAGE" }
  | { type: "RESET_FORM" };
