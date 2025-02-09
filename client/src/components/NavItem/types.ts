export interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  labelType: string;
  selected: boolean;
  onItemClick: (label: string) => void;
  className?: string;
}
