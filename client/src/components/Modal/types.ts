interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

interface ModalContentProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

interface State {
  page: number;
  firstName: string;
  lastName: string;
  email: string;
  language: string;
  isExistingOrg: boolean;
  org: string;
  selectedOrg: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

// Action types based on your reducer cases
type Action =
  | { type: "SET_FIELD"; field: keyof State; value: string | boolean | number }
  | { type: "NEXT_PAGE" }
  | { type: "PREVIOUS_PAGE" }
  | { type: "RESET_FORM" };

export type { ModalProps, ModalContentProps, Action };
